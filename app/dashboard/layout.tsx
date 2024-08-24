import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "./components/Sidebar"
import AuthButton from "@/components/AuthButton"
import BackgroundEffect from "@/components/BackgroundEffect"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, title")

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="flex-1 w-full flex flex-col bg-white relative isolate min-h-screen">
      <BackgroundEffect />

      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm">
          <div></div> {/* Placeholder for left-aligned content if needed */}
          <AuthButton />
        </div>
      </nav>

      <div className="flex flex-1">
        <Sidebar user={user} applications={applications || []} />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  )
}
