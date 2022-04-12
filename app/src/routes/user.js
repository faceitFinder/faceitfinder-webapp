const { Router } = require('express')
const router = Router()
const Match = require('../utilities/faceit/match')
const Stats = require('../utilities/stats/player')
const Dates = require('../utilities/dates/dates')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  message: "Too many requests, please try again later"
})

require('dotenv').config()

router.get('/history/:id/:max/((month|day|week|overall)){1}$', limiter, async (req, res, next) => {
  const maxMatches = parseInt(req.params.max) || 250
  const faceitId = req.params.id
  const getDay = req.params[0] === 'day' ? Dates.getDayDate :
    req.params[0] === 'week' ? Dates.getWeekDate :
      req.params[0] === 'month' ? Dates.getMonthDate :
        Dates.getOverallDate

  const dates = await Dates.getDates(faceitId, maxMatches, getDay)

  res.json({
    faceitId: faceitId,
    maxMatches: maxMatches,
    sortBy: req.params[0],
    dates: [...dates.values()]
  })
})

router.get('/history/:id/:max/:from-:to', limiter, async (req, res, next) => {
  const maxMatches = parseInt(req.params.max) || 250
  const from = parseInt(req.params.from) || 0
  const to = parseInt(req.params.to) || new Date().getTime()

  const MatchesHistory = await Match.getMatchElo(req.params.id, maxMatches)
  const MatchesHistoryFiltered = MatchesHistory.filter(e => e.date >= from && e.date < to)
  const history = Stats.generatePlayerStats(MatchesHistoryFiltered)

  res.json({
    faceitId: req.params.id,
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
    averageStats: history,
    Matches: MatchesHistoryFiltered
  })
})

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