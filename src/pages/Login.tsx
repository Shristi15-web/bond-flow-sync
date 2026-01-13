import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useBondContext } from "@/context/BondContext";
import { UserRole, DEMO_CREDENTIALS } from "@/types/bond";
import { User, Building2, Shield, Landmark, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";

type Step = 'role' | 'lister-role' | 'auth';

const listerRoles = [
  { role: 'broker' as UserRole, icon: Briefcase, label: 'Broker', desc: 'List bonds for investors' },
  { role: 'custodian' as UserRole, icon: Shield, label: 'Custodian', desc: 'Verify and settle holdings' },
  { role: 'financial_institution' as UserRole, icon: Building2, label: 'Financial Institution', desc: 'Issue and manage bonds' },
  { role: 'government_partner' as UserRole, icon: Landmark, label: 'Government Partner', desc: 'Oversight and compliance' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useBondContext();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

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
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole);
      const routes: Record<UserRole, string> = {
        investor: '/investor',
        broker: '/broker',
        custodian: '/custodian',
        financial_institution: '/fi',
        government_partner: '/gov',
      };
      navigate(routes[selectedRole]);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    investor: 'Investor',
    broker: 'Broker',
    custodian: 'Custodian',
    financial_institution: 'Financial Institution',
    government_partner: 'Government Partner',
  };

  return (
    <GridBackground className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/landing" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="text-2xl font-bold text-foreground">BondFi</span>
        </Link>

        {/* Step: Role Selection */}
        {step === 'role' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Choose Your Role</h2>
            <GlowCard className="cursor-pointer hover:border-primary/50" onClick={() => handleRoleSelect('investor')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Investor</h3>
                  <p className="text-sm text-muted-foreground">Buy fractional bonds with stablecoins</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </GlowCard>
            <GlowCard className="cursor-pointer hover:border-primary/50" onClick={() => handleRoleSelect('lister')}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Lister</h3>
                  <p className="text-sm text-muted-foreground">Institution, broker, or partner access</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </GlowCard>
          </div>
        )}

        {/* Step: Lister Role Selection */}
        {step === 'lister-role' && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => setStep('role')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl font-bold text-center text-foreground mb-6">Select Lister Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {listerRoles.map((r) => (
                <GlowCard key={r.role} className="cursor-pointer hover:border-primary/50 text-center p-4" onClick={() => handleListerRoleSelect(r.role)}>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/20 flex items-center justify-center">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{r.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* Step: Auth Form */}
        {step === 'auth' && selectedRole && (
          <div className="animate-fade-in">
            <button onClick={() => setStep(selectedRole === 'investor' ? 'role' : 'lister-role')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <GlowCard>
              <h2 className="text-xl font-bold text-foreground mb-1">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">{roleLabels[selectedRole]} Portal</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Password</label>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                <GradientButton type="submit" className="w-full">
                  {isRegister ? 'Create Account' : 'Login'}
                </GradientButton>
              </form>

              <button
                onClick={handleDemoCredentials}
                className="w-full mt-4 py-2 text-sm text-primary hover:underline"
              >
                Use Demo Credentials
              </button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline">
                  {isRegister ? 'Login' : 'Register'}
                </button>
              </p>
            </GlowCard>
          </div>
        )}
      </div>
    </GridBackground>
  );
}
