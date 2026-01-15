import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BondProvider } from "@/context/BondContext";

import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import InvestorBonds from "./pages/investor/InvestorBonds";
import InvestorPortfolio from "./pages/investor/InvestorPortfolio";
import InvestorWallet from "./pages/investor/InvestorWallet";
import InvestorTransactions from "./pages/investor/InvestorTransactions";
import InvestorSettings from "./pages/investor/InvestorSettings";
import InvestorSupport from "./pages/investor/InvestorSupport";
import ListerDashboard from "./pages/lister/ListerDashboard";
import ListerListings from "./pages/lister/ListerListings";
import ListerNewListing from "./pages/lister/ListerNewListing";
import ListerActivity from "./pages/lister/ListerActivity";
import ListerProfile from "./pages/lister/ListerProfile";
import ListerSettings from "./pages/lister/ListerSettings";
import ListerSupport from "./pages/lister/ListerSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BondProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            {/* Investor Routes */}
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/investor/bonds" element={<InvestorBonds />} />
            <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
            <Route path="/investor/wallet" element={<InvestorWallet />} />
            <Route path="/investor/transactions" element={<InvestorTransactions />} />
            <Route path="/investor/settings" element={<InvestorSettings />} />
            <Route path="/investor/support" element={<InvestorSupport />} />
            {/* Lister Routes */}
            <Route path="/lister" element={<ListerDashboard />} />
            <Route path="/lister/listings" element={<ListerListings />} />
            <Route path="/lister/new-listing" element={<ListerNewListing />} />
            <Route path="/lister/activity" element={<ListerActivity />} />
            <Route path="/lister/profile" element={<ListerProfile />} />
            <Route path="/lister/settings" element={<ListerSettings />} />
            <Route path="/lister/support" element={<ListerSupport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BondProvider>
  </QueryClientProvider>
);

export default App;
