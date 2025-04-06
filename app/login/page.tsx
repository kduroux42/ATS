import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PhantomLogin } from "@/components/phantom-login"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 relative">
      <div className="absolute inset-0 geometric-bg"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center flex flex-col items-center">
          <div className="logo-circle h-20 w-20 mb-2">
            <Image src="/images/logo-black.png" alt="ATS Logo" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold ats-accent">ATS</h1>
          <p className="mt-2 text-gray-600">Split subscription costs with friends using crypto</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Choose your preferred wallet to connect and start using ATS.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <PhantomLogin />
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 text-center">
            <div className="text-sm text-gray-500">
              By connecting your wallet, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

