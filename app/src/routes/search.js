const { Router } = require('express')
const router = Router()
const { findSteamUIds } = require('../utilities/regexp/regexp')
const Stats = require('../utilities/stats/player')

router.post('/', async (req, res, next) => {
  const max = 10
  const datas = req.body.search
  const users = []

  if (!datas.length) res.render('index', { error: 'You need to request at least 1 account.' })

  users.push(...findSteamUIds(datas))

  if (!(users.length > 0))
    datas
      .trim()
      .split(/,+/)
      .forEach(e => users.push(e.split('/').filter(e => e).pop()))

  Promise.all(Stats.getUsersDatas(users.slice(0, max)))
    .then(userDatas => res.render(
      'search', {
      'title': 'FaceitFinder - SEARCH',
      'datas': userDatas
    }))
})

module.exports = router