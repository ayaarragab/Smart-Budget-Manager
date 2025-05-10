"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, ArrowUpRight, ArrowDownLeft, Filter, Tag } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function TransactionsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [walletFilter, setWalletFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchTransactions()
    fetchWallets()
    fetchCategories()
  }, [])

  const fetchTransactions = async () => {
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
    } catch (error) {
      console.warn("Error fetching transactions:", error)
      // Don't show error toast for empty results
      if (error !== "Failed to load transactions") {
        toast({
          title: "Warning",
          description: "Failed to load transactions. Using empty list.",
          variant: "default",
        })
      }
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWallets = async () => {
    try {
      const response = await apiService.wallets.getAll()
      // Check if response is an object with a data property
      const walletsData = response && response.data ? response.data : response || []
      setWallets(walletsData)
    } catch (error) {
      console.warn("Error fetching wallets:", error)
      setWallets([])
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiService.categories.getAll()
      setCategories(response.data || [])
    } catch (error) {
      console.warn("Error fetching categories:", error)
      setCategories([])
    }
  }

  // const handleDeleteTransaction = async (id: number) => {
  //   try {
  //     await apiService.transactions.delete(id)
  //     toast({
  //       title: "Success",
  //       description: "Transaction deleted successfully!",
  //     })
  //     fetchTransactions()
  //   } catch (error) {
  //     console.error("Error deleting transaction:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete transaction. Please try again.",
  //       variant: "destructive",
  //     })
  //   }
  //}

  const getWalletName = (walletId: number) => {
    const wallet = wallets.find((w: any) => w.id === walletId)
    return wallet ? wallet.name : "Unknown Wallet"
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredTransactions = transactions
    .filter((transaction: any) => {
      // Search filter
      const matchesSearch =
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getWalletName(transaction.walletId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(transaction.categoryId)?.toLowerCase().includes(searchTerm.toLowerCase())

      // Wallet filter
      const matchesWallet = walletFilter === "all" || transaction.walletId.toString() === walletFilter

      // Type filter
      const matchesType = typeFilter === "all" || transaction.type == typeFilter

      // Category filter
      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "0" && (!transaction.categoryId || transaction.categoryId === 0)) ||
        transaction.categoryId?.toString() === categoryFilter

      return matchesSearch && matchesWallet && matchesType && matchesCategory
    })
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <Link href="/dashboard/transactions/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={walletFilter} onValueChange={setWalletFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by wallet" />
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="0">Income</SelectItem>
                  <SelectItem value="1">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage all your financial transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading transactions...</p>
                </div>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{getWalletName(transaction.walletId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {getCategoryName(transaction.categoryId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === 1 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-red-500" />
                          )}
                          <span className={transaction.type === 1 ? "text-green-500" : "text-red-500"}>
                            ${transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm || walletFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all"
                    ? "No transactions match your filters."
                    : "No transactions found. Add your first transaction to get started."}
                </p>
                {!searchTerm && walletFilter === "all" && typeFilter === "all" && categoryFilter === "all" && (
                  <Link href="/dashboard/transactions/add">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
