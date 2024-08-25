import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ExperienceManager from "./components/experience-manager"
import LinkManager from "./components/link-manager"
import ProfileForm from "./components/profile-form"
import Sidebar from "../components/sidebar"

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
    <div className="flex flex-1">
      <Sidebar user={user} />
      <div className="flex-1 p-6 overflow-auto">
        <main className="space-y-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <ProfileForm user={user} profile={profile} />
          <ExperienceManager profileId={profile.id} />
          <LinkManager profileId={profile.id} />
        </main>
      </div>
    </div>
  )
}
