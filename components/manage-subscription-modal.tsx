"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, X, Send, Trash2, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// First, import the AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Member {
  id: string
  name: string
  paid: boolean
  share: number
}

interface SubscriptionDetails {
  id: string
  name: string
  cost: number
  dueDate: string
  members: Member[]
  logo?: string
}

interface ManageSubscriptionModalProps {
  subscription: SubscriptionDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddFriend: (subscriptionId: string, friendEmail: string) => void
  onRemoveFriend: (subscriptionId: string, memberId: string) => void
  onSendReminder: (subscriptionId: string, memberId: string) => void
  onDeleteSubscription: (subscriptionId: string) => void
}

export function ManageSubscriptionModal({
  subscription,
  open,
  onOpenChange,
  onAddFriend,
  onRemoveFriend,
  onSendReminder,
  onDeleteSubscription,
}: ManageSubscriptionModalProps) {
  const [friendEmail, setFriendEmail] = useState("")
  // Inside the ManageSubscriptionModal component, add a state for the alert dialog
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  if (!subscription) return null

  const handleAddFriend = () => {
    if (friendEmail.trim()) {
      onAddFriend(subscription.id, friendEmail)
      setFriendEmail("")
    }
  }

  // Replace the handleDeleteSubscription function with this:
  const handleDeleteSubscription = () => {
    // Open the confirmation dialog instead of deleting immediately
    setShowDeleteAlert(true)
  }

  // Add a new function to handle the confirmed deletion
  const confirmDeleteSubscription = () => {
    // Call the deletion function passed as prop
    onDeleteSubscription(subscription.id)
    // Close both dialogs
    setShowDeleteAlert(false)
    onOpenChange(false)
  }

  // Calculate fee savings with Solana
  const standardFeePercentage = 2.5
  const solanaFeePercentage = 0.5
  const standardFee = subscription.cost * (standardFeePercentage / 100)
  const solanaFee = subscription.cost * (solanaFeePercentage / 100)
  const savings = standardFee - solanaFee
  const savingsPercentage = ((standardFee - solanaFee) / standardFee) * 100

  // Add the AlertDialog component at the end of the component, just before the final closing tag:
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {subscription.logo && (
                <img
                  src={subscription.logo || "/placeholder.svg"}
                  alt={subscription.name}
                  className="h-8 w-8 rounded-md object-cover"
                />
              )}
              <span>Manage {subscription.name}</span>
            </DialogTitle>
            <DialogDescription>
              Total cost: ${subscription.cost}/month | Due date: {new Date(subscription.dueDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="space-y-4 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Current Members</h3>
                <div className="space-y-3">
                  {subscription.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className={`border-2 ${member.paid ? "border-green-500" : "border-red-500"}`}>
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">${member.share.toFixed(2)}/month</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!member.paid && member.name !== "You" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSendReminder(subscription.id, member.id)}
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Remind
                          </Button>
                        )}
                        {member.name !== "You" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => onRemoveFriend(subscription.id, member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">Add Friend to Subscription</h3>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="friend@example.com"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddFriend} className="bg-primary text-white hover:bg-primary/90">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subscription-name">Subscription Name</Label>
                  <Input id="subscription-name" defaultValue={subscription.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subscription-cost">Monthly Cost</Label>
                  <Input id="subscription-cost" type="number" defaultValue={subscription.cost} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subscription-date">Billing Date</Label>
                  <Input
                    id="subscription-date"
                    type="date"
                    defaultValue={new Date(subscription.dueDate).toISOString().split("T")[0]}
                  />
                </div>

                <div className="mt-4 rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Save on transaction fees with Solana</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with Solana and save {savingsPercentage.toFixed(0)}% on transaction fees.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-white">
                          Standard fee: ${standardFee.toFixed(2)}
                        </Badge>
                        <Badge className="bg-primary">Solana fee: ${solanaFee.toFixed(2)}</Badge>
                      </div>
                      <p className="text-sm font-medium text-green-600 mt-2">Save ${savings.toFixed(2)} per month!</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t mt-4">
                  <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
                  <Button variant="destructive" className="w-full" onClick={handleDeleteSubscription}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Subscription
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Les boutons "Close" et "Save Changes" ont été supprimés */}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {subscription.name} subscription and remove
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubscription} className="bg-red-600 text-white hover:bg-red-700">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

