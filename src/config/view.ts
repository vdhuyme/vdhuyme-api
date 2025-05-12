import { Application } from 'express'

const view = (app: Application) => {
  app.set('view engine', 'ejs')
  app.set('views', './src/views')
}

export default view
