"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Save, Undo2 } from "lucide-react"
import { DatePicker } from "./date-picker"
import { Database } from "@/types/database.types"
import * as z from "zod"

export const experienceSchema = z.object({
  company: z.string().min(1, { message: "Company is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().nullable(),
})

type ExperienceFormValues = z.infer<typeof experienceSchema>

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

type ExperienceFormProps = {
  onSubmit: (values: ExperienceFormValues) => void
  onCancel: () => void
  initialData?: Experience
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      company: "",
      role: "",
      location: "",
      start_date: "",
      end_date: null,
    },
  })

  return (
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
          <Button type="button" variant="outline" onClick={onCancel}>
            <Undo2 className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
