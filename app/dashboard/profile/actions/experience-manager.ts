"use server"

import { createClient } from "@/utils/supabase/server"
import { Database } from "@/types/database.types"

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

export async function fetchExperiences(profileId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile", profileId)
    .order("start_date", { ascending: false })
  if (error) throw error
  return data || []
}

export async function saveExperience(
  experience: Partial<Experience>,
  profileId: number,
) {
  const supabase = createClient()
  if (experience.id) {
    const { error } = await supabase
      .from("experiences")
      .update(experience)
      .eq("id", experience.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("experiences")
      .insert({ ...experience, profile: profileId })
    if (error) throw error
  }
}

export async function deleteExperience(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from("experiences").delete().eq("id", id)
  if (error) throw error
}
