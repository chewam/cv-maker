"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Database } from "@/types/database.types"
import { FilePenLine, Plus, Trash2 } from "lucide-react"

type Link = Database["public"]["Tables"]["links"]["Row"]

const LinkManager: React.FC<{ profileId: number }> = ({ profileId }) => {
  const [links, setLinks] = useState<Link[]>([])
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()

  const fetchLinks = useCallback(async () => {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("profile", profileId)
    if (error) {
      console.error("Error fetching links:", error)
    } else {
      setLinks(data || [])
    }
  }, [supabase, profileId])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const handleSave = async (link: Partial<Link>) => {
    if (editingLink) {
      const { error } = await supabase
        .from("links")
        .update(link)
        .eq("id", editingLink.id)
      if (error) {
        console.error("Error updating link:", error)
      } else {
        fetchLinks()
        setEditingLink(null)
      }
    } else {
      const { error } = await supabase
        .from("links")
        .insert({ ...link, profile: profileId })
      if (error) {
        console.error("Error adding link:", error)
      } else {
        fetchLinks()
        setIsAdding(false)
      }
    }
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("links").delete().eq("id", id)
    if (error) {
      console.error("Error deleting link:", error)
    } else {
      fetchLinks()
    }
  }

  const LinkForm = ({
    link,
    onSave,
    onCancel,
  }: {
    link: Partial<Link>
    onSave: (link: Partial<Link>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState(link)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
      <div className="space-y-2">
        <Input
          name="url"
          value={formData.url || ""}
          onChange={handleChange}
          placeholder="URL"
        />
        <Input
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description (e.g., LinkedIn, GitHub)"
        />
        <Button size="sm" onClick={() => onSave(formData)}>
          Save
        </Button>
        <Button size="sm" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="p-2 border rounded">
              {editingLink?.id === link.id ? (
                <LinkForm
                  link={editingLink}
                  onSave={handleSave}
                  onCancel={() => setEditingLink(null)}
                />
              ) : (
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">{link.description}</h3>
                    <p>{link.url}</p>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingLink(link)}
                    >
                      <FilePenLine className="h-4 w-4 mr-2" />
                      Editer
                    </Button>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={() => handleDelete(link.id)}
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isAdding ? (
            <LinkForm
              link={{}}
              onSave={handleSave}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter un lien
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LinkManager
