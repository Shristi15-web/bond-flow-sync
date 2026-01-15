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

export interface BondListing {
  id: string;
  bondId: string;
  minInvestmentUnit: number;
  availableQuantity: number;
  listingStartDate: string;
  listingEndDate: string;
  status: 'active' | 'expired' | 'sold_out';
  createdAt: string;
}

export interface SecondaryMarketListing {
  id: string;
  purchaseId: string;
  bondId: string;
  sellerId: string;
  quantity: number;
  sellingPrice: number;
  originalPrice: number;
  yield: number;
  listedAt: string;
  status: 'listed' | 'sold' | 'cancelled';
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

export interface WalletTransaction {
  id: string;
  type: 'purchase' | 'sale' | 'topup' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  bondName?: string;
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
  listings: BondListing[];
  secondaryMarketListings: SecondaryMarketListing[];
  bankAccount: BankAccount | null;
  walletTransactions: WalletTransaction[];
  availableForPayout: number;
  
  // Auth
  currentUser: { role: UserRole; id: string } | null;
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Investor Actions
  updateInvestorProfile: (updates: Partial<Pick<Investor, 'name' | 'country' | 'preferredCurrency'>>) => void;
  addStablecoins: (amount: number) => void;
  
  // Actions
  purchaseBond: (bondId: string, amount: number) => void;
  listBond: (bondId: string, config: { minInvestmentUnit: number; availableQuantity: number; listingStartDate: string; listingEndDate: string }) => { success: boolean; error?: string };
  createBond: (bond: Omit<Bond, 'id' | 'createdAt' | 'status' | 'approvalStatus'>) => string;
  approveBond: (bondId: string, approved: boolean) => { success: boolean; error?: string };
  confirmSettlement: (transactionId: string) => void;
  
  // Secondary Market Actions
  listBondForSale: (purchaseId: string, quantity: number, sellingPrice: number) => { success: boolean; error?: string };
  buyFromSecondaryMarket: (listingId: string) => { success: boolean; error?: string };
  
  // Wallet Actions
  saveBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  withdrawFunds: (amount: number) => Promise<{ success: boolean; error?: string }>;
  
  // Helpers
  getBondById: (id: string) => Bond | undefined;
  getTransactionsByBond: (bondId: string) => Transaction[];
  hasOverlappingListing: (bondId: string, startDate: string, endDate: string) => boolean;
  getApprovedBondsForInvestors: () => Bond[];
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
  listings: BondListing[];
  secondaryMarketListings: SecondaryMarketListing[];
  bankAccount: BankAccount | null;
  walletTransactions: WalletTransaction[];
  availableForPayout: number;
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
  const [listings, setListings] = useState<BondListing[]>(stored?.listings || []);
  const [secondaryMarketListings, setSecondaryMarketListings] = useState<SecondaryMarketListing[]>(
    stored?.secondaryMarketListings || []
  );
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(stored?.bankAccount || null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(
    stored?.walletTransactions || []
  );
  const [availableForPayout, setAvailableForPayout] = useState<number>(stored?.availableForPayout || 0);
  
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
      listings,
      secondaryMarketListings,
      bankAccount,
      walletTransactions,
      availableForPayout,
    });
  }, [bonds, transactions, investor, broker, custodian, financialInstitution, governmentPartner, complianceMetrics, listings, secondaryMarketListings, bankAccount, walletTransactions, availableForPayout]);

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

    // Add wallet transaction
    const newWalletTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      type: 'topup',
      amount,
      description: `Purchased ${amount} USDT stablecoins`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    setWalletTransactions(prev => [...prev, newWalletTx]);

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

    // Only allow purchasing approved bonds
    if (bond.approvalStatus !== 'approved') {
      console.warn('Bond is not approved for investment');
      return;
    }

    // Calculate purchase value - minimum $1 per unit
    const purchaseValue = Math.max(1, bond.minInvestment) * amount;
    
    if (investor.balance < purchaseValue) {
      console.warn('Insufficient balance');
      return;
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

    // Add wallet transaction
    const newWalletTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      type: 'purchase',
      amount: purchaseValue,
      description: `Purchased ${amount} units of ${bond.name}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      bondName: bond.name,
    };
    setWalletTransactions(prev => [...prev, newWalletTx]);

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

    setComplianceMetrics(prev => ({
      ...prev,
      totalInvestments: prev.totalInvestments + purchaseValue,
      settlementsToday: prev.settlementsToday + 1,
    }));

    setBroker(prev => ({
      ...prev,
      transactionVolume: prev.transactionVolume + purchaseValue,
    }));
  };

  const hasOverlappingListing = (bondId: string, startDate: string, endDate: string): boolean => {
    return listings.some(listing => {
      if (listing.bondId !== bondId || listing.status !== 'active') return false;
      const existingStart = new Date(listing.listingStartDate);
      const existingEnd = new Date(listing.listingEndDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  const listBond = (
    bondId: string,
    config: { minInvestmentUnit: number; availableQuantity: number; listingStartDate: string; listingEndDate: string }
  ): { success: boolean; error?: string } => {
    if (hasOverlappingListing(bondId, config.listingStartDate, config.listingEndDate)) {
      return { success: false, error: 'This bond already has an active listing with overlapping dates' };
    }

    const bond = bonds.find(b => b.id === bondId);
    if (!bond) {
      return { success: false, error: 'Bond not found' };
    }

    // Only allow listing approved bonds
    if (bond.approvalStatus !== 'approved') {
      return { success: false, error: 'Bond must be approved before listing. Please wait for admin approval.' };
    }

    const newListing: BondListing = {
      id: `listing-${Date.now()}`,
      bondId,
      minInvestmentUnit: config.minInvestmentUnit,
      availableQuantity: config.availableQuantity,
      listingStartDate: config.listingStartDate,
      listingEndDate: config.listingEndDate,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setListings(prev => [...prev, newListing]);

    setBonds(prev =>
      prev.map(b => (b.id === bondId ? { ...b, status: 'listed' as const } : b))
    );

    setBroker(prev => ({
      ...prev,
      listedBonds: prev.listedBonds.includes(bondId) ? prev.listedBonds : [...prev.listedBonds, bondId],
      totalListings: prev.totalListings + 1,
    }));

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'listing',
      bondId,
      fromId: financialInstitution.id,
      toId: broker.id,
      amount: config.availableQuantity,
      value: bond.value,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Listed ${bond.name} for investor purchase`,
    };
    setTransactions(prev => [...prev, newTransaction]);

    return { success: true };
  };

  const createBond = (bondData: Omit<Bond, 'id' | 'createdAt' | 'status' | 'approvalStatus'>): string => {
    const newBondId = `bond-${Date.now()}`;
    const newBond: Bond = {
      ...bondData,
      id: newBondId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'available',
      approvalStatus: 'pending', // All new bonds start as pending approval
      minInvestment: 1, // Enforce minimum $1 investment
      listerId: broker.id, // Track who created this bond
    };

    setBonds(prev => [...prev, newBond]);

    setBroker(prev => ({
      ...prev,
      totalListings: prev.totalListings + 1,
    }));

    setCustodian(prev => ({
      ...prev,
      bondsInCustody: [...prev.bondsInCustody, newBond.id],
      totalCustodyValue: prev.totalCustodyValue + bondData.value * bondData.totalSupply,
    }));

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'issuance',
      bondId: newBond.id,
      fromId: broker.id,
      amount: bondData.totalSupply,
      value: bondData.value * bondData.totalSupply,
      timestamp: new Date().toISOString(),
      status: 'pending', // Transaction is pending until approved
      description: `Broker created new bond: ${bondData.name} (Pending Approval)`,
    };

    setTransactions(prev => [...prev, newTransaction]);

    setComplianceMetrics(prev => ({
      ...prev,
      totalBondsIssued: prev.totalBondsIssued + 1,
      totalValueIssued: prev.totalValueIssued + bondData.value * bondData.totalSupply,
      pendingVerifications: prev.pendingVerifications + 1,
    }));

    return newBondId;
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

  // Secondary Market: List bond for sale
  const listBondForSale = (purchaseId: string, quantity: number, sellingPrice: number): { success: boolean; error?: string } => {
    const purchase = investor.purchases.find(p => p.id === purchaseId);
    if (!purchase) {
      return { success: false, error: 'Purchase not found' };
    }

    if (quantity > purchase.amount) {
      return { success: false, error: 'Cannot sell more than owned quantity' };
    }

    const bond = bonds.find(b => b.id === purchase.bondId);
    if (!bond) {
      return { success: false, error: 'Bond not found' };
    }

    // Check if already listed
    const existingListing = secondaryMarketListings.find(
      l => l.purchaseId === purchaseId && l.status === 'listed'
    );
    if (existingListing) {
      return { success: false, error: 'This bond is already listed for sale' };
    }

    const newListing: SecondaryMarketListing = {
      id: `sm-${Date.now()}`,
      purchaseId,
      bondId: purchase.bondId,
      sellerId: investor.id,
      quantity,
      sellingPrice,
      originalPrice: purchase.purchasePrice,
      yield: bond.yield,
      listedAt: new Date().toISOString(),
      status: 'listed',
    };

    setSecondaryMarketListings(prev => [...prev, newListing]);

    // Update purchase status
    setInvestor(prev => ({
      ...prev,
      purchases: prev.purchases.map(p =>
        p.id === purchaseId ? { ...p, status: 'sold' as const } : p
      ),
    }));

    return { success: true };
  };

  // Secondary Market: Buy from another investor
  const buyFromSecondaryMarket = (listingId: string): { success: boolean; error?: string } => {
    const listing = secondaryMarketListings.find(l => l.id === listingId);
    if (!listing || listing.status !== 'listed') {
      return { success: false, error: 'Listing not found or no longer available' };
    }

    if (investor.balance < listing.sellingPrice) {
      return { success: false, error: 'Insufficient balance' };
    }

    const bond = bonds.find(b => b.id === listing.bondId);
    if (!bond) {
      return { success: false, error: 'Bond not found' };
    }

    // IMMEDIATELY remove the listing from secondary market (mark as sold)
    setSecondaryMarketListings(prev =>
      prev.filter(l => l.id !== listingId) // Remove entirely instead of just changing status
    );

    // Deduct from buyer's balance and add purchase
    setInvestor(prev => ({
      ...prev,
      balance: prev.balance - listing.sellingPrice,
      totalInvested: prev.totalInvested + listing.sellingPrice,
      purchases: [
        ...prev.purchases,
        {
          id: `purchase-${Date.now()}`,
          bondId: listing.bondId,
          investorId: investor.id,
          amount: listing.quantity,
          purchasePrice: listing.sellingPrice,
          purchaseDate: new Date().toISOString().split('T')[0],
          expectedReturn: (listing.sellingPrice * listing.yield) / 100,
          maturityDate: bond.maturityDate,
          status: 'active',
        },
      ],
    }));

    // Credit seller's payout balance (simulating other investor)
    setAvailableForPayout(prev => prev + listing.sellingPrice);

    // Add sale wallet transaction for seller
    const saleWalletTx: WalletTransaction = {
      id: `wtx-sale-${Date.now()}`,
      type: 'sale',
      amount: listing.sellingPrice,
      description: `Sold ${listing.quantity} units of ${bond.name} on secondary market`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      bondName: bond.name,
    };

    // Add wallet transactions
    const buyWalletTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      type: 'purchase',
      amount: listing.sellingPrice,
      description: `Bought ${listing.quantity} units of ${bond.name} from secondary market`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      bondName: bond.name,
    };
    setWalletTransactions(prev => [...prev, buyWalletTx, saleWalletTx]);

    // Add transaction record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'sale',
      bondId: listing.bondId,
      fromId: listing.sellerId,
      toId: investor.id,
      amount: listing.quantity,
      value: listing.sellingPrice,
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: `Secondary market purchase: ${listing.quantity} units of ${bond.name}`,
    };
    setTransactions(prev => [...prev, newTransaction]);

    return { success: true };
  };

  // Wallet: Save bank account
  const saveBankAccount = (account: Omit<BankAccount, 'id'>) => {
    const newAccount: BankAccount = {
      ...account,
      id: `bank-${Date.now()}`,
    };
    setBankAccount(newAccount);
  };

  // Wallet: Withdraw funds
  const withdrawFunds = async (amount: number): Promise<{ success: boolean; error?: string }> => {
    if (amount > availableForPayout) {
      return { success: false, error: 'Insufficient payout balance' };
    }

    if (!bankAccount) {
      return { success: false, error: 'No bank account linked' };
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 8000));

    setAvailableForPayout(prev => prev - amount);

    const withdrawalTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      type: 'withdrawal',
      amount,
      description: `Withdrawal to ${bankAccount.bankName} - ****${bankAccount.accountNumber.slice(-4)}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    setWalletTransactions(prev => [...prev, withdrawalTx]);

    return { success: true };
  };

  const getBondById = (id: string) => bonds.find(b => b.id === id);
  const getTransactionsByBond = (bondId: string) => transactions.filter(t => t.bondId === bondId);
  
  // Get only approved bonds visible to investors
  const getApprovedBondsForInvestors = () => bonds.filter(b => 
    b.status === 'listed' && b.approvalStatus === 'approved'
  );

  // Approve or reject a bond (for admin use)
  const approveBond = (bondId: string, approved: boolean): { success: boolean; error?: string } => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond) {
      return { success: false, error: 'Bond not found' };
    }

    setBonds(prev =>
      prev.map(b =>
        b.id === bondId
          ? { ...b, approvalStatus: approved ? 'approved' as const : 'rejected' as const }
          : b
      )
    );

    // Update pending verifications count
    setComplianceMetrics(prev => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
    }));

    // Update transaction status if approved
    if (approved) {
      setTransactions(prev =>
        prev.map(t =>
          t.bondId === bondId && t.status === 'pending'
            ? { ...t, status: 'completed' as const, description: t.description.replace('(Pending Approval)', '(Approved)') }
            : t
        )
      );
    }

    return { success: true };
  };

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
        listings,
        secondaryMarketListings,
        bankAccount,
        walletTransactions,
        availableForPayout,
        currentUser,
        login,
        logout,
        updateInvestorProfile,
        addStablecoins,
        purchaseBond,
        listBond,
        createBond,
        approveBond,
        confirmSettlement,
        listBondForSale,
        buyFromSecondaryMarket,
        saveBankAccount,
        withdrawFunds,
        getBondById,
        getTransactionsByBond,
        hasOverlappingListing,
        getApprovedBondsForInvestors,
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
