const url = require('url')
const dns = require('dns').promises
const read = require('fs').promises.readFile
const write = require('fs').promises.writeFile
const https = require('https')

async function main () {
  const unis = await read('./unis.txt', 'utf8')
  const hostnames = unis.split('\n').filter(Boolean).map(u => url.parse(u).hostname)

  console.log('collecting ips...')
  const ips = (await Promise.all(hostnames.map(hostname => dns.resolve4(hostname)))).map(ip => ip[0])

  const map = new Map()

  console.log('collecting coords...')
  for (const ip of ips) {
    const csv = await get(`https://ipvigilante.com/csv/${ip}`)
    const coords = csv.split(',').slice(-2).join(',')
    map.set(ip, coords)
  }

  console.log('writing out to "unis.js"...')
  await write('unis.js', `export const ipCoords = ${JSON.stringify([...map.entries()])}`)
  console.log('finished')
}

function get (url) {
  return new Promise(resolve => {
    https.get(url, res => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
  })
}

main()
