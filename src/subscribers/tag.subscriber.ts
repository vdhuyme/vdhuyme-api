import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm'
import { nanoid } from 'nanoid'
import { Tag } from '@entities/tag'
import { generateSlug } from '@utils/slugify'

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  listenTo() {
    return Tag
  }

  beforeInsert(event: InsertEvent<Tag>) {
    if (!event.entity.slug && event.entity.name) {
      const slugBase = generateSlug(event.entity.name)
      const randomId = nanoid(10)
      event.entity.slug = `${slugBase}-${randomId}`
    }
  }
}
