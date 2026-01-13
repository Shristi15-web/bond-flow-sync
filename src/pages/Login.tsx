import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useBondContext } from "@/context/BondContext";
import { UserRole, DEMO_CREDENTIALS } from "@/types/bond";
import { 
  User, Building2, Shield, Landmark, Briefcase, ArrowLeft, 
  Mail, Lock, Globe, Wallet, FileText, Eye, Hash, MapPin
} from "lucide-react";

type Step = 'role' | 'lister-role' | 'auth';

const listerRoles = [
  { role: 'broker' as UserRole, icon: Briefcase, label: 'Broker', desc: 'List bonds for investors' },
  { role: 'custodian' as UserRole, icon: Shield, label: 'Custodian', desc: 'Verify and settle holdings' },
  { role: 'financial_institution' as UserRole, icon: Building2, label: 'Financial Institution', desc: 'Issue and manage bonds' },
  { role: 'government_partner' as UserRole, icon: Landmark, label: 'Government Partner', desc: 'Oversight and compliance' },
];

const roleLabels: Record<UserRole, string> = {
  investor: 'Investor',
  broker: 'Broker',
  custodian: 'Custodian',
  financial_institution: 'Financial Institution',
  government_partner: 'Government Partner',
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useBondContext();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state - Common
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Investor fields
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState<'INR' | 'USDT'>('USDT');
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // Broker fields
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [licenseId, setLicenseId] = useState('');
  
  // Custodian fields
  const [institutionName, setInstitutionName] = useState('');
  const [custodyType, setCustodyType] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  
  // FI fields
  const [fiName, setFiName] = useState('');
  const [issuerCategory, setIssuerCategory] = useState('');
  const [authorizationId, setAuthorizationId] = useState('');
  
  // Gov fields
  const [departmentName, setDepartmentName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  const handleRoleSelect = (role: 'investor' | 'lister') => {
    if (role === 'investor') {
      setSelectedRole('investor');
      setStep('auth');
    } else {
      setStep('lister-role');
    }
  };

  const handleListerRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth');
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
      // Simulate registration by logging in directly
      login(selectedRole);
      navigateToDashboard(selectedRole);
    }
  };

  const navigateToDashboard = (role: UserRole) => {
    const routes: Record<UserRole, string> = {
      investor: '/investor',
      broker: '/broker',
      custodian: '/custodian',
      financial_institution: '/fi',
      government_partner: '/gov',
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
                  <h3 className="font-semibold text-foreground text-lg">Investor</h3>
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
                  <h3 className="font-semibold text-foreground text-lg">Lister</h3>
                  <p className="text-sm text-muted-foreground">Institution, broker, or partner access</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all">
                  <ArrowLeft className="w-4 h-4 text-secondary rotate-180" />
                </div>
              </div>
            </GlowCard>
          </div>
        )}

        {/* Step: Lister Role Selection */}
        {step === 'lister-role' && (
          <div className="max-w-lg mx-auto space-y-4 animate-slide-up">
            <button 
              onClick={() => setStep('role')} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Select Lister Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {listerRoles.map((r) => (
                <GlowCard 
                  key={r.role} 
                  className="cursor-pointer text-center p-5 group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_hsl(var(--primary)/0.2)]" 
                  onClick={() => handleListerRoleSelect(r.role)}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/20 transition-all duration-300">
                    <r.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{r.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* Step: Auth Form - Side by Side */}
        {step === 'auth' && selectedRole && (
          <div className="animate-slide-up">
            <button 
              onClick={() => setStep(selectedRole === 'investor' ? 'role' : 'lister-role')} 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">{roleLabels[selectedRole]} Portal</h2>
              <p className="text-muted-foreground mt-1">Login or create your account</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Login Card */}
              <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl overflow-hidden group hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] transition-all duration-300">
                {/* Gradient border effect */}
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
                    Use Pre-filled Credentials
                  </button>
                </div>
              </div>

              {/* Register Card */}
              <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-xl overflow-hidden group hover:shadow-[0_0_40px_hsl(var(--secondary)/0.15)] transition-all duration-300">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <h3 className="text-xl font-bold text-foreground mb-1">Create Account</h3>
                  <p className="text-sm text-muted-foreground mb-6">Join BondFi as {roleLabels[selectedRole]}</p>
                  
                  <form onSubmit={handleRegister} className="space-y-3">
                    {/* Role-specific fields */}
                    {selectedRole === 'investor' && (
                      <>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <User className="w-3 h-3" /> Full Name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={inputClass}
                            placeholder="John Doe"
                          />
                        </div>
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
                            placeholder="India"
                          />
                        </div>
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
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAgreed}
                            onChange={(e) => setTermsAgreed(e.target.checked)}
                            className="w-4 h-4 rounded border-border bg-input accent-primary"
                          />
                          I agree to the Terms & Conditions
                        </label>
                      </>
                    )}

                    {selectedRole === 'broker' && (
                      <>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Building2 className="w-3 h-3" /> Organization Name
                          </label>
                          <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className={inputClass}
                            placeholder="ABC Securities Ltd."
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <User className="w-3 h-3" /> Authorized Contact Name
                          </label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className={inputClass}
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Mail className="w-3 h-3" /> Email
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className={inputClass}
                            placeholder="contact@company.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <FileText className="w-3 h-3" /> Registration / License ID
                          </label>
                          <input
                            type="text"
                            value={licenseId}
                            onChange={(e) => setLicenseId(e.target.value)}
                            className={inputClass}
                            placeholder="LIC-2024-XXXXX"
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
                      </>
                    )}

                    {selectedRole === 'custodian' && (
                      <>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Building2 className="w-3 h-3" /> Institution Name
                          </label>
                          <input
                            type="text"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            className={inputClass}
                            placeholder="National Trust Bank"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Shield className="w-3 h-3" /> Custody Type
                          </label>
                          <input
                            type="text"
                            value={custodyType}
                            onChange={(e) => setCustodyType(e.target.value)}
                            className={inputClass}
                            placeholder="Securities Custodian"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Mail className="w-3 h-3" /> Official Email
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className={inputClass}
                            placeholder="custody@bank.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Hash className="w-3 h-3" /> Registration ID
                          </label>
                          <input
                            type="text"
                            value={registrationId}
                            onChange={(e) => setRegistrationId(e.target.value)}
                            className={inputClass}
                            placeholder="REG-2024-XXXXX"
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
                      </>
                    )}

                    {selectedRole === 'financial_institution' && (
                      <>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Building2 className="w-3 h-3" /> Institution Name
                          </label>
                          <input
                            type="text"
                            value={fiName}
                            onChange={(e) => setFiName(e.target.value)}
                            className={inputClass}
                            placeholder="State Bank of India"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <FileText className="w-3 h-3" /> Issuer Category
                          </label>
                          <input
                            type="text"
                            value={issuerCategory}
                            onChange={(e) => setIssuerCategory(e.target.value)}
                            className={inputClass}
                            placeholder="Government Securities"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Mail className="w-3 h-3" /> Official Email
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className={inputClass}
                            placeholder="bonds@institution.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Hash className="w-3 h-3" /> Authorization ID
                          </label>
                          <input
                            type="text"
                            value={authorizationId}
                            onChange={(e) => setAuthorizationId(e.target.value)}
                            className={inputClass}
                            placeholder="AUTH-2024-XXXXX"
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
                      </>
                    )}

                    {selectedRole === 'government_partner' && (
                      <>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Landmark className="w-3 h-3" /> Department / Authority Name
                          </label>
                          <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            className={inputClass}
                            placeholder="Ministry of Finance"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Mail className="w-3 h-3" /> Official Email
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className={inputClass}
                            placeholder="oversight@gov.in"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <MapPin className="w-3 h-3" /> Jurisdiction
                          </label>
                          <input
                            type="text"
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value)}
                            className={inputClass}
                            placeholder="National / State"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                            <Eye className="w-3 h-3" /> Access Level
                          </label>
                          <input
                            type="text"
                            value="Read-Only"
                            disabled
                            className={`${inputClass} opacity-60 cursor-not-allowed`}
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
                      </>
                    )}
                    
                    <GradientButton type="submit" className="w-full hover:scale-[1.02] transition-transform duration-300 mt-2">
                      Create Account
                    </GradientButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GridBackground>
  );
}