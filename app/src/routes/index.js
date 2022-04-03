const { Router } = require('express')
const { Api } = require('@top-gg/sdk')
const router = Router()

require('dotenv').config()

router.get('/', async (req, res, next) => {
  try {
    const api = new Api(process.env.TOPGG_TOKEN)
    stats = await api.getBot('838088031222235197')
  } catch (error) {
    stats = {
      server_count: '..',
      monthlyPoints: '..',
      points: '..'
    }
  }
  
  res.render('index', {
    title: 'FaceitFinder - HOME',
    stats: stats
  })
})

module.exports = router