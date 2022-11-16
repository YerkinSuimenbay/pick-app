export class SendsFilterDto {
  from: string
  to: string
  da: Date
  deliveryDate: Date
  fee: number
  comment?: string
  packageContents: string
  packageWeight: number
  packageImageId: number
}
