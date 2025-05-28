const TYPES = {
  DataSource: Symbol.for('DataSource'),

  CategoryRepository: Symbol.for('CategoryRepository'),
  TagRepository: Symbol.for('TagRepository'),
  UserRepository: Symbol.for('UserRepository'),

  TagService: Symbol.for('TagService'),
  AuthService: Symbol.for('AuthService'),
  ImagekitService: Symbol.for('ImagekitService'),
  StatsService: Symbol.for('StatsService'),
  CategoryService: Symbol.for('CategoryService')
}

export { TYPES }
