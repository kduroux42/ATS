"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/context/wallet-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function PhantomLogin() {
  const { connected, publicKey } = useWallet()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!connected || !publicKey) {
      toast.error("Veuillez d'abord connecter votre wallet")
      // Rediriger vers l'extension Phantom si le wallet n'est pas connecté
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      setIsLoggingIn(true)

      // Simuler une vérification d'authentification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Ici, vous pourriez vérifier si le wallet est associé à un compte existant
      // et créer une session utilisateur

      toast.success("Connexion réussie avec Phantom Wallet")
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      toast.error("Erreur lors de la connexion")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion avec Phantom Wallet</CardTitle>
        <CardDescription>
          Connectez-vous en utilisant votre wallet Solana pour accéder à votre compte ATS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Phantom est un wallet Solana sécurisé qui vous permet de gérer vos crypto-monnaies et de vous connecter à
            des applications décentralisées.
          </p>

          <WalletConnectButton fullWidth />

          {connected && publicKey && (
            <p className="mt-4 text-sm text-green-600 text-center">
              Wallet connecté! Cliquez sur "Se connecter" pour accéder à votre compte.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={!connected || isLoggingIn}
          onClick={handleLogin}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

