"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, CreditCard, LogOut, Plus, Settings, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddSubscriptionForm } from "@/components/add-subscription-form"
import { AddFriendForm } from "@/components/add-friend-form"
import { ManageSubscriptionModal } from "@/components/manage-subscription-modal"
import { useAppContext } from "@/context/app-context"

export default function DashboardPage() {
  const {
    subscriptions,
    friends,
    addSubscription,
    removeSubscription,
    addFriend,
    addFriendToSubscription,
    removeFriendFromSubscription,
  } = useAppContext()

  const [activeSubscription, setActiveSubscription] = useState<(typeof subscriptions)[0] | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false)
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  // Function to handle adding a new subscription
  const handleAddSubscription = (data: any) => {
    addSubscription({
      name: data.name,
      cost: Number.parseFloat(data.cost),
      dueDate: data.billingDate,
    })
    setIsAddSubscriptionOpen(false)
    toast.success(`${data.name} subscription added successfully!`)
  }

  // Function to handle adding a friend to a subscription
  const handleAddFriendToSubscription = (subscriptionId: string, friendEmail: string) => {
    addFriendToSubscription(subscriptionId, friendEmail)
    toast.success(`Friend added to ${activeSubscription?.name}!`)
  }

  // Function to handle removing a friend from a subscription
  const handleRemoveFriend = (subscriptionId: string, memberId: string) => {
    removeFriendFromSubscription(subscriptionId, memberId)
    toast.success("Friend removed from subscription")
  }

  // Function to handle sending a reminder
  const handleSendReminder = (subscriptionId: string, memberId: string) => {
    const subscription = subscriptions.find((sub) => sub.id === subscriptionId)
    const member = subscription?.members.find((m) => m.id === memberId)

    if (subscription && member) {
      toast.success(`Payment reminder sent to ${member.name}`)
    }
  }

  // Function to handle adding a global friend
  const handleAddFriend = (data: any) => {
    addFriend({
      name: data.name,
      email: data.email,
      walletAddress: data.walletAddress,
    })
    toast.success(`Friend ${data.name} added successfully!`)
    setIsAddFriendOpen(false)
  }

  // Function to handle deleting a subscription
  const handleDeleteSubscription = (subscriptionId: string) => {
    removeSubscription(subscriptionId)
    toast.success("Subscription deleted successfully")
  }

  // Function to open the manage modal
  const openManageModal = (subscription: (typeof subscriptions)[0]) => {
    setActiveSubscription(subscription)
    setIsManageModalOpen(true)
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
          <Link className="text-sm font-medium ats-accent" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="/dashboard/payments">
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
          <h1 className="font-semibold text-lg md:text-2xl ats-accent">Dashboard</h1>
          <Button
            size="sm"
            className="ml-auto bg-primary text-white hover:bg-primary/90"
            onClick={() => setIsAddSubscriptionOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subscription
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => setIsAddFriendOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex items-center">
            <TabsList className="bg-white">
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Pending Payments
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Payment History
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id} className="overflow-hidden bg-white">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <img
                      alt={subscription.name}
                      className="rounded-md object-cover"
                      height="40"
                      src={subscription.logo || "/placeholder.svg"}
                      width="40"
                    />
                    <div>
                      <CardTitle>{subscription.name}</CardTitle>
                      <CardDescription>${subscription.cost}/month</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Next payment:</span>
                      <span className="text-sm font-medium">{new Date(subscription.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Members:</span>
                      <div className="mt-1 flex -space-x-2">
                        {subscription.members.map((member) => (
                          <Avatar
                            key={member.id}
                            className={`border-2 ${member.paid ? "border-green-500" : "border-red-500"}`}
                          >
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => openManageModal(subscription)}
                    >
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="flex h-full flex-col items-center justify-center p-6 bg-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Plus className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-4 text-xl font-medium ats-accent">Add Subscription</h3>
                <p className="mb-4 mt-2 text-center text-sm text-gray-500">
                  Add a new subscription to split with your friends.
                </p>
                <Button
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => setIsAddSubscriptionOpen(true)}
                >
                  Add Subscription
                </Button>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>These are the payments that are due from your friends.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.flatMap((sub) =>
                    sub.members
                      .filter((member) => !member.paid && member.name !== "You")
                      .map((member) => (
                        <div key={`${sub.id}-${member.id}`} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-gray-200 text-gray-700">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">
                                {sub.name} - ${member.share.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary text-white hover:bg-primary/90"
                            onClick={() => handleSendReminder(sub.id, member.id)}
                          >
                            Send Reminder
                          </Button>
                        </div>
                      )),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all past payments from your friends.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gray-200 text-gray-700">A</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Alex</p>
                        <p className="text-sm text-gray-500">Netflix - $5.33</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Paid on April 10, 2024</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gray-200 text-gray-700">J</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Jamie</p>
                        <p className="text-sm text-gray-500">Spotify Family - $3.75</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Paid on April 5, 2024</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gray-200 text-gray-700">T</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Taylor</p>
                        <p className="text-sm text-gray-500">Spotify Family - $3.75</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Paid on April 3, 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Manage Subscription Modal */}
      <ManageSubscriptionModal
        subscription={activeSubscription}
        open={isManageModalOpen}
        onOpenChange={setIsManageModalOpen}
        onAddFriend={handleAddFriendToSubscription}
        onRemoveFriend={handleRemoveFriend}
        onSendReminder={handleSendReminder}
        onDeleteSubscription={handleDeleteSubscription}
      />

      {/* Add Subscription Dialog */}
      <Dialog open={isAddSubscriptionOpen} onOpenChange={setIsAddSubscriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
            <DialogDescription>Enter the details of the subscription you want to split with friends.</DialogDescription>
          </DialogHeader>
          <AddSubscriptionForm onSubmit={handleAddSubscription} />
        </DialogContent>
      </Dialog>

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

