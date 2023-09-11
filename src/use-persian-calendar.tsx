import {
  addMonths,
  format,
  isSameMonth,
  isThisMonth,
  isToday,
  isValid,
  setMonth,
  setYear,
  subMonths,
} from 'date-fns-jalali'
import * as React from 'react'

import { solarDayOfWeekName, solarMonthsNames } from './constants'
import useUpdateEffect from './hook/use-update-effect'
import { CalenderProps, FormatedDay } from './type'
import {
  getDaysOfMonth,
  isInMinMaxDateRange,
  shouldSetDefaultActiveCalendar,
  shouldUpdateActiveCalender,
} from './util'

const usePersianCalendar = (props?: CalenderProps) => {
  const { selectedDate, min, max } = props ?? {}

  const activeDate = React.useMemo(
    () =>
      shouldSetDefaultActiveCalendar({ activeDate: selectedDate, min, max }) ? selectedDate : null,
    [selectedDate],
  )

  const [activeCalendar, setActiveCalendar] = React.useState(activeDate ? activeDate : new Date())
  const today = React.useMemo(() => new Date(), [])

  const daysOfactiveCalendar = React.useMemo(() => getDaysOfMonth(activeCalendar), [activeCalendar])
  const activeMonthName = React.useMemo(() => format(activeCalendar, 'MMMM'), [activeCalendar])
  const activeYear = React.useMemo(() => format(activeCalendar, 'yyyy'), [activeCalendar])

  const monthNames = React.useMemo(
    () =>
      solarMonthsNames.map((name) => {
        const isActive = name === activeMonthName
        return { name, isActive }
      }),
    [activeMonthName],
  )

  const days: FormatedDay[] = React.useMemo(
    () =>
      daysOfactiveCalendar.map((day) => {
        const dayInMonth = format(day, 'd')
        const isFromOtherMonth = !isSameMonth(day, activeCalendar)
        const _isToday = isToday(day)
        const isSelected = activeDate
          ? format(day, 'yyyy-MM-dd') === format(activeDate, 'yyyy-MM-dd')
          : false
        const disabled = isInMinMaxDateRange({ date: day, min, max })
        return { isFromOtherMonth, isToday: _isToday, isSelected, disabled, dayInMonth, date: day }
      }),
    [daysOfactiveCalendar, activeDate],
  )

  const nextMonthHandler = React.useCallback(() => {
    setActiveCalendar((prevState) => addMonths(prevState, 1))
  }, [])

  const goToYearHandler = React.useCallback((year: string | number) => {
    setActiveCalendar((prevState) => {
      const date = setYear(prevState, Number(year))
      return isValid(date) ? date : prevState
    })
  }, [])

  const goToMonthHandler = React.useCallback((month: string | number) => {
    setActiveCalendar((prevState) => {
      const monthNumber =
        typeof month === 'string' ? solarMonthsNames.indexOf(month) : Number(month) - 1
      const date = setMonth(prevState, monthNumber)
      return isValid(date) ? date : prevState
    })
  }, [])

  const prevMonthHandler = React.useCallback(() => {
    setActiveCalendar((prevState) => subMonths(prevState, 1))
  }, [])

  const goToToday = React.useCallback(() => {
    !isThisMonth(activeCalendar) && setActiveCalendar(today)
  }, [activeCalendar])

  useUpdateEffect(() => {
    if (shouldUpdateActiveCalender({ activeCalendar, activeDate, min, max })) {
      setActiveCalendar(activeDate!)
    }
  }, [activeDate])

  return {
    days,
    monthNames,
    daysOfWeek: solarDayOfWeekName,
    activeMonthName,
    activeYear,
    today,
    nextMonthHandler,
    prevMonthHandler,
    goToYearHandler,
    goToMonthHandler,
    goToToday,
  }
}

export { usePersianCalendar }
