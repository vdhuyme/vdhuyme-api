import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm'
import { nanoid } from 'nanoid'
import { Category } from '@entities/category'
import { generateSlug } from '@utils/slugify'

@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface<Category> {
  listenTo() {
    return Category
  }

  beforeInsert(event: InsertEvent<Category>) {
    if (!event.entity.slug && event.entity.name) {
      const slugBase = generateSlug(event.entity.name)
      const randomId = nanoid(15)
      event.entity.slug = `${slugBase}-${randomId}`
    }
  }
}
