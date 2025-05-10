"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart3, CreditCard, DollarSign, Plus, Wallet } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import Link from "next/link"
import ErrorAlert from "@/components/error-alert"
import LoadingSpinner from "@/components/loading-spinner"

// Add a helper function to convert wallet type enum to string
const getWalletTypeName = (type: number | string): string => {
  if (typeof type === "string") return type

  switch (type) {
    case 0:
      return "Bank"
    case 1:
      return "Cash"
    case 2:
      return "Card"
    default:
      return "Unknown"
  }
}

export default function DashboardPage() {
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError("")
        const userId = localStorage.getItem("userId")
        // Fetch wallets
          try {
            const walletsResponse = await apiService.wallets.getAll()
            let WalletData = []
          console.log("Filtering Wallets for userId:",userId)
            WalletData = walletsResponse.filter(
            (Wallet) => Wallet.userId == userId || Wallet.userId == Number(userId),
          )
        console.log("Setting Wallets state with:", WalletData)
        setWallets(WalletData || [])
        } catch (err) {
          console.warn("Could not load wallets:", err)
          setWallets([])
        }

        // Fetch transactions
        try {
          const transactionsResponse = await apiService.transactions.getAll()
          // Ensure transactions is always an array
          const transactionsData =
            transactionsResponse && transactionsResponse.data ? transactionsResponse.data : transactionsResponse || []
          setTransactions(transactionsData)
        } catch (err) {
          console.warn("Could not load transactions:", err)
          setTransactions([])
        }

        // Fetch budgets
        try {
          const budgetsResponse = await apiService.budgets.getAll()
          
          let BudgetData = []
            console.log("Filtering Budgets for userId:",userId)
              BudgetData = budgetsResponse?.data.filter(
              (budget) => budget.userId == userId || budget.userId == Number(userId),
            )
          console.log("Setting Budgets state with:", BudgetData)
          setBudgets(BudgetData || [])
        } catch (err) {
          console.warn("Could not load budgets:", err)
          setBudgets([])
        }
      } catch (err: any) {
        console.warn("Error fetching dashboard data:", err)
        // Only show error for critical failures, not empty results
        if (typeof err === "string" && (err.includes("connection") || err.includes("network"))) {
          setError("Failed to load dashboard data. Please check your connection and try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate total balance across all wallets
  const totalBalance = wallets.reduce((sum: number, wallet: any) => sum + (wallet.balance || 0), 0)

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  // Calculate income and expenses
  const income = transactions
    .filter((transaction: any) => transaction.type === 0)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction: any) => transaction.type === 1)
    .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/transactions/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </Link>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {loading ? (
          <LoadingSpinner message="Loading dashboard data..." />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">${income.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">${expenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{budgets.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {budgets.length > 0 ? "Tracking your spending" : "Create a budget to start tracking"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="wallets">Wallets</TabsTrigger>
                <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Status</CardTitle>
                      <CardDescription>Your current budget progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {budgets.length > 0 ? (
                        <div className="space-y-4">
                          {budgets.slice(0, 3).map((budget: any) => (
                            <div key={budget.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{budget.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  ${budget.spent || 0} / ${budget.amount}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{
                                    width: `${Math.min(((budget.spent || 0) / budget.amount) * 100, 100)}%`,
                                    backgroundColor:
                                      (budget.spent || 0) / budget.amount > 0.9 ? "rgb(239 68 68)" : undefined,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          {budgets.length > 3 && (
                            <Link href="/dashboard/budgets">
                              <Button variant="link" className="p-0 h-auto">
                                View all budgets
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[150px] text-center">
                          <CreditCard className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground mb-4">No budgets created yet</p>
                          <Link href="/dashboard/budgets">
                            <Button size="sm">Create Budget</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="wallets" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wallets.length > 0 ? (
                    wallets.map((wallet: any) => (
                      <Card key={wallet.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{wallet.name}</CardTitle>
                          <CardDescription>{getWalletTypeName(wallet.type)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${wallet.balance?.toFixed(2) || "0.00"}</div>
                          <div className="mt-4 flex justify-end">
                            <Link href={`/dashboard/wallets`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-full">
                      <CardContent className="flex flex-col items-center justify-center h-[200px] text-center">
                        <Wallet className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">No wallets created yet</p>
                        <Link href="/dashboard/wallets">
                          <Button>Add Wallet</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                  {wallets.length > 0 && (
                    <Card className="flex flex-col items-center justify-center">
                      <CardContent className="flex flex-col items-center justify-center h-full text-center">
                        <Plus className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">Add another wallet</p>
                        <Link href="/dashboard/wallets">
                          <Button>Add Wallet</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction: any) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`rounded-full p-2 ${transaction.type === 0 ? "bg-green-100" : "bg-red-100"}`}
                              >
                                {transaction.type === 0 ? (
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                ) : (
                                  <BarChart3 className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{transaction.description || "Transaction"}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`text-sm font-medium ${transaction.type === 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.type === 0 ? "+" : "-"}${transaction.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-end mt-4">
                          <Link href="/dashboard/transactions">
                            <Button variant="outline">View All Transactions</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-center">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">No transactions recorded yet</p>
                        <Link href="/dashboard/transactions/add">
                          <Button>Add Transaction</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
