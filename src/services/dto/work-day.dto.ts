import type { WorkHourDTO } from './work-hour.dto'

export type WorkDayDTO = {
  id: string
  date: string
  workHours: WorkHourDTO[]
}
