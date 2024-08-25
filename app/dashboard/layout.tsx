import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "./components/sidebar"

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
    .select("*")
    .eq("owner", user.id)

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="flex-1 pt-24 w-full flex flex-col relative isolate">
      <div className="flex flex-1">
        {applications && <Sidebar applications={applications} />}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
