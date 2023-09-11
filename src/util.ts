import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  isValid,
  startOfMonth,
  startOfWeek,
} from 'date-fns-jalali'

export function getDaysOfMonth(month: Date) {
  const days: Date[] = []

  const current = startOfWeek(startOfMonth(month))
  const end = endOfWeek(endOfMonth(month))

  eachDayOfInterval({ start: current, end: end }).forEach((day) => {
    days.push(day)
  })

  return days
}

export const isInMinMaxDateRange = ({ date, min, max }: { date: Date; min?: Date; max?: Date }) => {
  return (min && isBefore(date, min)) || (max && isAfter(date, max)) || false
}

export function getWeekDays() {
  const now = new Date()
  const weekDays: string[] = []
  const start = startOfWeek(now)
  const end = endOfWeek(now)

  eachDayOfInterval({ start, end }).forEach((day) => {
    weekDays.push(format(day, 'EE'))
  })

  return weekDays
}

export const shouldSetDefaultActiveCalendar = ({
  activeDate,
  min,
  max,
}: {
  activeDate?: Date | null
  min?: Date
  max?: Date
}) => !!activeDate && isValid(activeDate) && !isInMinMaxDateRange({ date: activeDate, min, max })

export const shouldUpdateActiveCalender = ({
  activeCalendar,
  activeDate,
  min,
  max,
}: {
  activeCalendar: Date
  activeDate?: Date | null
  min?: Date
  max?: Date
}) =>
  !!activeDate &&
  format(activeDate, 'yyyy-MM-dd') !== format(activeCalendar, 'yyyy-MM-dd') &&
  !isSameMonth(activeDate, activeCalendar) &&
  !isInMinMaxDateRange({ date: activeDate, min, max }) &&
  isValid(activeDate)
