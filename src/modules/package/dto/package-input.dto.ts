export class PackageInputDto {
  fromId: number
  toId: number
  startDate: Date
  endDate: Date
  fee: number
  comment?: string
  contents: string
  weight: number
  imageIds: number[]
}
