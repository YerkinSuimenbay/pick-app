export class PackageInputDto {
  fromId: number
  toId: number
  sendDate: Date
  deliveryDate: Date
  fee: number
  comment?: string
  contents: string
  weight: number
  imageIds: number[]
}
