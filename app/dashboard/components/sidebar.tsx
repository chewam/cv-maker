"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database.types"
import { cn } from "@/lib/utils"

type Application = Database["public"]["Tables"]["applications"]["Row"]

export default function Sidebar({
  applications,
}: {
  applications: Application[]
}) {
  const pathname = usePathname()
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
            {applications.map((app) => {
              const href = `/dashboard/application/${app.id}`
              return (
                <Button
                  asChild
                  size="sm"
                  key={app.id}
                  className={cn(
                    "justify-start",
                    pathname === href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                  )}
                  variant="ghost"
                >
                  <Link href={href}>{app.title}</Link>
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
