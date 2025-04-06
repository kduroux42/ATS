"use client"

import { useState } from "react"
import { Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddFriendForm } from "@/components/add-friend-form"
import { useAppContext } from "@/context/app-context"
import { HeaderWithWallet } from "@/components/header-with-wallet"

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
      <HeaderWithWallet activePage="friends" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">Friends</h1>
          <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddFriendOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <UserPlus className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium ats-accent">No Friends Added Yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't added any friends yet. Add friends to start splitting subscription costs with them.
            </p>
            <Button className="mt-4 bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddFriendOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Your First Friend
            </Button>
          </div>
        ) : (
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
        )}
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

