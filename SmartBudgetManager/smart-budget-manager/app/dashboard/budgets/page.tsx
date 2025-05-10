"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function BudgetsPage() {
  const { toast } = useToast()
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  // Remove the categories state
  // const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<any>(null)
  // Update the formData state to remove categoryId
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
    userId: "",
  })

  useEffect(() => {
    fetchBudgets()
    fetchTransactions()
    // Remove the fetchCategories call from useEffect
    // fetchCategories()

    // Set userId from localStorage
    const userId = localStorage.getItem("userId")
    if (userId) {
      setFormData((prev) => ({ ...prev, userId }))
    }
  }, [])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await apiService.budgets.getAll()
      // Ensure we always have an array, even if the API returns null or undefined
      //Filter Budgets by userId if available
      const userId = localStorage.getItem("userId")
      let BudgetData = []
        console.log("Filtering Budgets for userId:",userId)
           BudgetData = response?.data.filter(
          (budget) => budget.userId == userId || budget.userId == Number(userId),
        )
      console.log("Setting Budgets state with:", BudgetData)
      setBudgets(BudgetData || [])
    } catch (error) {
      console.warn("Error fetching budgets:", error)
      // Don't show error toast for empty results
      if (error !== "Failed to load budgets") {
        toast({
          title: "Warning",
          description: "Failed to load budgets. Using empty list.",
          variant: "default",
        })
      }
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await apiService.transactions.getAll()
      console.log("Transactions API response:", response)

      // Handle different response formats
      let transactionsData = []

      if (Array.isArray(response)) {
        // If response is directly an array
        transactionsData = response
      } else if (response && response.data && Array.isArray(response.data)) {
        // If response has a data property that is an array
        transactionsData = response.data
      } else if (response) {
        // Fallback for other formats
        transactionsData = response
      }
      const userId = localStorage.getItem("userId")
        console.log("Filtering transactions for userId:", userId)
        transactionsData = transactionsData.filter(
          (transaction) => transaction.userId === userId || transaction.userId === Number(userId),
        )
      

      console.log("Setting transactions state with:", transactionsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.warn("Error fetching transactions:", error)
      setTransactions([])
    }
    
  }

  // Remove the fetchCategories function and any references to it
  // const fetchCategories = async () => {
  //   try {
  //     const response = await apiService.categories.getAll()
  //     setCategories(response.data || [])
  //   } catch (error) {
  //     console.warn("Error fetching categories:", error)
  //     setCategories([])
  //   }
  // }

  // Remove any references to categories in the handleAddBudget function
  const handleAddBudget = async () => {
    try {
      await apiService.budgets.add(formData)
      toast({
        title: "Success",
        description: "Budget added successfully!",
      })
      setIsAddDialogOpen(false)
      setFormData({
        ...formData,
        name: "",
        amount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
      })
      fetchBudgets()
    } catch (error) {
      console.error("Error adding budget:", error)
      toast({
        title: "Error",
        description: "Failed to add budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Remove any references to categories in the handleEditBudget function
  const handleEditBudget = async () => {
    try {
      if (!selectedBudget) return

      await apiService.budgets.update({
        id: selectedBudget.id,
        name: formData.name,
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: formData.userId,
      })

      toast({
        title: "Success",
        description: "Budget updated successfully!",
      })

      setIsEditDialogOpen(false)
      setSelectedBudget(null)
      fetchBudgets()
    } catch (error) {
      console.error("Error updating budget:", error)
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBudget = async (id: number) => {
    try {
      await apiService.budgets.delete(id)
      toast({
        title: "Success",
        description: "Budget deleted successfully!",
      })
      fetchBudgets()
    } catch (error) {
      console.error("Error deleting budget:", error)
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (budget: any) => {
    setSelectedBudget(budget)
    setFormData({
      name: budget.name,
      amount: budget.amount,
      startDate: new Date(budget.startDate).toISOString().split("T")[0],
      endDate: new Date(budget.endDate).toISOString().split("T")[0],
      userId: budget.userId,
    })
    setIsEditDialogOpen(true)
  }

  const filteredBudgets = budgets.filter((budget: any) => budget.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const calculateBudgetSpent = (budget) => {
    console.log("Calculating budget spent for:", budget.name)
    console.log("Available transactions:", transactions.length)

    if (!transactions || transactions.length === 0) {
      console.log("No transactions available")
      return 0
    }

    // Filter transactions that fall within the budget date range and are expenses (type === 1)
    const budgetTransactions = transactions.filter((transaction) => {
      // Ensure transaction has required properties
      if (!transaction || !transaction.date) {
        console.log("Invalid transaction:", transaction)
        return false
      }

      const transactionDate = new Date(transaction.date)
      const startDate = new Date(budget.startDate)
      const endDate = new Date(budget.endDate)

      console.log("Transaction:", transaction.description)
      console.log("Transaction date:", transactionDate.toISOString())
      console.log("Budget period:", startDate.toISOString(), "to", endDate.toISOString())
      console.log("Transaction type:", transaction.type)

      // Convert type to number if it's a string
      const transactionType =
        typeof transaction.type === "string" ? Number.parseInt(transaction.type, 10) : transaction.type

      const isInDateRange = transactionDate >= startDate && transactionDate <= endDate
      const isExpense = transactionType === 1

      console.log("Is in date range:", isInDateRange)
      console.log("Is expense:", isExpense)
      console.log("Will include in sum:", isExpense && isInDateRange)

      return isExpense && isInDateRange
    })

    console.log("Filtered transactions:", budgetTransactions.length)

    // Sum the amounts of the filtered transactions
    const totalSpent = budgetTransactions.reduce((sum, transaction) => {
      console.log("Adding to sum:", transaction.amount)
      return sum + transaction.amount
    }, 0)

    console.log("Total spent:", totalSpent)
    return totalSpent
  }

  const calculateProgress = (budget) => {
    const spent = calculateBudgetSpent(budget)
    const progress = (spent / budget.amount) * 100
    return Math.min(progress, 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
                <DialogDescription>Create a new budget to track your spending.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Budget Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Monthly Groceries, Entertainment"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBudget}>Add Budget</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Budgets</CardTitle>
            <CardDescription>Track your spending against your budget limits.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading budgets...</p>
                </div>
              </div>
            ) : filteredBudgets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget: any) => (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.name}</TableCell>
                      <TableCell>${budget.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>${calculateBudgetSpent(budget).toFixed(2)} spent</span>
                            <span>{calculateProgress(budget).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{
                                width: `${calculateProgress(budget)}%`,
                                backgroundColor: calculateProgress(budget) > 90 ? "rgb(239 68 68)" : undefined,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(budget)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the budget "{budget.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBudget(budget.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No budgets match your search."
                    : "No budgets found. Add your first budget to get started."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Budget
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update the budget details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Budget Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBudget}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
