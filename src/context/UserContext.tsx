import React, { createContext, useContext, useState, useEffect } from 'react';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
}

interface User {
  name: string;
  email: string;
  coins: number;
  lastLoginDate: string;
  loginStreak: number;
  addresses: Address[];
  orders: Order[];
  phone?: string;
  signupMethod: 'manual' | 'whatsapp' | 'google';
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addCoins: (amount: number) => void;
  checkDailyLogin: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateUserDetails: (details: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Simulated user database
const ADMIN_USER = {
  email: 'admin@zamanix.com',
  password: 'zamanix_admin',
  userData: {
    name: 'Admin',
    email: 'admin@zamanix.com',
    coins: 10,
    lastLoginDate: new Date().toISOString().split('T')[0],
    loginStreak: 1,
    addresses: [],
    orders: [],
    signupMethod: 'manual' as const
  }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    } else {
      localStorage.removeItem('user');
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      setUser(ADMIN_USER.userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addCoins = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        coins: user.coins + amount
      });
    }
  };

  const checkDailyLogin = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = user.lastLoginDate === yesterday.toISOString().split('T')[0];
        
        setUser({
          ...user,
          lastLoginDate: today,
          loginStreak: wasYesterday ? user.loginStreak + 1 : 1,
          coins: user.coins + (wasYesterday ? user.loginStreak + 1 : 1)
        });
      }
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress = {
        ...address,
        id: Date.now().toString()
      };
      setUser({
        ...user,
        addresses: [...user.addresses, newAddress]
      });
    }
  };

  const updateUserDetails = (details: Partial<User>) => {
    if (user && user.signupMethod === 'manual') {
      setUser({
        ...user,
        ...details
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      addCoins, 
      checkDailyLogin, 
      login, 
      logout,
      addAddress,
      updateUserDetails
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}