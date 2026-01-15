export type BondStatus = 'available' | 'listed' | 'sold' | 'matured' | 'pending';

export type ListerType = 'broker' | 'custodian' | 'financial_institution' | 'government_partner';

export interface Bond {
  id: string;
  name: string;
  issuer: string;
  yield: number;
  tenure: number; // in months
  value: number;
  minInvestment: number;
  totalSupply: number;
  availableSupply: number;
  status: BondStatus;
  createdAt: string;
  maturityDate: string;
  custodianId: string;
  description: string;
  listerType?: ListerType;
  createdByListerId?: string;
}

export interface BondPurchase {
  id: string;
  bondId: string;
  investorId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  expectedReturn: number;
  maturityDate: string;
  status: 'active' | 'matured' | 'sold';
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'listing' | 'issuance' | 'settlement';
  bondId: string;
  fromId?: string;
  toId?: string;
  amount: number;
  value: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

export type UserRole = 'investor' | 'lister';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance?: number;
  createdAt: string;
  status?: 'active' | 'suspended';
}

export interface Investor extends User {
  role: 'investor';
  balance: number;
  totalInvested: number;
  totalReturns: number;
  purchases: BondPurchase[];
  country?: string;
  preferredCurrency?: 'INR' | 'USDT';
}

export interface Lister extends User {
  role: 'lister';
  institutionName?: string;
  listedBonds: string[];
  totalListings: number;
  totalVolumeTokenized: number;
  kycStatus: 'not_submitted' | 'under_review' | 'verified';
  country?: string;
  contactDetails?: string;
}

// Legacy types for backward compatibility
export type Broker = Lister;
export type Custodian = Lister;
export type FinancialInstitution = Lister;
export type GovernmentPartner = Lister;

export interface DemoCredentials {
  email: string;
  password: string;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredentials> = {
  investor: { email: 'investor@bondfi.demo', password: 'demo123' },
  lister: { email: 'lister@bondfi.demo', password: 'demo123' },
};

export const LISTER_TYPE_INFO: Record<ListerType, { label: string; description: string }> = {
  broker: { label: 'Broker', description: 'List bonds for investors' },
  custodian: { label: 'Custodian', description: 'Verify and settle holdings' },
  financial_institution: { label: 'Financial Institution', description: 'Issue and manage bonds' },
  government_partner: { label: 'Government Partner', description: 'Oversight and compliance' },
};
