const getValueByName = (name) => document.getElementsByName(name)[0].value

const searchPlayers = (name, amount = null) => {
  fetch(`/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      datas: getValueByName(name),
      amount: amount
    })
  })
}
