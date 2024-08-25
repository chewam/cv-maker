import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database.types"

import type { User } from "@supabase/supabase-js"
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default async function ProfileForm({
  user,
  profile,
}: {
  user: User
  profile: Profile
}) {
  return (
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
              defaultValue={profile.firstname || ""}
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
              defaultValue={profile.lastname || ""}
            />
          </div>
          <Button size="sm" type="submit">
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
