import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment-jalaali'
import useUpdateEffect from './hook/use-update-effect'
import {
  getAllmonthNames,
  getDaysOfMonth,
  getDaysOfWeek,
  getMonthName,
  isInCurrentMonth,
  isInMinMaxDateRange,
  isToday,
} from './util'
import { CalenderProps, formatedDaysType } from './type'

const usePersianCalendar = ({ selectedDate, min, max, isSolar = true }: CalenderProps) => {
  const [activeCalendar, setActiveCalendar] = useState(moment())
  const today = useMemo(() => moment(), [])
  // @ts-ignore
  const activeDate: Moment = useMemo(
    () =>
      selectedDate ? (selectedDate instanceof moment ? selectedDate : moment(selectedDate)) : null,
    [selectedDate],
  )
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
  // @ts-ignore
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
        return day
      }),
    [daysOfactiveCalendar, activeDate],
  )

  const nextMonthHandler = useCallback(() => {
    setActiveCalendar((prevState) => prevState.clone().add(1, 'jMonth'))
  }, [])

  const goToYearHandler = useCallback((year: string | number) => {
    setActiveCalendar((prevState) => {
      const newDate = moment(
        `${year},${prevState.jMonth() + 1},${prevState.jDate()}`,
        'jYYYY/jM/jDD',
      )
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
    activeDate
      ? !isInCurrentMonth(activeDate) && setActiveCalendar(today)
      : !isInCurrentMonth(activeCalendar) && setActiveCalendar(today)
  }, [activeCalendar, activeDate])

  useUpdateEffect(() => {
    activeDate &&
      !isInCurrentMonth(activeDate, activeCalendar) &&
      !isInMinMaxDateRange({ date: activeDate, min, max }) &&
      activeDate.isValid() &&
      setActiveCalendar(activeDate)
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
