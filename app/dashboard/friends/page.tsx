"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, CreditCard, LogOut, Plus, Settings, User, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddFriendForm } from "@/components/add-friend-form"
import { useAppContext } from "@/context/app-context"

export default function FriendsPage() {
  const { friends, subscriptions, addFriend, removeFriend } = useAppContext()
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  // Function to handle adding a friend
  const handleAddFriend = (data: any) => {
    addFriend({
      name: data.name,
      email: data.email,
      walletAddress: data.walletAddress,
    })
    toast.success(`Friend ${data.name} added successfully!`)
    setIsAddFriendOpen(false)
  }

  // Function to handle removing a friend
  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId)
    toast.success("Friend removed successfully")
  }

  // Get subscription names for display
  const getSubscriptionNames = (subscriptionIds: string[]) => {
    return subscriptionIds
      .map((id) => {
        const subscription = subscriptions.find((sub) => sub.id === id)
        return subscription ? subscription.name : ""
      })
      .filter(Boolean)
  }

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
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/dashboard/payments">
            Payments
          </Link>
          <Link className="text-sm font-medium ats-accent" href="/dashboard/friends">
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
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">Friends</h1>
          <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddFriendOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <Card key={friend.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{friend.name}</CardTitle>
                  <CardDescription>{friend.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet Address:</span>
                    <span className="text-sm font-medium">{friend.walletAddress || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shared Subscriptions:</span>
                    <div className="flex flex-wrap gap-1">
                      {getSubscriptionNames(friend.subscriptions).map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {sub}
                        </span>
                      ))}
                      {friend.subscriptions.length === 0 && <span className="text-sm text-gray-500">None</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Remove
                </Button>
                <Button variant="outline" size="sm">
                  Send Payment
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex h-full flex-col items-center justify-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-medium">Add Friend</h3>
            <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
              Add a new friend to split subscription costs with.
            </p>
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddFriendOpen(true)}>
              Add Friend
            </Button>
          </Card>
        </div>
      </main>

      {/* Add Friend Dialog */}
      <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Friend</DialogTitle>
            <DialogDescription>Add a friend to split subscription costs with.</DialogDescription>
          </DialogHeader>
          <AddFriendForm onSubmit={handleAddFriend} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

