const { Router } = require('express')
const router = Router()
const Stats = require('../utilities/stats/player')
const Player = require('../utilities/faceit/player')

require('dotenv').config()

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  let userDefaultStats
  await Promise.all(Stats.getUsersDatas([id]))
    .then(data => userDefaultStats = data[0])

  res.render('user', {
    title: `FaceitFinder - USER ${userDefaultStats?.playerDatas?.nickname}`,
    user: userDefaultStats
  })
})

module.exports = router