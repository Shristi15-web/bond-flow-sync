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
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import CustodianDashboard from "./pages/custodian/CustodianDashboard";
import FIDashboard from "./pages/fi/FIDashboard";
import GovDashboard from "./pages/gov/GovDashboard";
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
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/investor/*" element={<InvestorDashboard />} />
            <Route path="/broker" element={<BrokerDashboard />} />
            <Route path="/broker/*" element={<BrokerDashboard />} />
            <Route path="/custodian" element={<CustodianDashboard />} />
            <Route path="/custodian/*" element={<CustodianDashboard />} />
            <Route path="/fi" element={<FIDashboard />} />
            <Route path="/fi/*" element={<FIDashboard />} />
            <Route path="/gov" element={<GovDashboard />} />
            <Route path="/gov/*" element={<GovDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BondProvider>
  </QueryClientProvider>
);

export default App;
