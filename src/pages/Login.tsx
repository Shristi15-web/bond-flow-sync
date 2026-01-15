import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useBondContext } from "@/context/BondContext";
import { UserRole, DEMO_CREDENTIALS } from "@/types/bond";
import { 
  User, Building2, ArrowLeft, Mail, Lock, Globe, Wallet, 
  CheckCircle2, Loader2
} from "lucide-react";

type Step = 'role' | 'auth' | 'authenticating' | 'approved';

const roleLabels: Record<UserRole, string> = {
  investor: 'Investor',
  lister: 'Lister',
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useBondContext();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState<'INR' | 'USDT'>('USDT');
  const [institutionName, setInstitutionName] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Authentication timer effect
  useEffect(() => {
    if (step === 'authenticating') {
      const duration = 3000;
      const interval = 50;
      const increment = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setAuthProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + increment;
        });
      }, interval);
      
      const approvedTimer = setTimeout(() => {
        setStep('approved');
      }, duration);
      
      return () => {
        clearInterval(timer);
        clearTimeout(approvedTimer);
      };
    }
  }, [step]);

  // Redirect after approved
  useEffect(() => {
    if (step === 'approved' && selectedRole) {
      const redirectTimer = setTimeout(() => {
        login(selectedRole);
        navigateToDashboard(selectedRole);
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [step, selectedRole]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth');
    setShowRegister(false);
  };

  const handleDemoCredentials = () => {
    if (selectedRole) {
      const creds = DEMO_CREDENTIALS[selectedRole];
      setLoginEmail(creds.email);
      setLoginPassword(creds.password);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole);
      navigateToDashboard(selectedRole);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      setAuthProgress(0);
      setStep('authenticating');
    }
  };

  const navigateToDashboard = (role: UserRole) => {
    const routes: Record<UserRole, string> = {
      investor: '/investor',
      lister: '/lister',
    };
    navigate(routes[role]);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300";

  return (
    <GridBackground className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <Link to="/landing" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="text-2xl font-bold text-foreground">BondFi</span>
        </Link>

        {/* Step: Role Selection */}
        {step === 'role' && (
          <div className="max-w-md mx-auto space-y-4 animate-slide-up">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Choose Your Role</h2>
            
            <GlowCard 
              className="cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]" 
              onClick={() => handleRoleSelect('investor')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">Invest as Retail User</h3>
                  <p className="text-sm text-muted-foreground">Buy fractional bonds with stablecoins</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <ArrowLeft className="w-4 h-4 text-primary rotate-180" />
                </div>
              </div>
            </GlowCard>

            <GlowCard 
              className="cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)]" 
              onClick={() => handleRoleSelect('lister')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all duration-300">
                  <Building2 className="w-7 h-7 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">List Bonds as Institution</h3>
                  <p className="text-sm text-muted-foreground">Broker, Custodian, FI, or Government Partner</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all">
                  <ArrowLeft className="w-4 h-4 text-secondary rotate-180" />
                </div>
              </div>
            </GlowCard>
          </div>
        )}

        {/* Step: Auth Form */}
        {step === 'auth' && selectedRole && (
          <div className="animate-slide-up max-w-xl mx-auto">
            <button 
              onClick={() => setStep('role')} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">{roleLabels[selectedRole]} Portal</h2>
              <p className="text-muted-foreground mt-1">Sign in to your account</p>
            </div>

            <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl overflow-hidden group hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <h3 className="text-xl font-bold text-foreground mb-1">Welcome Back</h3>
                <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={inputClass}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Lock className="w-3 h-3" /> Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <GradientButton type="submit" className="w-full hover:scale-[1.02] transition-transform duration-300">
                    Login
                  </GradientButton>
                </form>

                <button
                  onClick={handleDemoCredentials}
                  className="w-full mt-4 py-2.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Use Demo Credentials
                </button>

                {/* Create Account Toggle */}
                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setShowRegister(!showRegister)}
                      className="text-primary hover:text-primary/80 font-medium transition-colors duration-300 hover:underline"
                    >
                      {showRegister ? 'Hide Registration' : 'Create Account'}
                    </button>
                  </p>
                </div>

                {/* Registration Form */}
                {showRegister && (
                  <div className="mt-6 pt-6 border-t border-border/50 animate-fade-in">
                    <h3 className="text-lg font-bold text-foreground mb-1">Create Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">Join BondFi as {roleLabels[selectedRole]}</p>
                    
                    <form onSubmit={handleRegister} className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                          <User className="w-3 h-3" /> {selectedRole === 'investor' ? 'Full Name' : 'Contact Name'}
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={inputClass}
                          placeholder={selectedRole === 'investor' ? 'John Doe' : 'Jane Smith'}
                        />
                      </div>

                      {selectedRole === 'lister' && (
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Building2 className="w-3 h-3" /> Institution Name
                          </label>
                          <input
                            type="text"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            className={inputClass}
                            placeholder="Your Company Ltd."
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className={inputClass}
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                          <Lock className="w-3 h-3" /> Password
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                          <Globe className="w-3 h-3" /> Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={inputClass}
                          placeholder="United States"
                        />
                      </div>

                      {selectedRole === 'investor' && (
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Wallet className="w-3 h-3" /> Preferred Currency
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setPreferredCurrency('INR')}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                preferredCurrency === 'INR' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              ₹ INR
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreferredCurrency('USDT')}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                preferredCurrency === 'USDT' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              $ USDT
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-primary/50"
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>

                      <GradientButton 
                        type="submit" 
                        className="w-full hover:scale-[1.02] transition-transform duration-300"
                        disabled={!termsAgreed}
                      >
                        Create Account
                      </GradientButton>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step: Authenticating */}
        {step === 'authenticating' && (
          <div className="max-w-md mx-auto text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Verifying Your Account</h2>
            <p className="text-muted-foreground mb-6">Please wait while we process your registration...</p>
            
            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100"
                style={{ width: `${authProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{Math.round(authProgress)}% complete</p>
          </div>
        )}

        {/* Step: Approved */}
        {step === 'approved' && (
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Verified!</h2>
            <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
          </div>
        )}
      </div>
    </GridBackground>
  );
}
