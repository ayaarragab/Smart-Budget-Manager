"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, PieChart, LineChart, Download, Calendar, Tag } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [selectedWallet, setSelectedWallet] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

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
      setLoading(true)
      const response = await apiService.transactions.getAll()
      let transactionsData = []
      // Ensure transactions is always an array
      const userId = localStorage.getItem("userId")
        console.log("Filtering transactions for userId:", userId)
        transactionsData = response.filter(
          (transaction) => transaction.userId === userId || transaction.userId === Number(userId),
        )
      

      console.log("Setting transactions state with:", transactionsData)
      setTransactions(transactionsData)
          }catch (err) {
          console.warn("Could not load transactions:", err)
          setTransactions([])
        }

      // Fetch categories
        try {
        setLoading(true)
        const userId = localStorage.getItem("userId")
        const response = await apiService.categories.getAll()


        const StringUserId =`${userId}`
        console.log(response?.data)

        const filteredCategories = (response?.data || []).filter(
          category => category.userId === StringUserId
        )

        setCategories(filteredCategories)
      } catch (err) {
        console.warn("Could not load categories:", err)
        setCategories([])
      }
    } catch (error) {
      console.warn("Error fetching report data:", error)
      // Only show toast for critical errors, not empty results
      if (typeof error === "string" && (error.includes("connection") || error.includes("network"))) {
        toast({
          title: "Warning",
          description: "Failed to load some report data. Reports may be incomplete.",
          variant: "default",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const getFilteredTransactions = () => {
    
    return transactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.date)
     
      const matchesWallet = selectedWallet === "all" || transaction.walletId.toString() === selectedWallet
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "0" && (!transaction.categoryId || transaction.categoryId === 0)) ||
        transaction.categoryId?.toString() === selectedCategory
      
      return  matchesWallet && matchesCategory
    })
  }

  const calculateTotals = () => {
    const filteredTransactions = getFilteredTransactions()

    const income = filteredTransactions
      .filter((transaction: any) => 
        transaction.type == 0
    )
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)
      

    const expenses = filteredTransactions
      .filter((transaction: any) => transaction.type == 1)
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  const getExpensesByWallet = () => {
    const filteredTransactions = getFilteredTransactions()
    const walletExpenses: Record<string, number> = {}

    filteredTransactions
      .filter((transaction: any) => transaction.type === "Expense")
      .forEach((transaction: any) => {
        const walletId = transaction.walletId
        const wallet = wallets.find((w: any) => w.id === walletId)
        const walletName = wallet ? wallet.name : "Unknown Wallet"

        if (!walletExpenses[walletName]) {
          walletExpenses[walletName] = 0
        }

        walletExpenses[walletName] += transaction.amount
      })

    return Object.entries(walletExpenses)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const getExpensesByCategory = () => {
    const filteredTransactions = getFilteredTransactions()
    const categoryExpenses: Record<string, number> = {}

    filteredTransactions
      .filter((transaction: any) => transaction.type === "Expense")
      .forEach((transaction: any) => {
        const categoryId = transaction.categoryId || 0
        const category = categories.find((c: any) => c.id === categoryId)
        const categoryName = category ? category.name : "Uncategorized"

        if (!categoryExpenses[categoryName]) {
          categoryExpenses[categoryName] = 0
        }

        categoryExpenses[categoryName] += transaction.amount
      })

    return Object.entries(categoryExpenses)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const getWalletName = (walletId: number) => {
    const wallet = wallets.find((w: any) => w.id === walletId)
    return wallet ? wallet.name : "Unknown Wallet"
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const totals = calculateTotals()
  const walletExpenses = getExpensesByWallet()
  const categoryExpenses = getExpensesByCategory()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="flex items-center gap-2">
            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                {wallets.map((wallet: any) => (
                  <SelectItem key={wallet.id} value={wallet.id.toString()}>
                    {wallet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading report data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">${totals.income.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">${totals.expenses.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totals.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                    ${totals.balance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

           
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
