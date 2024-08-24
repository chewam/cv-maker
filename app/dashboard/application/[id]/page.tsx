import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default async function ApplicationPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: application, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error) {
    console.error("Error fetching application:", error)
    return <div>Error loading application</div>
  }

  if (!application) {
    return <div>Application not found</div>
  }

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Application</h1>
      <Card>
        <CardHeader>
          <CardTitle>{application.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                defaultValue={application.title}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                defaultValue={application.description}
              />
            </div>
            <Button type="submit">Update Application</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
