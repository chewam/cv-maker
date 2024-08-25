"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database.types"
import { createClient } from "@/utils/supabase/client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FilePenLine, Plus, Save, Trash2, Undo2 } from "lucide-react"

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

const ExperienceManager: React.FC<{ profileId: number }> = ({ profileId }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  )
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()

  const fetchExperiences = useCallback(async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("profile", profileId)
      .order("start_date", { ascending: false })
    if (error) {
      console.error("Error fetching experiences:", error)
    } else {
      setExperiences(data || [])
    }
  }, [profileId, supabase])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const handleSave = async (experience: Partial<Experience>) => {
    if (editingExperience) {
      const { error } = await supabase
        .from("experiences")
        .update(experience)
        .eq("id", editingExperience.id)
      if (error) {
        console.error("Error updating experience:", error)
      } else {
        fetchExperiences()
        setEditingExperience(null)
      }
    } else {
      const { error } = await supabase
        .from("experiences")
        .insert({ ...experience, profile: profileId })
      if (error) {
        console.error("Error adding experience:", error)
      } else {
        fetchExperiences()
        setIsAdding(false)
      }
    }
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id)
    if (error) {
      console.error("Error deleting experience:", error)
    } else {
      fetchExperiences()
    }
  }

  const DatePicker = ({
    date,
    onChange,
    name,
  }: {
    date: string | null
    onChange: (date: string | null) => void
    name: string
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          id={name}
          name={name}
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(newDate) =>
            onChange(newDate ? newDate.toISOString() : null)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )

  const ExperienceForm = ({
    experience,
    onSave,
    onCancel,
  }: {
    experience: Partial<Experience>
    onSave: (experience: Partial<Experience>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState(experience)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (name: string) => (date: string | null) => {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }

    return (
      <div className="space-y-2">
        <Input
          id="company"
          name="company"
          value={formData.company || ""}
          onChange={handleChange}
          placeholder="Company"
        />
        <Input
          id="role"
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          placeholder="Role"
        />
        <Input
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          placeholder="Location"
        />
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <DatePicker
            date={formData.start_date || null}
            onChange={handleDateChange("start_date")}
            name="start_date"
          />
        </div>
        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <DatePicker
            date={formData.end_date || null}
            onChange={handleDateChange("end_date")}
            name="end_date"
          />
        </div>
        <Button size="sm" onClick={onCancel} variant="outline">
          <Undo2 className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" /> Enregistrer
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="p-2 border rounded">
              {editingExperience?.id === experience.id ? (
                <ExperienceForm
                  experience={editingExperience}
                  onSave={handleSave}
                  onCancel={() => setEditingExperience(null)}
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
                      onClick={() => setEditingExperience(experience)}
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
              experience={{}}
              onSave={handleSave}
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
