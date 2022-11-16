export type TSizeFormat = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IImageSize {
  name: TSizeFormat
}

export interface IImageSizeFormat {
  name: TSizeFormat
  max: number
}
