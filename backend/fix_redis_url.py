"""Fix Redis URL in .env file - Change redis:// to rediss:// for Upstash TLS"""
import os
import re

env_file = '.env'

if not os.path.exists(env_file):
    print(f"[ERROR] {env_file} file not found")
    print("Please create a .env file first")
    exit(1)

# Read the file
with open(env_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if REDIS_URL exists
if 'REDIS_URL' not in content:
    print("[ERROR] REDIS_URL not found in .env file")
    exit(1)

# Check if it already uses rediss://
if 'REDIS_URL=rediss://' in content:
    print("[INFO] REDIS_URL already uses rediss:// (TLS)")
    print("[INFO] No changes needed")
    exit(0)

# Fix the URL - change redis:// to rediss://
# Handle both single line and multi-line formats
old_pattern = r'REDIS_URL=redis://([^\n]+)'
new_pattern = r'REDIS_URL=rediss://\1'

if re.search(old_pattern, content):
    # Replace redis:// with rediss://
    new_content = re.sub(old_pattern, new_pattern, content)
    
    # Also handle multi-line format (if URL is split)
    new_content = re.sub(
        r'REDIS_URL=redis://([^\n]+)\n([^\n]+)',
        r'REDIS_URL=rediss://\1\2',
        new_content
    )
    
    # Write back
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("[SUCCESS] Fixed REDIS_URL in .env file")
    print("  Changed 'redis://' to 'rediss://' (TLS enabled)")
    print("\n[INFO] Please restart your backend server for changes to take effect")
    print("  The Redis connection should now work with Upstash")
else:
    print("[WARNING] Could not find REDIS_URL with redis:// pattern")
    print("[INFO] Current REDIS_URL format:")
    for line in content.split('\n'):
        if 'REDIS_URL' in line:
            print(f"  {line[:80]}...")

