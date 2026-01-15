import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  User, Building2, Mail, Globe, FileText, CheckCircle2, 
  Clock, AlertCircle, Shield, Briefcase, Landmark
} from "lucide-react";
import { LISTER_TYPE_INFO, ListerType } from "@/types/bond";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ListerProfile() {
  const { lister, updateListerProfile } = useBondContext();
  
  const [name, setName] = useState(lister.name);
  const [institutionName, setInstitutionName] = useState(lister.institutionName || '');
  const [country, setCountry] = useState(lister.country || '');
  const [contactDetails, setContactDetails] = useState(lister.contactDetails || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateListerProfile({ name, institutionName, country, contactDetails });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all";

  const listerTypeIcons: Record<ListerType, React.ElementType> = {
    broker: Briefcase,
    custodian: Shield,
    financial_institution: Building2,
    government_partner: Landmark,
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your institution profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{lister.name}</h3>
                <p className="text-muted-foreground">{lister.institutionName || 'Institution'}</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              lister.kycStatus === 'verified' ? 'bg-success/20 text-success' :
              lister.kycStatus === 'under_review' ? 'bg-warning/20 text-warning' :
              'bg-muted text-muted-foreground'
            )}>
              {lister.kycStatus === 'verified' ? <CheckCircle2 className="w-4 h-4" /> :
               lister.kycStatus === 'under_review' ? <Clock className="w-4 h-4" /> :
               <AlertCircle className="w-4 h-4" />}
              {lister.kycStatus === 'verified' ? 'Verified' :
               lister.kycStatus === 'under_review' ? 'Under Review' : 'Not Submitted'}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Contact Email</label>
                <input
                  type="email"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className={inputClass}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <GradientButton onClick={handleSave}>Save Changes</GradientButton>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl border border-border/50 text-foreground hover:bg-muted/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact Name</span>
                  </div>
                  <p className="font-medium text-foreground">{lister.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Institution</span>
                  </div>
                  <p className="font-medium text-foreground">{lister.institutionName || 'Not set'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Country</span>
                  </div>
                  <p className="font-medium text-foreground">{lister.country || 'Not set'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Contact</span>
                  </div>
                  <p className="font-medium text-foreground">{lister.contactDetails || lister.email}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 rounded-xl border border-border/50 text-foreground hover:bg-muted/30 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Stats Card */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Statistics</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{lister.totalListings}</p>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <FileText className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{lister.listedBonds.length}</p>
              <p className="text-sm text-muted-foreground">Active Bonds</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <FileText className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                ${(lister.totalVolumeTokenized / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">Volume Tokenized</p>
            </div>
          </div>
        </Card>

        {/* Lister Types Reference */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lister Types Reference</h3>
          <p className="text-muted-foreground mb-4">
            When creating listings, you can choose from these lister types:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.keys(LISTER_TYPE_INFO) as ListerType[]).map((type) => {
              const Icon = listerTypeIcons[type];
              const info = LISTER_TYPE_INFO[type];
              return (
                <div key={type} className="flex items-start gap-3 p-4 rounded-xl bg-muted/20">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{info.label}</h4>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
