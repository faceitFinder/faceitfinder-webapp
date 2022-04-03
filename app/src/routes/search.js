const { Router } = require('express')
const router = Router()
const { findSteamUIds } = require('../utilities/regexp/regexp')
const Steam = require('../utilities/steam/steam')
const Player = require('../utilities/faceit/player')

router.post('/', async (req, res, next) => {
  const max = req.body.amount > 10 ? 10 : req.body.amount || 10
  const datas = req.body.datas
  const users = []

  users.push(...findSteamUIds(datas))

  if (!(users.length > 0))
    datas
      .split(/ +/)
      .forEach(e => users.push(e.split('/').filter(e => e).pop()))

  Promise.all(getUsersDatas(users.slice(0, max)))
    .then(userDatas => res.json(userDatas))
})

const getUsersDatas = users => {
  return users.map(async e => {
    try {
      const steamId = await Steam.getId(e)
      const faceitId = await Player.getId(steamId)
      const playerDatas = await Player.getDatas(faceitId)
      const playerHistory = await Player.getHistory(faceitId, 20)
      const datas = {
        steamParam: e,
        steamId: steamId,
        playerDatas: playerDatas,
        playerHistory: playerHistory
      }
      return datas
    } catch (error) {
      return {
        steamParam: e,
        error: error
      }
    }
  })
}


module.exports = router