import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { Transaction, WalletUser } from "@/types/wallet";
import { useAuth } from "./AuthContext";
import { safeJsonParse, safeJsonStringify } from "@/utils/safeJsonParse";

const WALLET_STORAGE_KEY = "kaweely_wallet";
const TRANSACTIONS_STORAGE_KEY = "kaweely_transactions";

export const [WalletProvider, useWallet] = createContextHook(() => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(1250.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "add_money",
      amount: 500,
      description: "Added Money",
      date: new Date(),
    },
    {
      id: "2",
      type: "order_payment",
      amount: -125.50,
      description: "Order Payment",
      date: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      type: "refund",
      amount: 75,
      description: "Refund",
      date: new Date(Date.now() - 172800000),
    },
  ]);

  useEffect(() => {
    loadWalletData();
  }, [user]);

  const loadWalletData = async () => {
    try {
      const [storedBalance, storedTransactions] = await Promise.all([
        Promise.race([
          AsyncStorage.getItem(WALLET_STORAGE_KEY),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
        ]),
        Promise.race([
          AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
        ])
      ]);

      if (storedBalance && typeof storedBalance === 'string') {
        const trimmedBalance = storedBalance.trim();
        const parsedBalance = parseFloat(trimmedBalance);
        if (!isNaN(parsedBalance)) {
          setBalance(parsedBalance);
        } else {
          console.warn("Invalid balance value, clearing");
          AsyncStorage.removeItem(WALLET_STORAGE_KEY).catch(console.error);
        }
      }

      if (storedTransactions && typeof storedTransactions === 'string' && storedTransactions.trim().length > 0) {
        const parsed = safeJsonParse<Transaction[]>(storedTransactions);
        if (parsed && Array.isArray(parsed)) {
          const transactionsWithDates = parsed.map((t: Transaction) => ({
            ...t,
            date: new Date(t.date),
          }));
          setTransactions(transactionsWithDates);
        } else {
          console.warn("Transactions data is invalid, clearing");
          AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY).catch(console.error);
        }
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
      AsyncStorage.removeItem(WALLET_STORAGE_KEY).catch(console.error);
      AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY).catch(console.error);
    }
  };

  const saveWalletData = async (newBalance: number, newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, newBalance.toString());
      const jsonString = safeJsonStringify(newTransactions);
      if (jsonString) {
        await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, jsonString);
      }
    } catch (error) {
      console.error("Error saving wallet data:", error);
    }
  };

  const addMoney = useCallback(async (amount: number, method: string) => {
    const newBalance = balance + amount;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "add_money",
      amount,
      description: `Added Money via ${method}`,
      date: new Date(),
    };

    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    await saveWalletData(newBalance, newTransactions);
    
    return true;
  }, [balance, transactions]);

  const sendMoney = useCallback(async (amount: number, recipient: WalletUser) => {
    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    const newBalance = balance - amount;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "send_money",
      amount: -amount,
      description: `Sent to ${recipient.name}`,
      recipientName: recipient.name,
      recipientId: recipient.id,
      date: new Date(),
    };

    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    await saveWalletData(newBalance, newTransactions);
    
    return true;
  }, [balance, transactions]);

  const receiveMoney = useCallback(async (amount: number, senderName: string) => {
    const newBalance = balance + amount;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "receive_money",
      amount,
      description: `Received from ${senderName}`,
      date: new Date(),
    };

    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    await saveWalletData(newBalance, newTransactions);
    
    return true;
  }, [balance, transactions]);

  const deductPayment = useCallback(async (amount: number, description: string) => {
    if (balance < amount) {
      throw new Error("Insufficient balance in wallet");
    }

    const newBalance = balance - amount;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "order_payment",
      amount: -amount,
      description,
      date: new Date(),
    };

    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    await saveWalletData(newBalance, newTransactions);
    
    return true;
  }, [balance, transactions]);

  return useMemo(() => ({
    balance,
    transactions,
    addMoney,
    sendMoney,
    receiveMoney,
    deductPayment,
  }), [balance, transactions, addMoney, sendMoney, receiveMoney, deductPayment]);
});
