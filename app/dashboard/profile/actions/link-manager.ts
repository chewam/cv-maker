"use server"

import { createClient } from "@/utils/supabase/server"
import { Database } from "@/types/database.types"

type Link = Database["public"]["Tables"]["links"]["Row"]

export async function fetchLinks(profileId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("profile", profileId)
  if (error) throw error
  return data || []
}

export async function saveLink(link: Partial<Link>, profileId: number) {
  const supabase = createClient()
  if (link.id) {
    const { error } = await supabase
      .from("links")
      .update(link)
      .eq("id", link.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("links")
      .insert({ ...link, profile: profileId })
    if (error) throw error
  }
}

export async function deleteLink(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from("links").delete().eq("id", id)
  if (error) throw error
}
