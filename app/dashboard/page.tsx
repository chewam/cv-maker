import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
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

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="animate-in flex-1 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <h2 className="text-xl font-semibold">Your Applications</h2>
      {applications && applications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>{app.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{app.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Created: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  )
}
