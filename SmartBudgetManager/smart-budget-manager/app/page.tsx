import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, PieChart, Wallet, BarChart3, CreditCard, LineChart } from "lucide-react"
import ApiConnectionTest from "@/components/api-connection-test"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Wallet className="h-6 w-6" />
            <span>Smart Budget Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Take Control of Your Finances
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Smart Budget Manager helps you track expenses, manage budgets, and gain insights into your spending
                  habits.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Login to Your Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -left-4 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-4 -right-4 h-72 w-72 bg-secondary/20 rounded-full blur-3xl" />
                  <div className="relative rounded-xl border bg-background p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Monthly Overview</h3>
                        <PieChart className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="h-40 w-full bg-muted/50 rounded-md flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="text-xs text-muted-foreground">Income</div>
                          <div className="text-lg font-semibold text-green-500">$3,240</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-xs text-muted-foreground">Expenses</div>
                          <div className="text-lg font-semibold text-red-500">$2,160</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="text-muted-foreground md:text-xl">
                  Everything you need to manage your personal finances effectively
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <Wallet className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Multiple Wallets</h3>
                <p className="text-center text-muted-foreground">
                  Manage multiple accounts including bank, cash, and cards in one place.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <CreditCard className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Budget Planning</h3>
                <p className="text-center text-muted-foreground">
                  Create and track budgets to keep your spending under control.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <LineChart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Smart Reports</h3>
                <p className="text-center text-muted-foreground">
                  Get detailed insights and forecasts about your financial health.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Smart Budget Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
