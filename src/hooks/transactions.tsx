import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";


interface ITransaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

type IRequest  = Omit<ITransaction, 'id' | 'createdAt'>;

interface IBalance {
  deposit: number;
  withdraw: number;
  total: number;
}


interface ITransactionContextData {
  transactions: ITransaction[];
  balance: IBalance;
  createTransaction: (data: IRequest) => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}


const TransactionContext = createContext<ITransactionContextData>(
  {} as ITransactionContextData
);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [balance, setBalance] = useState<IBalance>({} as IBalance);

  async function createTransaction(data: IRequest) {
    const response = await api.post('transactions', {
      ...data, 
      createdAt: new Date()
    });

    setTransactions([...transactions, response.data.transaction])
  }

  useEffect(() => {
    api.get(`transactions`).then(({ data }) => setTransactions(data.transactions));
  }, []);


  useEffect(() => {
    let summary: IBalance = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit') {
        acc.deposit += transaction.amount;
        acc.total += transaction.amount;
      } else {
        acc.withdraw += transaction.amount;
        acc.total -= transaction.amount;
      }

      return acc;
    }, {
      deposit: 0,
      withdraw: 0,
      total: 0
    });

    setBalance(summary);
  }, [transactions]);

  return (
    <TransactionContext.Provider value={{ 
      createTransaction,
      transactions,
      balance
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction(): ITransactionContextData {
  const context = useContext(TransactionContext);

  return context;
}