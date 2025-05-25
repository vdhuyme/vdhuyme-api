import { Category } from '@entities/category'
import { Seeder } from '@jorgebodega/typeorm-seeding'
import { DataSource } from 'typeorm'

export default class CategorySeeder extends Seeder {
  async run(dataSource: DataSource) {
    const categoryRepository = dataSource.getRepository(Category)

    const categories = [
      {
        name: 'Frontend',
        description: 'Everything about UI development and frameworks',
        icon: '🖥️',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Backend',
        description: 'Server-side logic, APIs and databases',
        icon: '🗄️',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'DevOps',
        description: 'Deployment, CI/CD and infrastructure',
        icon: '⚙️',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Mobile Development',
        description: 'Building apps for iOS and Android',
        icon: '📱',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'UI/UX Design',
        description: 'User interface and experience design principles',
        icon: '🎨',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Testing',
        description: 'Unit testing, integration testing and tools',
        icon: '🧪',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Machine Learning',
        description: 'ML models, datasets and training techniques',
        icon: '🤖',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Security',
        description: 'Web security, authentication and best practices',
        icon: '🔐',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Cloud Computing',
        description: 'AWS, Azure, Google Cloud and services',
        icon: '☁️',
        thumbnail: '',
        parentId: null
      },
      {
        name: 'Game Development',
        description: 'Creating games with Unity, Unreal, or WebGL',
        icon: '🎮',
        thumbnail: '',
        parentId: null
      }
    ]

    await categoryRepository.insert(categories)
  }
}
