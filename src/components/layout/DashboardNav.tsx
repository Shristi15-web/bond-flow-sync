import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut,
  Building2,
  Users,
  MessageSquare,
  Plus,
  Activity,
  List,
  User
} from "lucide-react";
import { useBondContext } from "@/context/BondContext";
import { UserRole } from "@/types/bond";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: Record<UserRole, NavItem[]> = {
  investor: [
    { label: "Dashboard", href: "/investor", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Bonds Market", href: "/investor/bonds", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "My Portfolio", href: "/investor/portfolio", icon: <FileText className="w-5 h-5" /> },
    { label: "Wallet", href: "/investor/wallet", icon: <Wallet className="w-5 h-5" /> },
    { label: "Transactions", href: "/investor/transactions", icon: <FileText className="w-5 h-5" /> },
    { label: "Support", href: "/investor/support", icon: <MessageSquare className="w-5 h-5" /> },
  ],
  lister: [
    { label: "Dashboard", href: "/lister", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Listings", href: "/lister/listings", icon: <List className="w-5 h-5" /> },
    { label: "New Listing", href: "/lister/new-listing", icon: <Plus className="w-5 h-5" /> },
    { label: "Activity", href: "/lister/activity", icon: <Activity className="w-5 h-5" /> },
    { label: "Profile", href: "/lister/profile", icon: <User className="w-5 h-5" /> },
    { label: "Support", href: "/lister/support", icon: <MessageSquare className="w-5 h-5" /> },
  ],
};

const roleLabels: Record<UserRole, string> = {
  investor: "Investor",
  lister: "Lister",
};

export function DashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, investor, lister } = useBondContext();

  if (!currentUser) return null;

  const items = navItems[currentUser.role];
  const displayName = currentUser.role === 'investor' ? investor.name : lister.name;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('bondfi_session');
    navigate('/landing');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar backdrop-blur-xl z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">BondFi</span>
          </Link>
          <p className="text-sm text-foreground mt-3 font-medium">
            Welcome, {displayName.split(' ')[0]}
          </p>
          <p className="text-xs text-muted-foreground">
            {roleLabels[currentUser.role]}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link
            to={`/${currentUser.role}/settings`}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              location.pathname.includes('/settings')
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
