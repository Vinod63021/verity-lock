"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, Product } from "@/lib/types";
import { user as initialUser, products as initialProducts } from "@/lib/data";

interface AppContextType {
  user: User;
  products: Product[];
  updateUser: (user: User) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  isStateLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isStateLoading, setIsStateLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("veritylock-user");
      const storedProducts = localStorage.getItem("veritylock-products");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    } finally {
      setIsStateLoading(false);
    }
  }, []);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("veritylock-user", JSON.stringify(updatedUser));
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
        const newProducts = [...prev, newProduct];
        localStorage.setItem("veritylock-products", JSON.stringify(newProducts));
        return newProducts;
    });
  };
  
  const removeProduct = (productId: string) => {
    setProducts((prev) => {
      const newProducts = prev.filter((product) => product.id !== productId);
      localStorage.setItem("veritylock-products", JSON.stringify(newProducts));
      return newProducts;
    });
  };

  return (
    <AppContext.Provider value={{ user, products, updateUser, addProduct, removeProduct, isStateLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
