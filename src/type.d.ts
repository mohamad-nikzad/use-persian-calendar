import type { Moment } from 'moment-jalaali'
import { solarMonthsNames } from './constants'

export type FormatedDay = {
  date: Date
  dayInMonth: string
  isFromOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
}
export interface CalenderProps {
  selectedDate?: Date | null | number
  min?: Date
  max?: Date
}
type SolarMonthName = (typeof solarMonthsNames)[number]
export type MonthProps = SolarMonthName | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
