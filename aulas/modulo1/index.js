const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

const logMiddleware = (req, res, next) => {
  if (!req.query.age) return res.redirect('/')
  return next()
}

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'njk')

app.get('/', (req, res) => {
  return res.render('new')
})

app.post('/check', (req, res) => {
  const age = req.body.age
  const rota = age >= 18 ? 'major' : 'minor'
  return res.redirect(`${rota}?age=${age}`)
})

app.get('/major', logMiddleware, (req, res) => {
  const age = req.query.age
  return res.render('major', { age })
})

app.get('/minor', logMiddleware, (req, res) => {
  const age = req.query.age
  return res.render('minor', { age })
})

app.listen(3000)
