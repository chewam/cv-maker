import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export default async function Sidebar({ user }: { user: User }) {
  const supabase = createClient()

  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, title")
    .eq("owner", user.id)

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="w-64 border-r border-foreground/10">
      <nav className="p-4 space-y-4">
        <Link
          href="/dashboard/profile"
          className="block hover:bg-white/10 p-2 rounded text-foreground"
        >
          Profile
        </Link>
        <div className="pt-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground/50 uppercase">
            Applications
          </h3>
          <div className="grid gap-1 px-2">
            {applications?.map((app) => (
              <Button
                key={app.id}
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
              >
                <Link href={`/dashboard/application/${app.id}`}>
                  {app.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}
