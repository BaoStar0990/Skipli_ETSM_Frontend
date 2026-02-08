import type { UserDTO } from './user.dto'
import type { WorkDayDTO } from './work-day.dto'

export type WorkScheduleDTO = {
  id?: string
  effectiveFrom: string
  effectiveTo: string
  workDays: WorkDayDTO[]
  employee?: UserDTO
}
