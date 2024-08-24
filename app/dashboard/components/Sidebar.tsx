import Link from "next/link"
import { User } from "@supabase/supabase-js"

type Application = {
  id: string
  title: string
}

type SidebarProps = {
  user: User
  applications: Application[]
}

export default function Sidebar({ applications }: SidebarProps) {
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
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/application/${app.id}`}
              className="block hover:bg-white/10 p-2 rounded text-foreground"
            >
              {app.title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
