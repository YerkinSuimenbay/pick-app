export class CourierInputDto {
  from: string
  to: string
  date: Date
  flight?: string
  fee?: number
  comment?: string
  maximumWeight?: number
}
