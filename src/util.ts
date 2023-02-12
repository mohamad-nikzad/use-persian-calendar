import moment, { Moment } from 'moment-jalaali'
import { gregorianMonthsNames, solarDayOfWeekName, solarMonthsNames } from './constants'

export function getDaysOfMonth(month: Moment, isSolar = true) {
  const days = []

  const monthFormat: any = isSolar ? 'jMonth' : 'month'
  const dayOffset = isSolar ? 1 : 0

  const current = month.clone().startOf(monthFormat)
  const end = month.clone().endOf(monthFormat)

  // Set start to the first day of week in the last month
  current.subtract((current.day() + dayOffset) % 7, 'days')

  // Set end to the last day of week in the next month
  end.add(6 - ((end.day() + dayOffset) % 7), 'days')

  while (current.isBefore(end)) {
    days.push(current.clone())
    current.add(1, 'days')
  }

  return days
}

export const getDaysOfWeek = (isSolar = true) => {
  return solarDayOfWeekName
}

type formatedDaysType = Moment & {
  isFromOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  value: string
}

export const isToday = (date: Moment) => {
  const format = 'jYYYYjMMjDD'
  return moment().format(format) === date.format(format)
}

export const isInCurrentMonth = (date: Moment, currentDate?: Moment) => {
  const format = 'jYYYYjMM'
  const d = currentDate ? currentDate : moment()
  return d.format(format) === date.format(format)
}

export const getMonthName = (locale: string | string[], date: Moment | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
  }

  const dateObject = date instanceof Date ? date : date.clone().toDate()
  return new Intl.DateTimeFormat(locale, options).format(dateObject)
}

export const getAllmonthNames = (isSolar = true) => {
  if (isSolar) return solarMonthsNames
  else return gregorianMonthsNames
}

export const isInMinMaxDateRange = ({
  date,
  min,
  max,
}: {
  date: Date | Moment
  min?: Date | Moment
  max?: Date | Moment
}) => {
  return (min && moment(date).isBefore(min)) || (max && moment(date).isAfter(max))
}
