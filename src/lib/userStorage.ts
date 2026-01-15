// User Storage Management - Handles user-scoped data isolation

import { UserRole, Investor, Broker, BondPurchase } from '@/types/bond';
import { SecondaryMarketListing, BankAccount, WalletTransaction, BondListing } from '@/context/BondContext';

export interface RegisteredUser {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  role: UserRole;
  displayRole: 'investor' | 'lister';
  createdAt: string;
  name?: string;
  country?: string;
  preferredCurrency?: 'INR' | 'USDT';
  orgName?: string;
}

export interface UserData {
  investor: Investor;
  broker: Broker;
  walletTransactions: WalletTransaction[];
  bankAccount: BankAccount | null;
  availableForPayout: number;
  listerBalance: number;
  secondaryMarketListings: SecondaryMarketListing[];
  listings: BondListing[];
}

const USERS_KEY = 'bondfi_users';
const CURRENT_SESSION_KEY = 'bondfi_current_session';

// Generate unique user ID
export function generateUserId(role: 'investor' | 'lister'): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const prefix = role === 'investor' ? 'INV' : 'LST';
  return `${prefix}-${year}-${randomPart}`;
}

// Get all registered users
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save registered users
function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Find user by email
export function findUserByEmail(email: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Find user by ID
export function findUserById(id: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  return users.find(u => u.id === id);
}

// Register a new user
export function registerUser(userData: Omit<RegisteredUser, 'id' | 'createdAt'>): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getRegisteredUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }
  
  const displayRole = userData.role === 'investor' ? 'investor' : 'lister';
  const newUser: RegisteredUser = {
    ...userData,
    id: generateUserId(displayRole),
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveRegisteredUsers(users);
  
  // Initialize empty user data
  initializeUserData(newUser.id, userData.role, userData.name, userData.country, userData.preferredCurrency);
  
  return { success: true, user: newUser };
}

// Authenticate user
export function authenticateUser(email: string, password: string): { success: boolean; user?: RegisteredUser; error?: string } {
  const user = findUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Invalid password' };
  }
  
  return { success: true, user };
}

// Get user-specific storage key
export function getUserStorageKey(userId: string): string {
  return `bondfi_user_${userId}`;
}

// Initialize empty user data for a new user
export function initializeUserData(
  userId: string, 
  role: UserRole,
  name?: string,
  country?: string,
  preferredCurrency?: 'INR' | 'USDT'
): void {
  const emptyInvestor: Investor = {
    id: userId,
    name: name || 'New Investor',
    email: '',
    role: 'investor',
    balance: 0, // Start with zero balance
    totalInvested: 0,
    totalReturns: 0,
    purchases: [],
    createdAt: new Date().toISOString(),
    country: country || '',
    preferredCurrency: preferredCurrency || 'USDT',
  };

  const emptyBroker: Broker = {
    id: userId,
    name: name || 'New Lister',
    email: '',
    role: 'broker',
    listedBonds: [],
    totalListings: 0,
    transactionVolume: 0,
    createdAt: new Date().toISOString(),
  };

  const userData: UserData = {
    investor: emptyInvestor,
    broker: emptyBroker,
    walletTransactions: [],
    bankAccount: null,
    availableForPayout: 0,
    listerBalance: 0,
    secondaryMarketListings: [],
    listings: [],
  };

  localStorage.setItem(getUserStorageKey(userId), JSON.stringify(userData));
}

// Load user data
export function loadUserData(userId: string): UserData | null {
  try {
    const stored = localStorage.getItem(getUserStorageKey(userId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Save user data
export function saveUserData(userId: string, data: UserData): void {
  localStorage.setItem(getUserStorageKey(userId), JSON.stringify(data));
}

// Set current session
export function setCurrentSession(user: RegisteredUser): void {
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
}

// Get current session
export function getCurrentSession(): RegisteredUser | null {
  try {
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Clear current session
export function clearCurrentSession(): void {
  localStorage.removeItem(CURRENT_SESSION_KEY);
}

// Check if user is demo user (uses pre-filled credentials)
export function isDemoUser(email: string): boolean {
  return email.endsWith('@bondfi.demo');
}
