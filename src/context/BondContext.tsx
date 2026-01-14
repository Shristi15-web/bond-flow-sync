import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Bond,
  Transaction,
  Investor,
  Broker,
  Custodian,
  FinancialInstitution,
  GovernmentPartner,
  UserRole,
  BondPurchase,
} from '@/types/bond';
import {
  initialBonds,
  initialInvestor,
  initialBroker,
  initialCustodian,
  initialFinancialInstitution,
  initialGovernmentPartner,
  initialTransactions,
  complianceMetrics as initialComplianceMetrics,
} from '@/data/dummyData';

interface ComplianceMetrics {
  totalBondsIssued: number;
  totalValueIssued: number;
  totalInvestments: number;
  activeInvestors: number;
  settlementsToday: number;
  pendingVerifications: number;
  complianceScore: number;
  auditsPassed: number;
}

interface BondContextType {
  // Data
  bonds: Bond[];
  transactions: Transaction[];
  investor: Investor;
  broker: Broker;
  custodian: Custodian;
  financialInstitution: FinancialInstitution;
  governmentPartner: GovernmentPartner;
  complianceMetrics: ComplianceMetrics;
  
  // Auth
  currentUser: { role: UserRole; id: string } | null;
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Investor Actions
  updateInvestorProfile: (updates: Partial<Pick<Investor, 'name' | 'country' | 'preferredCurrency'>>) => void;
  addStablecoins: (amount: number) => void;
  
  // Actions
  purchaseBond: (bondId: string, amount: number) => void;
  listBond: (bondId: string) => void;
  createBond: (bond: Omit<Bond, 'id' | 'createdAt' | 'status'>) => void;
  confirmSettlement: (transactionId: string) => void;
  
  // Helpers
  getBondById: (id: string) => Bond | undefined;
  getTransactionsByBond: (bondId: string) => Transaction[];
}

const BondContext = createContext<BondContextType | undefined>(undefined);

const STORAGE_KEY = 'bondfi_data';

interface StoredData {
  bonds: Bond[];
  transactions: Transaction[];
  investor: Investor;
  broker: Broker;
  custodian: Custodian;
  financialInstitution: FinancialInstitution;
  governmentPartner: GovernmentPartner;
  complianceMetrics: ComplianceMetrics;
}

function loadFromStorage(): StoredData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
  return null;
}

function saveToStorage(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function BondProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  
  const [bonds, setBonds] = useState<Bond[]>(stored?.bonds || initialBonds);
  const [transactions, setTransactions] = useState<Transaction[]>(stored?.transactions || initialTransactions);
  const [investor, setInvestor] = useState<Investor>(stored?.investor || initialInvestor);
  const [broker, setBroker] = useState<Broker>(stored?.broker || initialBroker);
  const [custodian, setCustodian] = useState<Custodian>(stored?.custodian || initialCustodian);
  const [financialInstitution, setFinancialInstitution] = useState<FinancialInstitution>(
    stored?.financialInstitution || initialFinancialInstitution
  );
  const [governmentPartner, setGovernmentPartner] = useState<GovernmentPartner>(
    stored?.governmentPartner || initialGovernmentPartner
  );
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics>(
    stored?.complianceMetrics || initialComplianceMetrics
  );
  // Load persisted user session
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; id: string } | null>(() => {
    try {
      const session = localStorage.getItem('bondfi_session');
      if (session) {
        return JSON.parse(session);
      }
    } catch {}
    return null;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveToStorage({
      bonds,
      transactions,
      investor,
      broker,
      custodian,
      financialInstitution,
      governmentPartner,
      complianceMetrics,
    });
  }, [bonds, transactions, investor, broker, custodian, financialInstitution, governmentPartner, complianceMetrics]);

  const login = (role: UserRole) => {
    const userIds: Record<UserRole, string> = {
      investor: 'investor-001',
      broker: 'broker-001',
      custodian: 'custodian-001',
      financial_institution: 'fi-001',
      government_partner: 'gov-001',
    };
    const user = { role, id: userIds[role] };
    setCurrentUser(user);
    // Persist session to localStorage
    localStorage.setItem('bondfi_session', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bondfi_session');
  };

  const updateInvestorProfile = (updates: Partial<Pick<Investor, 'name' | 'country' | 'preferredCurrency'>>) => {
    setInvestor(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const addStablecoins = (amount: number) => {
    setInvestor(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    // Add transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      bondId: 'stablecoin',
      fromId: 'external',
      toId: investor.id,
      amount,
      value: amount,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Purchased ${amount} USDT stablecoins`,
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const purchaseBond = (bondId: string, amount: number) => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond || bond.availableSupply < amount) return;

    const purchaseValue = (amount / bond.totalSupply) * bond.value * amount;
    
    // Check if investor has enough balance
    if (investor.balance < purchaseValue) {
      console.warn('Insufficient balance');
      return;
    }
    
    const expectedReturn = (purchaseValue * bond.yield) / 100;

    // Update investor
    const newPurchase: BondPurchase = {
      id: `purchase-${Date.now()}`,
      bondId,
      investorId: investor.id,
      amount,
      purchasePrice: purchaseValue,
      purchaseDate: new Date().toISOString().split('T')[0],
      expectedReturn,
      maturityDate: bond.maturityDate,
      status: 'active',
    };

    setInvestor(prev => ({
      ...prev,
      balance: prev.balance - purchaseValue,
      totalInvested: prev.totalInvested + purchaseValue,
      purchases: [...prev.purchases, newPurchase],
    }));

    // Update bond supply
    setBonds(prev =>
      prev.map(b =>
        b.id === bondId ? { ...b, availableSupply: b.availableSupply - amount } : b
      )
    );

    // Add transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      bondId,
      fromId: investor.id,
      toId: broker.id,
      amount,
      value: purchaseValue,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Purchased ${amount} units of ${bond.name}`,
    };

    setTransactions(prev => [...prev, newTransaction]);

    // Update compliance metrics
    setComplianceMetrics(prev => ({
      ...prev,
      totalInvestments: prev.totalInvestments + purchaseValue,
      settlementsToday: prev.settlementsToday + 1,
    }));

    // Update broker volume
    setBroker(prev => ({
      ...prev,
      transactionVolume: prev.transactionVolume + purchaseValue,
    }));
  };

  const listBond = (bondId: string) => {
    setBonds(prev =>
      prev.map(b => (b.id === bondId ? { ...b, status: 'listed' as const } : b))
    );

    setBroker(prev => ({
      ...prev,
      listedBonds: [...prev.listedBonds, bondId],
      totalListings: prev.totalListings + 1,
    }));

    const bond = bonds.find(b => b.id === bondId);
    if (bond) {
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'listing',
        bondId,
        fromId: financialInstitution.id,
        toId: broker.id,
        amount: bond.availableSupply,
        value: bond.value,
        timestamp: new Date().toISOString(),
        status: 'completed',
        description: `Listed ${bond.name} for investor purchase`,
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
  };

  const createBond = (bondData: Omit<Bond, 'id' | 'createdAt' | 'status'>) => {
    const newBond: Bond = {
      ...bondData,
      id: `bond-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'available',
    };

    setBonds(prev => [...prev, newBond]);

    setFinancialInstitution(prev => ({
      ...prev,
      issuedBonds: [...prev.issuedBonds, newBond.id],
      totalIssuedValue: prev.totalIssuedValue + bondData.value * bondData.totalSupply,
      activeSupply: prev.activeSupply + bondData.totalSupply,
    }));

    // Update custodian
    setCustodian(prev => ({
      ...prev,
      bondsInCustody: [...prev.bondsInCustody, newBond.id],
      totalCustodyValue: prev.totalCustodyValue + bondData.value * bondData.totalSupply,
    }));

    // Add transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'issuance',
      bondId: newBond.id,
      fromId: financialInstitution.id,
      amount: bondData.totalSupply,
      value: bondData.value * bondData.totalSupply,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Issued new bond: ${bondData.name}`,
    };

    setTransactions(prev => [...prev, newTransaction]);

    // Update compliance metrics
    setComplianceMetrics(prev => ({
      ...prev,
      totalBondsIssued: prev.totalBondsIssued + 1,
      totalValueIssued: prev.totalValueIssued + bondData.value * bondData.totalSupply,
    }));
  };

  const confirmSettlement = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === transactionId ? { ...t, status: 'completed' as const } : t
      )
    );

    setCustodian(prev => ({
      ...prev,
      settlementsProcessed: prev.settlementsProcessed + 1,
    }));
  };

  const getBondById = (id: string) => bonds.find(b => b.id === id);
  const getTransactionsByBond = (bondId: string) => transactions.filter(t => t.bondId === bondId);

  return (
    <BondContext.Provider
      value={{
        bonds,
        transactions,
        investor,
        broker,
        custodian,
        financialInstitution,
        governmentPartner,
        complianceMetrics,
        currentUser,
        login,
        logout,
        updateInvestorProfile,
        addStablecoins,
        purchaseBond,
        listBond,
        createBond,
        confirmSettlement,
        getBondById,
        getTransactionsByBond,
      }}
    >
      {children}
    </BondContext.Provider>
  );
}

export function useBondContext() {
  const context = useContext(BondContext);
  if (context === undefined) {
    throw new Error('useBondContext must be used within a BondProvider');
  }
  return context;
}
