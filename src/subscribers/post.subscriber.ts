import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm'
import { Post } from '@entities/post'
import { nanoid } from 'nanoid'
import { generateSlug } from '@utils/slugify'

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  listenTo() {
    return Post
  }

  beforeInsert(event: InsertEvent<Post>) {
    if (!event.entity.slug && event.entity.title) {
      const slugBase = generateSlug(event.entity.title)
      const randomId = nanoid(10)
      event.entity.slug = `${slugBase}-${randomId}`
    }
  }
}
