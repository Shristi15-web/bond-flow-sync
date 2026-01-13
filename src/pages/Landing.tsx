import { Link } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlowCard } from "@/components/ui/glow-card";
import { Shield, Coins, TrendingUp, Globe, Calculator, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [investment, setInvestment] = useState(1000);
  const [years, setYears] = useState(5);
  const rate = 4.25;
  const returns = investment * Math.pow(1 + rate / 100, years) - investment;

  return (
    <GridBackground>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">BondFi</span>
          </Link>
          <Link to="/login">
            <GradientButton size="sm">Login</GradientButton>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6">
            <Globe className="w-4 h-4" />
            Powered by Blockchain Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Government Bonds,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Reimagined
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access fractional government bonds using stablecoins. Transparent yields, institutional-grade security, blockchain efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <GradientButton size="lg">
                Start Investing <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </Link>
            <GradientButton variant="outline" size="lg">Learn More</GradientButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why BondFi?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Coins, title: "Stablecoin Powered", desc: "Invest using USDC, USDT, or other major stablecoins. No currency conversion hassles." },
              { icon: TrendingUp, title: "Fractional Access", desc: "Start with as little as $50. Own fractions of high-value government bonds." },
              { icon: Shield, title: "Institutional Security", desc: "Multi-custodian setup with real-time verification and government oversight." },
            ].map((f, i) => (
              <GlowCard key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <GlowCard glowColor="secondary">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Returns Calculator</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground">Investment Amount ($)</label>
                <input
                  type="range" min="100" max="50000" step="100" value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
                <p className="text-2xl font-bold text-foreground">${investment.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Investment Period (Years)</label>
                <input
                  type="range" min="1" max="15" value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
                <p className="text-2xl font-bold text-foreground">{years} years</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Estimated Returns at {rate}% APY</p>
                <p className="text-4xl font-bold text-success">${returns.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of investors accessing government bonds on-chain.</p>
          <Link to="/login">
            <GradientButton size="lg">Get Started <ArrowRight className="w-5 h-5" /></GradientButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2024 BondFi. Hackathon Demo Project.
        </div>
      </footer>
    </GridBackground>
  );
}
