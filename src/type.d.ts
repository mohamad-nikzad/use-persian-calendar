import type { Moment } from 'moment-jalaali'

export type CalenderDateType = Moment | Date

export interface CalenderProps {
  selectedDate?: CalenderDateType | null
  isSolar?: boolean
  min?: CalenderDateType
  max?: CalenderDateType
}

export type formatedDaysType = Moment & {
  isFromOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  value: string
}
