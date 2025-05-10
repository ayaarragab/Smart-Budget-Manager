"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// Define mock data types
interface MockCategory {
  id: number
  name: string
  userId: string
}

interface MockWallet {
  id: number
  name: string
  type: string
  balance: number
  userId: string
}

interface MockBudget {
  id: number
  name: string
  amount: number
  spent: number
  startDate: string
  endDate: string
  userId: string
}

interface MockTransaction {
  id: number
  description: string
  amount: number
  date: string
  type: "Income" | "Expense"
  walletId: number
  categoryId: number
  userId: string
}

interface MockData {
  categories: MockCategory[]
  wallets: MockWallet[]
  budgets: MockBudget[]
  transactions: MockTransaction[]
}

// Create context
const MockDataContext = createContext<{
  mockData: MockData
  useMockData: boolean
  setUseMockData: (use: boolean) => void
}>({
  mockData: { categories: [], wallets: [], budgets: [], transactions: [] },
  useMockData: false,
  setUseMockData: () => {},
})

// Generate initial mock data
const generateMockData = (userId: string): MockData => {
  // Categories
  const categories: MockCategory[] = [
    { id: 1, name: "Groceries", userId },
    { id: 2, name: "Utilities", userId },
    { id: 3, name: "Entertainment", userId },
    { id: 4, name: "Transportation", userId },
    { id: 5, name: "Salary", userId },
  ]

  // Wallets
  const wallets: MockWallet[] = [
    { id: 1, name: "Main Bank Account", type: "Bank", balance: 2500, userId },
    { id: 2, name: "Cash Wallet", type: "Cash", balance: 150, userId },
    { id: 3, name: "Credit Card", type: "Card", balance: -350, userId },
  ]

  // Get date for 1 month ago
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  // Get date for 1 month in future
  const oneMonthFuture = new Date()
  oneMonthFuture.setMonth(oneMonthFuture.getMonth() + 1)

  // Budgets
  const budgets: MockBudget[] = [
    {
      id: 1,
      name: "Monthly Groceries",
      amount: 400,
      spent: 250,
      startDate: oneMonthAgo.toISOString(),
      endDate: oneMonthFuture.toISOString(),
      userId,
    },
    {
      id: 2,
      name: "Entertainment",
      amount: 200,
      spent: 150,
      startDate: oneMonthAgo.toISOString(),
      endDate: oneMonthFuture.toISOString(),
      userId,
    },
    {
      id: 3,
      name: "Transportation",
      amount: 150,
      spent: 120,
      startDate: oneMonthAgo.toISOString(),
      endDate: oneMonthFuture.toISOString(),
      userId,
    },
  ]

  // Transactions
  const transactions: MockTransaction[] = [
    {
      id: 1,
      description: "Grocery shopping",
      amount: 85.75,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "Expense",
      walletId: 1,
      categoryId: 1,
      userId,
    },
    {
      id: 2,
      description: "Monthly salary",
      amount: 3000,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      type: "Income",
      walletId: 1,
      categoryId: 5,
      userId,
    },
    {
      id: 3,
      description: "Electricity bill",
      amount: 75.2,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "Expense",
      walletId: 1,
      categoryId: 2,
      userId,
    },
    {
      id: 4,
      description: "Movie tickets",
      amount: 32.5,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "Expense",
      walletId: 2,
      categoryId: 3,
      userId,
    },
    {
      id: 5,
      description: "Gas",
      amount: 45.0,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "Expense",
      walletId: 3,
      categoryId: 4,
      userId,
    },
  ]

  return { categories, wallets, budgets, transactions }
}

// Provider component
export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [useMockData, setUseMockData] = useState(false)
  const [mockData, setMockData] = useState<MockData>({ categories: [], wallets: [], budgets: [], transactions: [] })

  useEffect(() => {
    // Check if we should use mock data (could be based on API failures)
    const userId = localStorage.getItem("userId") || "mock-user-id"
    setMockData(generateMockData(userId))

    // Check if the API is failing
    const checkApiConnection = async () => {
      try {
        const response = await fetch("/api/Categories/GetAll")
        // If we get a response (even an error), we don't need mock data
        setUseMockData(false)
      } catch (error) {
        // If fetch fails completely (network error), use mock data
        console.log("API connection failed, using mock data")
        setUseMockData(true)
      }
    }

    checkApiConnection()
  }, [])

  return (
    <MockDataContext.Provider value={{ mockData, useMockData, setUseMockData }}>{children}</MockDataContext.Provider>
  )
}

// Hook to use the mock data
export function useMockData() {
  return useContext(MockDataContext)
}
