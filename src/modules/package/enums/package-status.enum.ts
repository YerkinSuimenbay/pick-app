export enum PackageStatus {
  new = 'new', // upon creation
  // booked = 'booked', // on mutual consent
  pickup = 'pickup', // on mutual consent
  intransit = 'intransit',
  delivered = 'delivered',
  canceled = 'canceled', // cenceled by user
  archived = 'archived', // out of date
}
