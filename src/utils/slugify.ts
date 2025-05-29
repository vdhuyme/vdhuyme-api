import slugify from 'slugify'

export const generate = (text: string) => {
  const slug = slugify(text, {
    lower: true,
    strict: true,
    locale: 'vi',
    remove: undefined,
    trim: true
  })
  return slug
}
