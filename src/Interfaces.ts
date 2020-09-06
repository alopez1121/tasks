export type StatusType = "TASK" | "PENDING" | "SHELVED" | "DONE" | "CANCELLED"
export const StatusTypeValues: Array<StatusType> = [
  "TASK", 
  "PENDING", 
  "SHELVED", 
  "DONE", 
  "CANCELLED"
]

export const NextStatusType = (statusType: StatusType): StatusType => {
  let nextIndex = StatusTypeValues.indexOf(statusType)
  if (StatusTypeValues.length > (1+nextIndex)) {
    nextIndex += 1
  } else {
    nextIndex = 0
  } 
  return StatusTypeValues[nextIndex]
}

export const PreviousStatusType = (statusType: StatusType): StatusType => {
  let previousIndex = StatusTypeValues.indexOf(statusType)
  if (previousIndex === 0) {
    previousIndex = StatusTypeValues.length - 1
  } else {
    previousIndex -= 1
  } 
  return StatusTypeValues[previousIndex]
}

export interface Task {
  id: number
  status: StatusType
  content: string
  created?: Date
  due?: Date
}
