export class CourierInputDto {
  from: string
  to: string
  sendDate: Date
  deliveryDate: Date
  fee: number
  comment?: string
  packageContents: string
  packageWeight: number
  packageImageId: number
}
