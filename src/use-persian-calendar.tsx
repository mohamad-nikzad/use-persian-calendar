import { useCallback, useMemo, useState } from 'react'
import moment from 'moment-jalaali'
import type { Moment } from 'moment-jalaali'
import useUpdateEffect from './hook/use-update-effect'
import {
  getAllmonthNames,
  getDaysOfMonth,
  getDaysOfWeek,
  getMonthName,
  isInCurrentMonth,
  isInMinMaxDateRange,
  isToday,
  shouldSetDefaultActiveCalendar,
  shouldUpdateActiveCalender,
} from './util'
import { CalenderProps, formatedDaysType } from './type'

const usePersianCalendar = (props?: CalenderProps) => {
  const { selectedDate, min, max } = props || {
    selectedDate: undefined,
    min: undefined,
    max: undefined,
  }
  const activeDate: Moment | null = useMemo(
    () =>
      shouldSetDefaultActiveCalendar({ activeDate: selectedDate, min, max })
        ? moment(selectedDate)
        : null,
    [selectedDate],
  )

  const [activeCalendar, setActiveCalendar] = useState(activeDate ? activeDate : moment())
  const today = useMemo(() => moment(), [])

  const daysOfactiveCalendar = useMemo(() => getDaysOfMonth(activeCalendar), [activeCalendar])
  const activeMonthName = useMemo(() => getMonthName('fa', activeCalendar), [activeCalendar])
  const activeYear = useMemo(() => activeCalendar.jYear(), [activeCalendar])

  const monthNames = useMemo(
    () =>
      getAllmonthNames().map((name) => {
        const isActve = name === activeMonthName
        return { name, isActve }
      }),
    [activeMonthName],
  )
  const daysOfWeek = useMemo(() => getDaysOfWeek(), [])
  const days: formatedDaysType[] = useMemo(
    () =>
      daysOfactiveCalendar.map((day) => {
        const value = day.format('jDD')
        const isFromOtherMonth = day.format('jMM') !== activeCalendar.format('jMM')
        const _isToday = isToday(day)
        const isSelected = activeDate
          ? day.format('jYYYYjMMjDD') === activeDate.format('jYYYYjMMjDD')
          : false
        const disabled = isInMinMaxDateRange({ date: day, min, max })
        Object.assign(day, { isFromOtherMonth, isToday: _isToday, isSelected, disabled, value })
        return day as formatedDaysType
      }),
    [daysOfactiveCalendar, activeDate],
  )

  const nextMonthHandler = useCallback(() => {
    setActiveCalendar((prevState) => prevState.clone().add(1, 'jMonth'))
  }, [])

  const goToYearHandler = useCallback((year: string | number) => {
    setActiveCalendar((prevState) => {
      const utcYear = moment(`${prevState.jMonth() + 1}-${year}`, 'jM-jYYYY').format('YYYY')
      const newDate = prevState.clone().set({ year: Number(utcYear) })
      return newDate.isValid() ? newDate : prevState
    })
  }, [])

  const goToMonthHandler = useCallback((month: number | string) => {
    const m = typeof month === 'string' ? getAllmonthNames().indexOf(month) : month
    setActiveCalendar((prevState) => {
      const newDate = moment(`${prevState.jYear()},${m + 1},${prevState.jDate()}`, 'jYYYY/jM/jDD')
      return newDate.isValid() ? newDate : prevState
    })
  }, [])

  const prevMonthHandler = useCallback(() => {
    setActiveCalendar((prevState) => prevState.clone().subtract(1, 'jMonth'))
  }, [])

  const goToToday = useCallback(() => {
    !isInCurrentMonth(activeCalendar) && setActiveCalendar(today)
  }, [activeCalendar])

  useUpdateEffect(() => {
    shouldUpdateActiveCalender({ activeCalendar, activeDate, min, max }) &&
      setActiveCalendar(activeDate!)
  }, [activeDate])

  return {
    days,
    monthNames,
    daysOfWeek,
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
