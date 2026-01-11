"""
Passenger WSGI file for cPanel deployment
This file adapts FastAPI (ASGI) to work with Passenger (WSGI)
"""
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Change to backend directory
os.chdir(backend_dir)

# Import ASGI-to-WSGI adapter - Use Mangum (better for Passenger)
try:
    from mangum import Mangum
    from app.main import app
    
    # Mangum is better for Passenger/WSGI environments
    # It properly handles ASGI to WSGI conversion
    handler = Mangum(app, lifespan="off")
    
    # WSGI application function
    def application(environ, start_response):
        """
        WSGI application wrapper for FastAPI via Mangum
        """
        try:
            # Call Mangum handler
            response = handler(environ, start_response)
            return response
        except Exception as e:
            # Error handling
            status = '500 Internal Server Error'
            headers = [('Content-type', 'application/json')]
            start_response(status, headers)
            import traceback
            error_msg = f'{{"error": "Internal server error", "detail": "{str(e)}"}}'
            return [error_msg.encode('utf-8')]
    
except ImportError:
    # Fallback: Try asgiref
    try:
        from asgiref.wsgi import WsgiToAsgi
        from app.main import app
        
        # Convert ASGI app to WSGI
        application = WsgiToAsgi(app)
        
    except ImportError:
        # Last resort: Basic error message
        def application(environ, start_response):
            status = '500 Internal Server Error'
            headers = [('Content-type', 'application/json')]
            start_response(status, headers)
            error_msg = '{"error": "ASGI adapter not installed. Please install mangum: pip install mangum"}'
            return [error_msg.encode('utf-8')]
