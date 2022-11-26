export class CourierInputDto {
  fromId: number
  toId: number
  startDate: Date
  endDate: Date
  flight?: string
  fee?: number
  comment?: string
  maximumWeight?: number
}
