import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomCalendarProps {
  value?: Date
  onChange: (date: Date | undefined) => void
}

export const CustomCalendar = React.forwardRef<
  HTMLDivElement,
  CustomCalendarProps
>(({ value, onChange }, ref) => {
  const [month, setMonth] = useState(value?.getMonth() || new Date().getMonth())
  const [year, setYear] = useState(
    value?.getFullYear() || new Date().getFullYear(),
  )

  useEffect(() => {
    if (value) {
      setMonth(value.getMonth())
      setYear(value.getFullYear())
    }
  }, [value])

  const updateDate = (newMonth: number, newYear: number) => {
    const newDate = new Date(newYear, newMonth, 1)
    onChange(newDate)
  }

  return (
    <div ref={ref} className="p-3">
      <div className="flex justify-between mb-2">
        <Select
          value={month.toString()}
          onValueChange={(newMonth) => {
            setMonth(parseInt(newMonth))
            updateDate(parseInt(newMonth), year)
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {format(new Date(2000, i, 1), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={year.toString()}
          onValueChange={(newYear) => {
            setYear(parseInt(newYear))
            updateDate(month, parseInt(newYear))
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 100 }, (_, i) => {
              const yearValue = new Date().getFullYear() - i
              return (
                <SelectItem key={i} value={yearValue.toString()}>
                  {yearValue}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <CalendarComponent
        mode="single"
        selected={value}
        onSelect={onChange}
        month={new Date(year, month)}
        onMonthChange={(newMonth) => {
          setMonth(newMonth.getMonth())
          setYear(newMonth.getFullYear())
        }}
      />
    </div>
  )
})

CustomCalendar.displayName = "CustomCalendar"
