const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config()

const getId = (arg) => fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_TOKEN}&vanityurl=${arg}`)
  .then(res => {
    if (res.status == 200) return res.json()
    else throw 'An error has occured'
  })
  .then(data => {
    if (data.response.success == 1) return data.response.steamid
    else return arg
  })

const getDatas = (steamId) => fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_TOKEN}&steamids=${steamId}`)
  .then(res => {
    if (res.status == 200) return res.json()
    else throw 'An error has occured'
  })
  .then(data => {
    if (data.response.players) return data.response.players[0]
    else throw 'Invalid steamid'
  })

module.exports = {
  getId,
  getDatas
}