"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, CreditCard, Home, LogOut, Menu, PieChart, Settings, User, Wallet, X, Tag } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedUserName = localStorage.getItem("userName")
    if (storedUserName) {
      setUserName(storedUserName)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  if (!isMounted) {
    return null
  }

  // Add Categories to the navigation
  // Remove Categories from navigation
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Wallets", href: "/dashboard/wallets", icon: Wallet },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Budgets", href: "/dashboard/budgets", icon: CreditCard },
    { name: "Transactions", href: "/dashboard/transactions", icon: BarChart3 },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Wallet className="h-6 w-6" />
            <span className="hidden md:inline-block">Smart Budget Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2 font-bold">
                      <Wallet className="h-5 w-5" />
                      <span>Smart Budget</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 py-4">
                    <nav className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                          <Button
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className="w-full justify-start"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 px-4 py-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{userName}</span>
                      </div>
                      <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <div className="flex flex-col gap-2 p-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
