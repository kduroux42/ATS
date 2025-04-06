"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, CreditCard, LogOut, Settings, User, CopyIcon, CheckIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppContext } from "@/context/app-context"
import { Badge } from "@/components/ui/badge"

export default function PaymentsPage() {
  const { friends, subscriptions } = useAppContext()
  const [copied, setCopied] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [selectedCrypto, setSelectedCrypto] = useState("SOL")

  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Wallet address copied to clipboard")
  }

  // Calculate fee savings with Solana
  const standardFeePercentage = 2.5
  const solanaFeePercentage = 0.5
  const amount = 10.0 // Example amount
  const standardFee = amount * (standardFeePercentage / 100)
  const solanaFee = amount * (solanaFeePercentage / 100)
  const savings = standardFee - solanaFee
  const savingsPercentage = ((standardFee - solanaFee) / standardFee) * 100

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <Link className="flex items-center gap-2" href="#">
          <div className="logo-circle h-8 w-8">
            <Image src="/images/ats-logo.png" alt="ATS Logo" width={24} height={24} className="object-contain" />
          </div>
          <span className="font-bold ats-accent">ATS</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium ats-accent" href="/dashboard/payments">
            Payments
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/dashboard/friends">
            Friends
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-gray-50">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg md:text-2xl">Payments</h1>
        </div>
        <Tabs defaultValue="send" className="space-y-4">
          <TabsList>
            <TabsTrigger value="send">Send Payment</TabsTrigger>
            <TabsTrigger value="receive">Receive Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Payment</CardTitle>
                <CardDescription>Send your share of the subscription cost to a friend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input id="recipient" placeholder="Friend's wallet address or email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" defaultValue={amount} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={paymentMethod === "crypto" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("crypto")}
                      className={paymentMethod === "crypto" ? "bg-primary text-white hover:bg-primary/90" : ""}
                    >
                      Cryptocurrency
                    </Button>
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className={paymentMethod === "card" ? "bg-primary text-white hover:bg-primary/90" : ""}
                    >
                      Credit Card
                    </Button>
                  </div>
                </div>
                {paymentMethod === "crypto" && (
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium">Select Cryptocurrency</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        variant={selectedCrypto === "BTC" ? "default" : "outline"}
                        className={`justify-start ${selectedCrypto === "BTC" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
                        onClick={() => setSelectedCrypto("BTC")}
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="BTC" className="mr-2 h-5 w-5" />
                        Bitcoin (BTC)
                      </Button>
                      <Button
                        variant={selectedCrypto === "ETH" ? "default" : "outline"}
                        className={`justify-start ${selectedCrypto === "ETH" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
                        onClick={() => setSelectedCrypto("ETH")}
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="ETH" className="mr-2 h-5 w-5" />
                        Ethereum (ETH)
                      </Button>
                      <Button
                        variant={selectedCrypto === "USDC" ? "default" : "outline"}
                        className={`justify-start ${selectedCrypto === "USDC" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
                        onClick={() => setSelectedCrypto("USDC")}
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="USDC" className="mr-2 h-5 w-5" />
                        USD Coin (USDC)
                      </Button>
                      <Button
                        variant={selectedCrypto === "SOL" ? "default" : "outline"}
                        className={`justify-start ${selectedCrypto === "SOL" ? "bg-primary text-white hover:bg-primary/90" : ""}`}
                        onClick={() => setSelectedCrypto("SOL")}
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="SOL" className="mr-2 h-5 w-5" />
                        Solana (SOL)
                        <Badge className="ml-2 bg-green-500 text-white">Lowest fees</Badge>
                      </Button>
                    </div>

                    {selectedCrypto === "SOL" && (
                      <div className="mt-4 rounded-lg border p-3 bg-green-50">
                        <p className="text-sm font-medium text-green-700">Save on transaction fees with Solana!</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-white">
                            Standard fee: ${standardFee.toFixed(2)}
                          </Badge>
                          <Badge className="bg-green-500">Solana fee: ${solanaFee.toFixed(2)}</Badge>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Save ${savings.toFixed(2)} ({savingsPercentage.toFixed(0)}%) on this transaction!
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={() => toast.success("Payment sent successfully!")}
                >
                  Send Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="receive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Receive Payment</CardTitle>
                <CardDescription>Share your wallet address to receive payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border p-8">
                  <div className="h-48 w-48 bg-gray-100 flex items-center justify-center">
                    <img src="/placeholder.svg?height=192&width=192" alt="QR Code" className="h-full w-full" />
                  </div>
                  <div className="flex w-full items-center space-x-2">
                    <Input value={walletAddress} readOnly />
                    <Button size="icon" variant="outline" onClick={copyToClipboard}>
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Share this address with friends to receive payments for subscription shares
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all your past payments and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Sent to Alex</p>
                      <p className="text-sm text-muted-foreground">Netflix - $5.33</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">-$5.33</p>
                      <p className="text-sm text-muted-foreground">April 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Received from Jamie</p>
                      <p className="text-sm text-muted-foreground">Spotify Family - $3.75</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">+$3.75</p>
                      <p className="text-sm text-muted-foreground">April 5, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Received from Taylor</p>
                      <p className="text-sm text-muted-foreground">Spotify Family - $3.75</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">+$3.75</p>
                      <p className="text-sm text-muted-foreground">April 3, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

