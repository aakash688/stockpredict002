export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/30 mt-20">
      <div className="container px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 text-foreground">StockPredict</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Advanced stock analysis and prediction platform for informed investment decisions.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-foreground">Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="hover:text-foreground transition-colors cursor-pointer">Real-time Stock Data</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">AI Price Predictions</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Portfolio Tracking</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Watchlist Management</li>
            </ul>
          </div>
          
          {/* Disclaimer */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-4 text-foreground">Disclaimer</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform is for educational purposes only. Not financial advice. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar - Separate Section */}
      <div className="border-t border-white/8 bg-background/80">
        <div className="container px-6 md:px-12 lg:px-16 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} StockPredict. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

