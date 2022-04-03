const { Router } = require('express')
const router = Router()
const { findSteamUIds } = require('../utilities/regexp/regexp')
const Steam = require('../utilities/steam/steam')
const Player = require('../utilities/faceit/player')
const Ladder = require('../utilities/faceit/ladder')
const Stats = require('../utilities/stats/player')
const Match = require('../utilities/faceit/match')

router.post('/', async (req, res, next) => {
  const max = 10
  const datas = req.body.search
  const users = []

  if (!datas.length) res.render('index', { error: 'You need to request at least 1 account.' })

  users.push(...findSteamUIds(datas))

  if (!(users.length > 0))
    datas
      .split(/ +/)
      .forEach(e => users.push(e.split('/').filter(e => e).pop()))

  Promise.all(getUsersDatas(users.slice(0, max)))
    .then(userDatas => res.render(
      'search', {
      'datas': userDatas
    }))
})

const getUsersDatas = users => {
  return users.map(async e => {
    try {
      const steamId = await Steam.getId(e)
      const faceitId = await Player.getId(steamId)
      const playerDatas = await Player.getDatas(faceitId)
      const playerHistory = await Match.getMatchElo(faceitId, 10)
      const playerStats = await Player.getStats(faceitId)
      const ladderRegion = await Ladder.getDatas(faceitId, playerDatas.games.csgo.region)
      const ladderCountry = await Ladder.getDatas(faceitId, playerDatas.games.csgo.region, playerDatas.country)

      const datas = {
        steamParam: e,
        steamId: steamId,
        playerDatas: playerDatas,
        playerStats: playerStats,
        lastStatsGame: Stats.generatePlayerStats(playerHistory),
        ladder: {
          region: ladderRegion,
          country: ladderCountry,
        }
      }
      return datas
    } catch (error) {
      console.log(error)
      return {
        steamParam: e,
        error: 'An error has occured'
      }
    }
  })
}


module.exports = router