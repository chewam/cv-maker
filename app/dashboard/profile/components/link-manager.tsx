"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Database } from "@/types/database.types"
import { FilePenLine, Plus, Save, Trash2, Undo2 } from "lucide-react"
import { fetchLinks, saveLink, deleteLink } from "../actions/link-manager"

type Link = Database["public"]["Tables"]["links"]["Row"]

const linkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  description: z.string().min(1, { message: "Description is required" }),
})

type LinkFormValues = z.infer<typeof linkSchema>

const LinkManager: React.FC<{ profileId: number }> = ({ profileId }) => {
  const [links, setLinks] = useState<Link[]>([])
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
      description: "",
    },
  })

  const loadLinks = useCallback(async () => {
    try {
      const fetchedLinks = await fetchLinks(profileId)
      setLinks(fetchedLinks)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load links",
        variant: "destructive",
      })
    }
  }, [profileId, toast])

  useEffect(() => {
    loadLinks()
  }, [loadLinks])

  const onSubmit = async (values: LinkFormValues) => {
    try {
      await saveLink(
        editingLinkId ? { ...values, id: editingLinkId } : values,
        profileId,
      )
      await loadLinks()
      setEditingLinkId(null)
      setIsAdding(false)
      form.reset()
      toast({
        title: "Success",
        description: editingLinkId ? "Link updated" : "Link added",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save link",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteLink(id)
      await loadLinks()
      toast({
        title: "Success",
        description: "Link deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      })
    }
  }

  const LinkForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., LinkedIn, GitHub" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit" size="sm">
            <Save className="h-4 w-4 mr-2" /> Enregistrer
          </Button>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => {
              setEditingLinkId(null)
              setIsAdding(false)
              form.reset()
            }}
          >
            <Undo2 className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
      </form>
    </Form>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liens</CardTitle>
        <CardDescription>
          Liens vers votre site web ou vos profils sur les réseaux sociaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="p-2 border rounded">
              {editingLinkId === link.id ? (
                <LinkForm />
              ) : (
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">{link.description}</h3>
                    <p>{link.url}</p>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingLinkId(link.id)
                        form.reset({
                          url: link.url,
                          description: link.description || "",
                        })
                      }}
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
            <LinkForm />
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
