import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import moment from 'moment-jalaali'
import { usePersianCalendar } from '../use-persian-calendar'
import { formatedDaysType } from '../type'

const getSelectedDay = (days: formatedDaysType[], format?: string) => {
  const selectedDayArr = days.filter((day) => day.isSelected)
  return selectedDayArr[0] ? selectedDayArr[0].format(format) : null
}

describe('usePersianCalendar', () => {
  const matchDayFormay = 'YYYY-M-D'

  it('should select selected date', () => {
    const selectedDate = moment('2023-12-19')
    const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
    const selectedDay = getSelectedDay(result.current.days, matchDayFormay)
    expect(selectedDate.format(matchDayFormay)).toBe(selectedDay)
  })

  it('should not select invalid date', () => {
    const invalidDate = new Date('2022,22,89')
    const { result } = renderHook(() => usePersianCalendar({ selectedDate: invalidDate }))
    const selectedDay = getSelectedDay(result.current.days)
    expect(selectedDay).toBe(null)
  })

  it('should not select date if in min max range', () => {
    const selectedDate = new Date('2023,8,10')
    const minDate = new Date('2023,9,1')
    const maxDate = new Date('2023,9,30')
    const { result } = renderHook(() =>
      usePersianCalendar({ selectedDate, min: minDate, max: maxDate }),
    )
    expect(getSelectedDay(result.current.days)).toBe(null)
  })

  it('set active calendar month base of selected date', () => {
    let selectedDate = moment('1402-10-5', 'jYYYY-jMM-jD')
    const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
    selectedDate = moment('1402-9-5', 'jYYYY-jMM-jD')
  })

  describe('onPreivewMonth', () => {
    it('sets the calendar month before calendar selected month', () => {
      const selectedDate = moment('1402-12-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.prevMonthHandler())
      expect(result.current.activeMonthName).toBe('بهمن')
    })

    it('sets the calendar year before calendar active year', () => {
      const selectedDate = moment('1402-1-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.prevMonthHandler())
      expect(result.current.activeYear).toBe(1401)
    })
  })

  describe('onNextMonth', () => {
    it('sets the calendar month after calendar selected month', () => {
      const selectedDate = moment('1402-10-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.nextMonthHandler())
      expect(result.current.activeMonthName).toBe('بهمن')
    })

    it('sets the calendar year after calendar active year', () => {
      const selectedDate = moment('1402-12-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.nextMonthHandler())
      expect(result.current.activeYear).toBe(1403)
    })
  })

  describe('goToYear', () => {
    it('set active calendar year to selected year', () => {
      const selectedDate = moment('1402-10-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToYearHandler(1377))
      expect(result.current.activeYear).toBe(1377)
    })

    it('should not set active calendar year to invalid year', () => {
      const selectedDate = moment('1402-10-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      const invalidYear = 9999999
      act(() => result.current.goToYearHandler(invalidYear))
      expect(result.current.activeYear).toBe(1402)
    })

    it('should keep the month name', () => {
      const selectedDate = moment('1402-11-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToYearHandler(1377))
      expect(result.current.activeYear).toBe(1377)
      expect(result.current.activeMonthName).toBe('بهمن')
    })
  })

  describe('goToMonth', () => {
    it('set active calendar month to selected month name', () => {
      const selectedDate = moment('1402-5-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToMonthHandler('بهمن'))
      expect(result.current.activeMonthName).toBe('بهمن')
    })

    it('should not set the active calendar month to invalid month name', () => {
      const selectedDate = moment('1402-11-5', 'jYYYY-jMM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToMonthHandler('invalid month'))
      expect(result.current.activeMonthName).toBe('بهمن')
    })
  })

  describe('goToToday', () => {
    it('today should be in active calendar days', () => {
      const selectedDate = moment('1405-5-5', 'jYYYY-jM-jD')
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToToday())
      const today = result.current.days.filter((day) => day.isToday)[0]
      expect(result.current.today.format(matchDayFormay)).toBe(today.format(matchDayFormay))
    })
  })
})
