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
import {
  fetchExperiences,
  saveExperience,
  deleteExperience,
} from "../actions/experience-manager"

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

const experienceSchema = z.object({
  company: z.string().min(1, { message: "Company is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().nullable(),
})

type ExperienceFormValues = z.infer<typeof experienceSchema>

const ExperienceManager: React.FC<{ profileId: number }> = ({ profileId }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(
    null,
  )
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      start_date: "",
      end_date: null,
    },
  })

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

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      await saveExperience(
        editingExperienceId ? { ...values, id: editingExperienceId } : values,
        profileId,
      )
      await loadExperiences()
      setEditingExperienceId(null)
      setIsAdding(false)
      form.reset()
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

  const DatePicker = React.forwardRef<
    HTMLDivElement,
    {
      value?: string
      onChange: (date: string | undefined) => void
    }
  >(({ value, onChange }, ref) => (
    <div ref={ref}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(newDate) =>
              onChange(newDate ? newDate.toISOString() : undefined)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  ))
  DatePicker.displayName = "DatePicker"

  const ExperienceForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" /> Enregistrer
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingExperienceId(null)
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
                <ExperienceForm />
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
                      onClick={() => {
                        setEditingExperienceId(experience.id)
                        form.reset({
                          company: experience.company,
                          role: experience.role,
                          location: experience.location,
                          start_date: experience.start_date,
                          end_date: experience.end_date,
                        })
                      }}
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
            <ExperienceForm />
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
