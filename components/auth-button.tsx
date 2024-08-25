import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Power } from "lucide-react"

export default async function AuthButton() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    "use server"

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect("/login")
  }

  return user ? (
    <div className="flex items-center gap-4">
      {user.email}
      <form action={signOut}>
        <Button variant="outline">
          <Power className="h-4 w-4 mr-2" /> Logout
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="flex items-center justify-center rounded-md no-underline text-sm font-medium px-4"
      >
        Login
      </Link>
      <Button size="sm" asChild>
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  )
}
