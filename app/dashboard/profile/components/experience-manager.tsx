"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilePenLine, Plus, Trash2 } from "lucide-react"
import { ExperienceForm } from "./experience-form"
import {
  fetchExperiences,
  saveExperience,
  deleteExperience,
} from "../actions/experience-manager"
import { format } from "date-fns"
import { Database } from "@/types/database.types"

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

const ExperienceManager: React.FC<{ profileId: number }> = ({ profileId }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(
    null,
  )
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const loadExperiences = useCallback(async () => {
    try {
      const fetchedExperiences = await fetchExperiences(profileId)
      setExperiences(fetchedExperiences)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load experiences",
        variant: "destructive",
      })
    }
  }, [profileId, toast])

  useEffect(() => {
    loadExperiences()
  }, [loadExperiences])

  const handleSave = async (values: {
    company: string
    role: string
    location: string
    start_date: string
    end_date: string | null
  }) => {
    try {
      await saveExperience(
        editingExperienceId ? { ...values, id: editingExperienceId } : values,
        profileId,
      )
      await loadExperiences()
      setEditingExperienceId(null)
      setIsAdding(false)
      toast({
        title: "Success",
        description: editingExperienceId
          ? "Experience updated"
          : "Experience added",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteExperience(id)
      await loadExperiences()
      toast({
        title: "Success",
        description: "Experience deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiences</CardTitle>
        <CardDescription>
          L&apos;ensemble de vos expériences professionnelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="p-2 border rounded">
              {editingExperienceId === experience.id ? (
                <ExperienceForm
                  onSubmit={handleSave}
                  initialData={experience}
                  onCancel={() => setEditingExperienceId(null)}
                />
              ) : (
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="font-bold">
                      {experience.role} at {experience.company}
                    </h3>
                    <p>{experience.location}</p>
                    <p>
                      {format(new Date(experience.start_date), "PPP")} -{" "}
                      {experience.end_date
                        ? format(new Date(experience.end_date), "PPP")
                        : "Present"}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingExperienceId(experience.id)}
                    >
                      <FilePenLine className="h-4 w-4 mr-2" /> Editer
                    </Button>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={() => handleDelete(experience.id)}
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
            <ExperienceForm
              onSubmit={handleSave}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter une expérience
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceManager
