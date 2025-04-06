"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletStatus } from "@/components/wallet-status"
import { useWallet } from "@/context/wallet-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface HeaderWithWalletProps {
  activePage?: "dashboard" | "payments" | "friends"
}

export function HeaderWithWallet({ activePage }: HeaderWithWalletProps) {
  const { disconnectWallet } = useWallet()
  const router = useRouter()

  const handleLogout = async () => {
    await disconnectWallet()
    toast.success("Déconnecté avec succès")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Link className="flex items-center gap-2" href="#">
        <div className="logo-circle h-8 w-8">
          <Image src="/images/ats-logo.png" alt="ATS Logo" width={24} height={24} className="object-contain" />
        </div>
        <span className="font-bold ats-accent">ATS</span>
      </Link>
      <nav className="hidden flex-1 items-center gap-6 md:flex">
        <Link
          className={`text-sm font-medium ${
            activePage === "dashboard" ? "ats-accent" : "text-gray-600 hover:text-gray-900"
          }`}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={`text-sm font-medium ${
            activePage === "payments" ? "ats-accent" : "text-gray-600 hover:text-gray-900"
          }`}
          href="/dashboard/payments"
        >
          Payments
        </Link>
        <Link
          className={`text-sm font-medium ${
            activePage === "friends" ? "ats-accent" : "text-gray-600 hover:text-gray-900"
          }`}
          href="/dashboard/friends"
        >
          Friends
        </Link>
      </nav>
      <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
        <WalletStatus />
        <Button variant="outline" size="icon" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100">
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
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

