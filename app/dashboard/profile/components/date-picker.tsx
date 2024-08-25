import React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomCalendar } from "./custom-calendar"

interface DatePickerProps {
  value?: string
  onChange: (date: string | undefined) => void
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange }, ref) => (
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
          <CustomCalendar
            value={value ? new Date(value) : undefined}
            onChange={(newDate) =>
              onChange(newDate ? newDate.toISOString() : undefined)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  ),
)

DatePicker.displayName = "DatePicker"
