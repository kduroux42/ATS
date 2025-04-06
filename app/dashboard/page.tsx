"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, History } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddSubscriptionForm } from "@/components/add-subscription-form"
import { AddFriendForm } from "@/components/add-friend-form"
import { ManageSubscriptionModal } from "@/components/manage-subscription-modal"
import { useAppContext } from "@/context/app-context"
import { useWallet } from "@/context/wallet-context"
import { HeaderWithWallet } from "@/components/header-with-wallet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardPage() {
  const {
    subscriptions,
    addSubscription,
    removeSubscription,
    addFriend,
    addFriendToSubscription,
    removeFriendFromSubscription,
  } = useAppContext()

  const { connected } = useWallet()
  const router = useRouter()

  const [activeSubscription, setActiveSubscription] = useState<(typeof subscriptions)[0] | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false)
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  // Get payment history from localStorage
  const [paymentHistory, setPaymentHistory] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats-payment-history")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return [] // Empty array for first-time users
  })

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!connected) {
      toast.error("Veuillez vous connecter pour accéder au tableau de bord")
      router.push("/login")
    }
  }, [connected, router])

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
    // Trouver le nom de la souscription pour le message de confirmation
    const subscription = subscriptions.find((sub) => sub.id === subscriptionId)
    const subscriptionName = subscription ? subscription.name : "Subscription"

    // Supprimer la souscription
    removeSubscription(subscriptionId)

    // Afficher un message de confirmation
    toast.success(`${subscriptionName} has been deleted successfully`)
  }

  // Function to open the manage modal
  const openManageModal = (subscription: (typeof subscriptions)[0]) => {
    setActiveSubscription(subscription)
    setIsManageModalOpen(true)
  }

  if (!connected) {
    return null // Ne rien afficher pendant la redirection
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeaderWithWallet activePage="dashboard" />
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
            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Plus className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium ats-accent">No Subscriptions Yet</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  You haven't added any subscriptions yet. Add your first subscription to start splitting costs with
                  friends.
                </p>
                <Button
                  className="mt-4 bg-primary text-white hover:bg-primary/90"
                  onClick={() => setIsAddSubscriptionOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Subscription
                </Button>
              </div>
            ) : (
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
                        <span className="text-sm font-medium">
                          {new Date(subscription.dueDate).toLocaleDateString()}
                        </span>
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
            )}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>These are the payments that are due from your friends.</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.flatMap((sub) => sub.members.filter((member) => !member.paid && member.name !== "You"))
                  .length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No pending payments at the moment.</p>
                    {subscriptions.length === 0 && (
                      <p className="mt-2 text-sm text-gray-400">
                        Add subscriptions and invite friends to see pending payments here.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.flatMap((sub) =>
                      sub.members
                        .filter((member) => !member.paid && member.name !== "You")
                        .map((member) => (
                          <div
                            key={`${sub.id}-${member.id}`}
                            className="flex items-center justify-between border-b pb-4"
                          >
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
                )}
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
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <History className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium ats-accent">No Payment History Yet</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      Your payment history will appear here once you've sent or received payments.
                    </p>
                    <Button
                      className="mt-4 bg-primary text-white hover:bg-primary/90"
                      onClick={() => router.push("/dashboard/payments")}
                    >
                      Go to Payments
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">
                            {payment.type === "sent" ? `Sent to ${payment.name}` : `Received from ${payment.name}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.subscription} - ${payment.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${payment.type === "sent" ? "text-red-500" : "text-green-500"}`}>
                            {payment.type === "sent" ? "-" : "+"}${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

