export class PackageInputDto {
  from: string
  to: string
  sendDate: Date
  deliveryDate: Date
  fee: number
  comment?: string
  contents: string
  weight: number
  imageIds: number[]
}
