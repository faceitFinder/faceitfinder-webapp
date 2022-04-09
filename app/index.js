const express = require('express')
const createError = require('http-errors')
const path = require('path')
const app = express()
const port = 8080

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'src/public')))

// Setup routes
app.use('/', require(path.join(__dirname, 'src/routes/index.js')))
app.use('/search', require(path.join(__dirname, 'src/routes/search.js')))
app.use('/user', require(path.join(__dirname, 'src/routes/user.js')))

app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('ENV') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error', {
    title: 'FaceitFinder - ERROR',
  })
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})