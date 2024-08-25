import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ApplicationForm from "./components/application-form"

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

  return <ApplicationForm application={application} />
}
