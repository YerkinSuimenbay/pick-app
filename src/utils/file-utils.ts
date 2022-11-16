import path from 'path'

export const getFileExtension = (filename) => {
  const ext = path.extname(filename || '').split('.')

  return ext[ext.length - 1]
}
