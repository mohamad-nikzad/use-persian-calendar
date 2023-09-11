import { addMonths, format, parse } from 'date-fns-jalali'
import { FormatedDay } from 'src/type'
import { describe, expect, it } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import { usePersianCalendar } from '../use-persian-calendar'

const getSelectedDay = (days: FormatedDay[], formatStr: string = 'yyyy-MM-dd') => {
  const selectedDayArr = days.filter((day) => day.isSelected)
  return selectedDayArr[0] ? format(selectedDayArr[0].date, formatStr) : null
}

describe('usePersianCalendar', () => {
  const matchDayFormat = 'yyyy-M-d'

  it('should select selected date', () => {
    const selectedDate = parse('2023-12-19', 'yyyy-MM-dd', new Date())
    const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
    const selectedDay = getSelectedDay(result.current.days, matchDayFormat)
    expect(format(selectedDate, matchDayFormat)).toBe(selectedDay)
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
    let selectedDate = new Date()
    const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
    selectedDate = addMonths(selectedDate, 1)
    // expect(result.current.activeMonthName).toBe('مهر')
  })

  describe('onPreivewMonth', () => {
    it('sets the calendar month before calendar selected month', () => {
      const selectedDate = parse('1402-12-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.prevMonthHandler())
      expect(result.current.activeMonthName).toBe('بهمن')
    })

    it('sets the calendar year before calendar active year', () => {
      const selectedDate = parse('1402-1-5', 'yyyy-M-d', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.prevMonthHandler())
      expect(result.current.activeYear).toBe('1401')
    })
  })

  describe('onNextMonth', () => {
    it('sets the calendar month after calendar selected month', () => {
      const selectedDate = parse('1402-10-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.nextMonthHandler())
      expect(result.current.activeMonthName).toBe('بهمن')
    })

    it('sets the calendar year after calendar active year', () => {
      const selectedDate = parse('1402-12-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.nextMonthHandler())
      expect(result.current.activeYear).toBe('1403')
    })
  })

  describe('goToYear', () => {
    it('set active calendar year to selected year', () => {
      const selectedDate = parse('1402-10-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToYearHandler(1377))
      expect(result.current.activeYear).toBe('1377')
    })

    it('should not set active calendar year to invalid year', () => {
      const selectedDate = parse('1402-10-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      const invalidYear = 9999999
      act(() => result.current.goToYearHandler(invalidYear))
      expect(result.current.activeYear).toBe('1402')
    })

    it('should keep the month name', () => {
      const selectedDate = parse('1402-10-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToYearHandler(1377))
      expect(result.current.activeMonthName).toBe('دی')
    })
  })
  describe('goToMonth', () => {
    it('set active calendar month to selected month string', () => {
      const selectedDate = parse('1402-10-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToMonthHandler('بهمن'))
      expect(result.current.activeMonthName).toBe('بهمن')
    })
    it('set active calendar month to selected month number', () => {
      const selectedDate = parse('1402-6-5', 'yyyy-MM-dd', new Date())
      const { result } = renderHook(() => usePersianCalendar({ selectedDate }))
      act(() => result.current.goToMonthHandler(11))
      expect(result.current.activeMonthName).toBe('بهمن')
    })
  })
})
