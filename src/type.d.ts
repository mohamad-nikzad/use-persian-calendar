import type { Moment } from 'moment-jalaali'

export interface CalenderProps {
  selectedDate?: Moment | Date | null
  isSolar?: boolean
  min?: Moment | Date
  max?: Moment | Date
}

export type formatedDaysType = Moment & {
  isFromOtherMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  value: string
}
