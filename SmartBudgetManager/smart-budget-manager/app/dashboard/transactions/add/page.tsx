"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function AddTransactionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "Expense" as "Expense" | "Income",
    walletId: 0,
    categoryId: 0,
    userId: "",
  })

  useEffect(() => {
    fetchWallets()
    fetchCategories()

    // Get userId from localStorage and set it in the form data
    const userId = localStorage.getItem("userId")
    if (userId) {
      setFormData((prev) => ({ ...prev, userId }))
    }
  }, [])

  const fetchWallets = async () => {
  
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
  
}

  const fetchCategories = async () => {
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
  } catch (error) {
    console.warn("Error fetching categories:", error)
    toast({
      title: "Warning",
      description: "Failed to load categories. Using empty list.",
      variant: "default",
    })
    setCategories([])
  }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.walletId) {
      toast({
        title: "Error",
        description: "Please select a wallet.",
        variant: "destructive",
      })
      return
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    if (!formData.userId) {
      toast({
        title: "Error",
        description: "User ID is missing. Please log in again.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      await apiService.transactions.add({
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        date: new Date(formData.date),
        type: formData.type === "Income" ? 0 : 1, // Assuming TransactionType enum: Expense = 0, Income = 1
        walletId: Number.parseInt(formData.walletId as unknown as string),
        categoryId: formData.categoryId,
        userId: formData.userId, // Include userId in the transaction data
      })

      toast({
        title: "Success",
        description: "Transaction added successfully!",
      })

      router.push("/dashboard/transactions")
    } catch (error) {
      console.error("Error adding transaction:", error)
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Enter the details of your new transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <RadioGroup
                  id="type"
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Income" id="income" />
                    <Label htmlFor="income" className="flex items-center gap-2 cursor-pointer">
                      <ArrowDownLeft className="h-4 w-4 text-red-500" />
                      Income
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Expense" id="expense" />
                    <Label htmlFor="expense" className="flex items-center gap-2 cursor-pointer">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      Expense
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this transaction for?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet</Label>
                <Select
                  value={formData.walletId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, walletId: value })}
                  required
                >
                  <SelectTrigger id="wallet">
                    <SelectValue placeholder="Select a wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet: any) => (
                      <SelectItem key={wallet.id} value={wallet.id.toString()}>
                        {wallet.name} (
                        {typeof wallet.type === "number"
                          ? wallet.type === 0
                            ? "Bank"
                            : wallet.type === 1
                              ? "Cash"
                              : "Card"
                          : wallet.type}
                        )
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: Number(value) })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Transaction"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
