export class CourierInputDto {
  fromId: number
  toId: number
  date: Date
  flight?: string
  fee?: number
  comment?: string
  maximumWeight?: number
}
