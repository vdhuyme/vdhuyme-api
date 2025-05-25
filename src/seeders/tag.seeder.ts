import { Tag } from '@entities/tag'
import { Seeder } from '@jorgebodega/typeorm-seeding'
import { DataSource } from 'typeorm'

export default class TagSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const tagRepository = dataSource.getRepository(Tag)

    const tags = [
      { name: 'React' },
      { name: 'Vue' },
      { name: 'Angular' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'Tailwind CSS' },
      { name: 'CSS' },
      { name: 'HTML' },
      { name: 'REST API' },
      { name: 'GraphQL' },
      { name: 'MongoDB' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'Git' },
      { name: 'CI/CD' },
      { name: 'JWT' }
    ]

    await tagRepository.insert(tags)
  }
}
