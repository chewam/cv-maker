"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateApplication(formData: {
  id: string
  title: string
  description: string
  text: string
}) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("applications")
      .update({
        title: formData.title,
        description: formData.description,
        text: formData.text,
      })
      .eq("id", formData.id)

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Error updating application")
    }

    revalidatePath("/applications")
    return data
  } catch (error) {
    console.error("Error in updateApplication:", error)
    throw error
  }
}
