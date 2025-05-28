const TYPES = {
  DataSource: Symbol.for('DataSource'),

  CategoryRepository: Symbol.for('CategoryRepository'),
  TagRepository: Symbol.for('TagRepository'),
  UserRepository: Symbol.for('UserRepository'),
  PostRepository: Symbol.for('PostRepository'),

  TagService: Symbol.for('TagService'),
  AuthService: Symbol.for('AuthService'),
  ImagekitService: Symbol.for('ImagekitService'),
  StatsService: Symbol.for('StatsService'),
  CategoryService: Symbol.for('CategoryService'),
  PostService: Symbol.for('PostService')
}

export { TYPES }
