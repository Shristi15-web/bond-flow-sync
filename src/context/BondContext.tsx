import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Bond,
  Transaction,
  Investor,
  Lister,
  UserRole,
  BondPurchase,
  ListerType,
} from '@/types/bond';

// Initial data
const initialBonds: Bond[] = [
  {
    id: 'bond-001',
    name: 'US Treasury 10Y',
    issuer: 'Federal Reserve',
    yield: 4.25,
    tenure: 120,
    value: 10000,
    minInvestment: 100,
    totalSupply: 1000000,
    availableSupply: 750000,
    status: 'listed',
    createdAt: '2024-01-15',
    maturityDate: '2034-01-15',
    custodianId: 'custodian-001',
    description: 'US Government Treasury Bond with 10-year maturity',
    listerType: 'financial_institution',
    createdByListerId: 'lister-001',
  },
  {
    id: 'bond-002',
    name: 'EU Sovereign 5Y',
    issuer: 'European Central Bank',
    yield: 3.75,
    tenure: 60,
    value: 5000,
    minInvestment: 50,
    totalSupply: 500000,
    availableSupply: 400000,
    status: 'listed',
    createdAt: '2024-02-01',
    maturityDate: '2029-02-01',
    custodianId: 'custodian-001',
    description: 'European Union Sovereign Bond with 5-year maturity',
    listerType: 'broker',
    createdByListerId: 'lister-001',
  },
  {
    id: 'bond-003',
    name: 'UK Gilt 7Y',
    issuer: 'Bank of England',
    yield: 4.0,
    tenure: 84,
    value: 7500,
    minInvestment: 75,
    totalSupply: 300000,
    availableSupply: 280000,
    status: 'listed',
    createdAt: '2024-03-10',
    maturityDate: '2031-03-10',
    custodianId: 'custodian-002',
    description: 'United Kingdom Government Gilt with 7-year maturity',
    listerType: 'custodian',
    createdByListerId: 'lister-001',
  },
];

const initialInvestor: Investor = {
  id: 'investor-001',
  name: 'Demo Investor',
  email: 'investor@bondfi.demo',
  role: 'investor',
  balance: 50000,
  totalInvested: 15000,
  totalReturns: 625,
  createdAt: '2024-01-01',
  purchases: [
    {
      id: 'purchase-001',
      bondId: 'bond-001',
      investorId: 'investor-001',
      amount: 10,
      purchasePrice: 10000,
      purchaseDate: '2024-06-15',
      expectedReturn: 425,
      maturityDate: '2034-01-15',
      status: 'active',
    },
  ],
};

const initialLister: Lister = {
  id: 'lister-001',
  name: 'Alpha Securities',
  email: 'lister@bondfi.demo',
  role: 'lister',
  createdAt: '2023-06-01',
  institutionName: 'Alpha Securities Ltd.',
  listedBonds: ['bond-001', 'bond-002', 'bond-003'],
  totalListings: 3,
  totalVolumeTokenized: 2500000,
  kycStatus: 'verified',
  country: 'United States',
  contactDetails: 'contact@alphasecurities.com',
};

const initialTransactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'issuance',
    bondId: 'bond-001',
    fromId: 'lister-001',
    amount: 1000000,
    value: 10000000,
    timestamp: '2024-01-15T10:00:00Z',
    status: 'completed',
    description: 'Initial issuance of US Treasury 10Y bonds',
  },
  {
    id: 'tx-002',
    type: 'listing',
    bondId: 'bond-001',
    fromId: 'lister-001',
    amount: 750000,
    value: 7500000,
    timestamp: '2024-01-16T14:30:00Z',
    status: 'completed',
    description: 'Bonds listed for investor purchase',
  },
  {
    id: 'tx-003',
    type: 'purchase',
    bondId: 'bond-001',
    fromId: 'investor-001',
    toId: 'lister-001',
    amount: 10,
    value: 10000,
    timestamp: '2024-06-15T09:15:00Z',
    status: 'completed',
    description: 'Investor purchased US Treasury 10Y fractions',
  },
];

interface BondContextType {
  // Data
  bonds: Bond[];
  transactions: Transaction[];
  investor: Investor;
  lister: Lister;
  
  // Auth
  currentUser: { role: UserRole; id: string } | null;
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Investor Actions
  updateInvestorProfile: (updates: Partial<Pick<Investor, 'name' | 'country' | 'preferredCurrency'>>) => void;
  addStablecoins: (amount: number) => void;
  purchaseBond: (bondId: string, amount: number) => boolean;
  
  // Lister Actions
  updateListerProfile: (updates: Partial<Pick<Lister, 'name' | 'institutionName' | 'country' | 'contactDetails'>>) => void;
  createBondListing: (bondData: {
    name: string;
    issuer: string;
    listerType: ListerType;
    yield: number;
    tenure: number;
    minInvestment: number;
    totalSupply: number;
    value: number;
    description: string;
    maturityDate: string;
  }) => { success: boolean; bondId?: string; error?: string };
  
  // Helpers
  getBondById: (id: string) => Bond | undefined;
  getTransactionsByBond: (bondId: string) => Transaction[];
  getListerBonds: () => Bond[];
  getListedBonds: () => Bond[];
}

const BondContext = createContext<BondContextType | undefined>(undefined);

const STORAGE_KEY = 'bondfi_data_v2';

interface StoredData {
  bonds: Bond[];
  transactions: Transaction[];
  investor: Investor;
  lister: Lister;
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
  const [lister, setLister] = useState<Lister>(stored?.lister || initialLister);
  
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
      lister,
    });
  }, [bonds, transactions, investor, lister]);

  const login = (role: UserRole) => {
    const userIds: Record<UserRole, string> = {
      investor: 'investor-001',
      lister: 'lister-001',
    };
    const user = { role, id: userIds[role] };
    setCurrentUser(user);
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

  const updateListerProfile = (updates: Partial<Pick<Lister, 'name' | 'institutionName' | 'country' | 'contactDetails'>>) => {
    setLister(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const addStablecoins = (amount: number) => {
    setInvestor(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));

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

  const purchaseBond = (bondId: string, amount: number): boolean => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond || bond.availableSupply < amount) return false;

    const purchaseValue = bond.minInvestment * amount;
    
    if (investor.balance < purchaseValue) {
      return false;
    }
    
    const expectedReturn = (purchaseValue * bond.yield) / 100;

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

    setBonds(prev =>
      prev.map(b =>
        b.id === bondId ? { ...b, availableSupply: b.availableSupply - amount } : b
      )
    );

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      bondId,
      fromId: investor.id,
      toId: bond.createdByListerId || 'lister-001',
      amount,
      value: purchaseValue,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Purchased ${amount} units of ${bond.name}`,
    };

    setTransactions(prev => [...prev, newTransaction]);
    return true;
  };

  const createBondListing = (bondData: {
    name: string;
    issuer: string;
    listerType: ListerType;
    yield: number;
    tenure: number;
    minInvestment: number;
    totalSupply: number;
    value: number;
    description: string;
    maturityDate: string;
  }): { success: boolean; bondId?: string; error?: string } => {
    // Validate data
    if (!bondData.name || !bondData.issuer) {
      return { success: false, error: 'Bond name and issuer are required' };
    }
    if (bondData.yield <= 0 || bondData.tenure <= 0) {
      return { success: false, error: 'Yield and tenure must be positive' };
    }

    const newBondId = `bond-${Date.now()}`;
    const newBond: Bond = {
      id: newBondId,
      name: bondData.name,
      issuer: bondData.issuer,
      yield: bondData.yield,
      tenure: bondData.tenure,
      value: bondData.value,
      minInvestment: bondData.minInvestment,
      totalSupply: bondData.totalSupply,
      availableSupply: bondData.totalSupply,
      status: 'listed',
      createdAt: new Date().toISOString().split('T')[0],
      maturityDate: bondData.maturityDate,
      custodianId: 'custodian-001',
      description: bondData.description,
      listerType: bondData.listerType,
      createdByListerId: lister.id,
    };

    setBonds(prev => [...prev, newBond]);

    // Update lister stats
    setLister(prev => ({
      ...prev,
      listedBonds: [...prev.listedBonds, newBondId],
      totalListings: prev.totalListings + 1,
      totalVolumeTokenized: prev.totalVolumeTokenized + bondData.value * bondData.totalSupply,
    }));

    // Add transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'listing',
      bondId: newBondId,
      fromId: lister.id,
      amount: bondData.totalSupply,
      value: bondData.value * bondData.totalSupply,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Listed new bond: ${bondData.name} as ${bondData.listerType}`,
    };

    setTransactions(prev => [...prev, newTransaction]);

    return { success: true, bondId: newBondId };
  };

  const getBondById = (id: string) => bonds.find(b => b.id === id);
  const getTransactionsByBond = (bondId: string) => transactions.filter(t => t.bondId === bondId);
  const getListerBonds = () => bonds.filter(b => b.createdByListerId === lister.id);
  const getListedBonds = () => bonds.filter(b => b.status === 'listed');

  return (
    <BondContext.Provider
      value={{
        bonds,
        transactions,
        investor,
        lister,
        currentUser,
        login,
        logout,
        updateInvestorProfile,
        updateListerProfile,
        addStablecoins,
        purchaseBond,
        createBondListing,
        getBondById,
        getTransactionsByBond,
        getListerBonds,
        getListedBonds,
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
