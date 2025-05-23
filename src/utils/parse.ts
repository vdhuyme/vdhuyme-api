export const parseBoolean = (value?: string, defaultValue = false): boolean => {
  if (value === undefined) return defaultValue
  return ['true', '1', 'yes'].includes(value.toLowerCase())
}
