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
import { Plus, Pencil, Trash2, Search, CreditCard, WalletIcon, Banknote } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export default function WalletsPage() {
  const { toast } = useToast()
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  // Update the formData state to match the WalletDto
  const [formData, setFormData] = useState({
    name: "",
    type: "Bank" as "Bank" | "Cash" | "Card",
    userId: "",
  })

  useEffect(() => {
    fetchWallets()

    // Set userId from localStorage
    const userId = localStorage.getItem("userId")
    if (userId) {
      setFormData((prev) => ({ ...prev, userId }))
    }
  }, [])

  // Update the fetchWallets function to handle empty results
  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await apiService.wallets.getAll()
      const userId = localStorage.getItem("userId")
      let WalletData = []
        console.log("Filtering Wallets for userId:",userId)
           WalletData = response.filter(
          (Wallet) => Wallet.userId == userId || Wallet.userId == Number(userId),
        )
      console.log("Setting Wallets state with:", WalletData)
      setWallets(WalletData || [])
    } catch (error) {
      console.warn("Error fetching wallets:", error)
      // Don't show error toast for empty results
      if (error !== "Failed to load wallets") {
        toast({
          title: "Warning",
          description: "Failed to load wallets. Using empty list.",
          variant: "default",
        })
      }
      setWallets([])
    } finally {
      setLoading(false)
    }
  }

  // Update the handleAddWallet function to match the WalletDto
  const handleAddWallet = async () => {
    try {
      await apiService.wallets.add({
        name: formData.name,
        type: formData.type === "Bank" ? 0 : formData.type === "Cash" ? 1 : 2, // Assuming WalletType enum: Bank = 0, Cash = 1, Card = 2
        userId: formData.userId,
      })
      toast({
        title: "Success",
        description: "Wallet added successfully!",
      })
      setIsAddDialogOpen(false)
      setFormData({ ...formData, name: "", type: "Bank" })
      fetchWallets()
    } catch (error) {
      console.error("Error adding wallet:", error)
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the handleEditWallet function to match the WalletDto
  const handleEditWallet = async () => {
    try {
      if (!selectedWallet) return

      await apiService.wallets.update(selectedWallet.id, {
        name: formData.name,
        type: formData.type === "Bank" ? 0 : formData.type === "Cash" ? 1 : 2, // Assuming WalletType enum: Bank = 0, Cash = 1, Card = 2
        userId: formData.userId,
      })

      toast({
        title: "Success",
        description: "Wallet updated successfully!",
      })

      setIsEditDialogOpen(false)
      setSelectedWallet(null)
      fetchWallets()
    } catch (error) {
      console.error("Error updating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to update wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWallet = async (id: number) => {
    try {
      await apiService.wallets.delete(id)
      toast({
        title: "Success",
        description: "Wallet deleted successfully!",
      })
      fetchWallets()
    } catch (error) {
      console.error("Error deleting wallet:", error)
      toast({
        title: "Error",
        description: "Failed to delete wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (wallet: any) => {
    setSelectedWallet(wallet)
    setFormData({
      name: wallet.name,
      type: wallet.type,
      userId: wallet.userId,
    })
    setIsEditDialogOpen(true)
  }

  const filteredWallets = wallets.filter(
    (wallet: any) =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  // Update the getWalletIcon function to handle numeric types
  const getWalletIcon = (type: number | string) => {
    const typeName = typeof type === "number" ? getWalletTypeName(type) : type

    switch (typeName) {
      case "Bank":
        return <WalletIcon className="h-4 w-4" />
      case "Cash":
        return <Banknote className="h-4 w-4" />
      case "Card":
        return <CreditCard className="h-4 w-4" />
      default:
        return <WalletIcon className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Wallet</DialogTitle>
                <DialogDescription>Create a new wallet to track your finances.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Wallet Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Main Bank Account, Cash Wallet"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Wallet Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank">Bank Account</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWallet}>Add Wallet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wallets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Wallets</CardTitle>
            <CardDescription>Manage your accounts, cash, and cards in one place.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading wallets...</p>
                </div>
              </div>
            ) : filteredWallets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet: any) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getWalletIcon(wallet.type)}
                          {getWalletTypeName(wallet.type)}
                        </div>
                      </TableCell>
                      <TableCell>${wallet.balance?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(wallet)}>
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
                                <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the wallet "{wallet.name}"? This action cannot be
                                  undone and will delete all associated transactions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWallet(wallet.id)}
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
                    ? "No wallets match your search."
                    : "No wallets found. Add your first wallet to get started."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Wallet
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Wallet Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>Update the wallet details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Wallet Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Wallet Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select wallet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank">Bank Account</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditWallet}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
