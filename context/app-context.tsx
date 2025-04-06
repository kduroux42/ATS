"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Member {
  id: string
  name: string
  paid: boolean
  share: number
}

export interface Subscription {
  id: string
  name: string
  cost: number
  dueDate: string
  members: Member[]
  logo?: string
}

export interface Friend {
  id: string
  name: string
  email: string
  walletAddress?: string
  subscriptions: string[]
}

interface AppContextType {
  subscriptions: Subscription[]
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>
  friends: Friend[]
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>
  addSubscription: (subscription: Omit<Subscription, "id" | "members">) => void
  removeSubscription: (id: string) => void
  addFriend: (friend: Omit<Friend, "id" | "subscriptions">) => void
  removeFriend: (id: string) => void
  addFriendToSubscription: (subscriptionId: string, friendEmail: string) => void
  removeFriendFromSubscription: (subscriptionId: string, memberId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Initial data
const initialSubscriptions: Subscription[] = [
  {
    id: "netflix",
    name: "Netflix",
    cost: 15.99,
    dueDate: "2024-05-15",
    members: [
      { id: "1", name: "You", paid: true, share: 5.33 },
      { id: "2", name: "Alex", paid: true, share: 5.33 },
      { id: "3", name: "Sam", paid: false, share: 5.33 },
    ],
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "spotify",
    name: "Spotify Family",
    cost: 14.99,
    dueDate: "2024-05-20",
    members: [
      { id: "1", name: "You", paid: true, share: 3.75 },
      { id: "4", name: "Jamie", paid: true, share: 3.75 },
      { id: "5", name: "Taylor", paid: true, share: 3.75 },
      { id: "6", name: "Jordan", paid: false, share: 3.75 },
    ],
    logo: "/placeholder.svg?height=40&width=40",
  },
]

const initialFriends: Friend[] = [
  {
    id: "2",
    name: "Alex Johnson",
    email: "alex@example.com",
    walletAddress: "0x123...456",
    subscriptions: ["netflix"],
  },
  {
    id: "3",
    name: "Sam Wilson",
    email: "sam@example.com",
    walletAddress: "0x789...012",
    subscriptions: ["netflix"],
  },
  {
    id: "4",
    name: "Jamie Lee",
    email: "jamie@example.com",
    walletAddress: "0x345...678",
    subscriptions: ["spotify"],
  },
  {
    id: "5",
    name: "Taylor Smith",
    email: "taylor@example.com",
    walletAddress: "0x901...234",
    subscriptions: ["spotify"],
  },
  {
    id: "6",
    name: "Jordan Casey",
    email: "jordan@example.com",
    walletAddress: "0x567...890",
    subscriptions: ["spotify"],
  },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage on initial render
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats-subscriptions")
      return saved ? JSON.parse(saved) : initialSubscriptions
    }
    return initialSubscriptions
  })

  const [friends, setFriends] = useState<Friend[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ats-friends")
      return saved ? JSON.parse(saved) : initialFriends
    }
    return initialFriends
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("ats-subscriptions", JSON.stringify(subscriptions))
  }, [subscriptions])

  useEffect(() => {
    localStorage.setItem("ats-friends", JSON.stringify(friends))
  }, [friends])

  // Add a new subscription
  const addSubscription = (subscription: Omit<Subscription, "id" | "members">) => {
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      ...subscription,
      members: [{ id: "1", name: "You", paid: true, share: Number.parseFloat(subscription.cost.toString()) }],
    }
    setSubscriptions((prev) => [...prev, newSubscription])
  }

  // Remove a subscription
  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))

    // Also update friends' subscriptions
    setFriends((prev) =>
      prev.map((friend) => ({
        ...friend,
        subscriptions: friend.subscriptions.filter((subId) => subId !== id),
      })),
    )
  }

  // Add a new friend
  const addFriend = (friend: Omit<Friend, "id" | "subscriptions">) => {
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      ...friend,
      subscriptions: [],
    }
    setFriends((prev) => [...prev, newFriend])
  }

  // Remove a friend
  const removeFriend = (id: string) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== id))

    // Also remove from subscriptions
    setSubscriptions((prev) =>
      prev.map((sub) => ({
        ...sub,
        members: sub.members.filter((member) => member.id !== id),
      })),
    )
  }

  // Add a friend to a subscription
  const addFriendToSubscription = (subscriptionId: string, friendEmail: string) => {
    // Find the friend by email
    const friend = friends.find((f) => f.email === friendEmail)

    if (!friend) {
      // If friend doesn't exist, create a new one with minimal info
      const newFriendName = friendEmail.split("@")[0]
      const newFriend: Friend = {
        id: `friend-${Date.now()}`,
        name: newFriendName,
        email: friendEmail,
        subscriptions: [subscriptionId],
      }
      setFriends((prev) => [...prev, newFriend])

      // Update subscription with new member
      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id === subscriptionId) {
            const newMember: Member = {
              id: newFriend.id,
              name: newFriendName,
              paid: false,
              share: Number((sub.cost / (sub.members.length + 1)).toFixed(2)),
            }

            // Recalculate shares for all members
            const updatedMembers = [...sub.members, newMember].map((member) => ({
              ...member,
              share: Number((sub.cost / (sub.members.length + 1)).toFixed(2)),
            }))

            return {
              ...sub,
              members: updatedMembers,
            }
          }
          return sub
        }),
      )
    } else {
      // If friend exists, add subscription to their list
      setFriends((prev) =>
        prev.map((f) => {
          if (f.id === friend.id) {
            return {
              ...f,
              subscriptions: [...f.subscriptions, subscriptionId],
            }
          }
          return f
        }),
      )

      // Update subscription with existing friend
      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id === subscriptionId) {
            // Check if friend is already a member
            if (sub.members.some((member) => member.id === friend.id)) {
              return sub
            }

            const newMember: Member = {
              id: friend.id,
              name: friend.name,
              paid: false,
              share: Number((sub.cost / (sub.members.length + 1)).toFixed(2)),
            }

            // Recalculate shares for all members
            const updatedMembers = [...sub.members, newMember].map((member) => ({
              ...member,
              share: Number((sub.cost / (sub.members.length + 1)).toFixed(2)),
            }))

            return {
              ...sub,
              members: updatedMembers,
            }
          }
          return sub
        }),
      )
    }
  }

  // Remove a friend from a subscription
  const removeFriendFromSubscription = (subscriptionId: string, memberId: string) => {
    // Update subscription by removing the member
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          const updatedMembers = sub.members.filter((member) => member.id !== memberId)

          // Recalculate shares for remaining members
          const recalculatedMembers = updatedMembers.map((member) => ({
            ...member,
            share: Number((sub.cost / updatedMembers.length).toFixed(2)),
          }))

          return {
            ...sub,
            members: recalculatedMembers,
          }
        }
        return sub
      }),
    )

    // Update friend by removing the subscription
    setFriends((prev) =>
      prev.map((friend) => {
        if (friend.id === memberId) {
          return {
            ...friend,
            subscriptions: friend.subscriptions.filter((subId) => subId !== subscriptionId),
          }
        }
        return friend
      }),
    )
  }

  return (
    <AppContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        friends,
        setFriends,
        addSubscription,
        removeSubscription,
        addFriend,
        removeFriend,
        addFriendToSubscription,
        removeFriendFromSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

