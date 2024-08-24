import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/forms/label"
import { FormMessage, Message } from "@/components/forms/form-message"
import { encodedRedirect } from "@/utils/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function Login({ searchParams }: { searchParams: Message }) {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return encodedRedirect("error", "/login", "Could not authenticate user")
    }

    return redirect("/dashboard")
  }

  return (
    <main className="w-full px-6 pt-14 lg:px-8">
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
              <CardTitle>Log in</CardTitle>
              <CardDescription>
                Don&apos;t have an account?{" "}
                <Link
                  className="text-blue-600 font-medium hover:underline"
                  href="/signup"
                >
                  Sign up
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      className="text-sm text-blue-600 hover:underline"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button className="w-full" formAction={signIn}>
                  Log in
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <FormMessage message={searchParams} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
