import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/forms/label"
import { FormMessage, Message } from "@/components/forms/form-message"
import { headers } from "next/headers"
import { encodedRedirect } from "@/utils/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message
}) {
  const forgotPassword = async (formData: FormData) => {
    "use server"

    const email = formData.get("email")?.toString()
    const supabase = createClient()
    const origin = headers().get("origin")
    const callbackUrl = formData.get("callbackUrl")?.toString()

    if (!email) {
      return encodedRedirect("error", "/forgot-password", "Email is required")
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
    })

    if (error) {
      console.error(error.message)
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not reset password",
      )
    }

    if (callbackUrl) {
      return redirect(callbackUrl)
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password.",
    )
  }

  return (
    <div className="w-full px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="flex flex-col items-center justify-center">
          <Link
            href="/"
            className="mb-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>{" "}
            Back
          </Link>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link
                  className="text-blue-600 font-medium hover:underline"
                  href="/login"
                >
                  Log in
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={forgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <FormMessage message={searchParams} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
