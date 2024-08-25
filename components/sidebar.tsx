"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database.types"
import { cn } from "@/lib/utils"
import { Bookmark, ClipboardList, LinkIcon, User } from "lucide-react"

type Application = Database["public"]["Tables"]["applications"]["Row"]

export default function Sidebar({
  applications,
}: {
  applications: Application[]
}) {
  const pathname = usePathname()
  return (
    <div className="border-r border-foreground/10 w-72">
      <nav className="p-4 space-y-4">
        <div className="pt-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground/50 uppercase">
            Profile
          </h3>
          <div className="grid gap-1 px-2">
            <Button variant="link" className="justify-start" asChild>
              <Link href="/dashboard/profile">
                <User className="w-4 h-4 mr-2" /> Identité
              </Link>
            </Button>
            <Button variant="link" className="justify-start" asChild>
              <Link href="/dashboard/profile#experiences">
                <ClipboardList className="w-4 h-4 mr-2" /> Expériences
              </Link>
            </Button>
            <Button variant="link" className="justify-start" asChild>
              <Link href="/dashboard/profile#links">
                <LinkIcon className="w-4 h-4 mr-2" /> Liens
              </Link>
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground/50 uppercase">
            Applications
          </h3>
          <div className="grid gap-1 px-2">
            {applications.map((app) => {
              const href = `/dashboard/application/${app.id}`
              return (
                <Button
                  asChild
                  key={app.id}
                  className={cn(
                    "justify-start capitalize",
                    pathname === href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                  )}
                  variant="ghost"
                >
                  <Link href={href}>
                    <Bookmark className="w-4 h-4 mr-2" /> {app.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
