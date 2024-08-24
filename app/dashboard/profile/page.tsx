import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ExperienceManager from "@/components/ExperienceManager"
import LinkManager from "@/components/LinkManager"

export default async function ProfilePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner", user.id)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return <div>Error loading profile</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                defaultValue={user.email || ""}
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                Firstname
              </label>
              <Input
                type="text"
                id="firstname"
                name="firstname"
                defaultValue={profile?.firstname || ""}
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Lastname
              </label>
              <Input
                type="text"
                id="lastname"
                name="lastname"
                defaultValue={profile?.lastname || ""}
              />
            </div>
            <Button size="sm" type="submit">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <ExperienceManager profileId={profile.id} />
      <LinkManager profileId={profile.id} />
    </main>
  )
}
