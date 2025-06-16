import { container } from 'inversify-config'

export function getRepository<T>(token: symbol): T {
  return container.get<T>(token)
}
