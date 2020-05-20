import { ipCoords } from './unis.js'

const center = document.createElement('div')
center.className = 'marker center'

const map = {
  el: markers,
  markers: new Map(),
  draw () {
    this.el.innerHTML = ''
    for (const coords of this.markers.values()) {
      const el = document.createElement('div')
      el.className = 'marker'
      const pos = latLongToPx(coords)
      el.style.left = `${pos.x}px`
      el.style.top = `${pos.y}px`
      this.el.appendChild(el)
    }
  },
  triangulate (map) {
    const positions = [...map.keys()].map(latLongToPx)
    const masses = [...map.values()]
    const mHigh = masses.reduce((p, n) => Math.max(p, n), 0)
    const mr = masses.map(m => mHigh - m)
    const mSum = mr.reduce((p, n) => (p + n), 0)

    const x = positions.reduce((p, n, i) => (p + n.x*mr[i]), 0) / mSum
    const y = positions.reduce((p, n, i) => (p + n.y*mr[i]), 0) / mSum

    center.style.left = `${x}px`
    center.style.top = `${y}px`

    this.el.appendChild(center)
  },
  async getTimes () {
    const urls = [...this.markers.keys()]
    const times = await Promise.all(urls.map(ping))
    return new Map([...this.markers.values()].map((coords, i) => [coords, times[i]]))
  }
}

function latLongToPx (coords) {
  const [lat, long] = coords.split(',').map(Number)
  const {top, left, right, bottom, width, height} = path.getBoundingClientRect()
  const outer = container.getBoundingClientRect()

  const mw = width / 554
  const mh = height / 359

  const rleft = left - outer.left - (16 * mw)
  const rtop = top - outer.top + (76 * mh)

  let x, y

  x = (width * (180 + long) / 360) % width

  y = Math.log(Math.tan(( (lat * Math.PI / 180) / 2) + (Math.PI / 4)))
  y = (height / 2) - (width * y / (2 * Math.PI))

  return {
    x: x + rleft,
    y: y + rtop
  }
}

async function ping (url) {
  const start = performance.now()
  try {
    await fetch(`http://${url}`, { method: 'HEAD', mode: 'cors', redirect: 'manual' })
  } catch (_) {}
  const time = performance.now() - start
  return time
}

function resize () {
  container.style.width = `${window.innerWidth*.95}px`
  container.style.height = `${window.innerHeight*.95}px`
  map.draw()
}

resize()
window.onresize = resize

// calibration markers (island positions)
// map.markers.add('35.325,25.1306')
// map.markers.add('53.533778,-132.39624')
// map.markers.add('-42.065607,146.689453')
// map.markers.add('23.563987,120.585938')
// map.markers.add('-51.835778,-59.765625')
// map.markers.add('57.326521,-153.984375')

// universities with known locations

// // uoa.gr (athens)
// map.markers.set('37.98330,23.73330', 'www.uoa.gr')

// // helsinki.fi (helsinki)
// map.markers.set('60.17560,24.93420', 'helsinki.fi')

// // upc.edu (barcelona)
// map.markers.set('41.72500,1.82660', 'upc.edu')

// // home.iitd.ac.in (delhi)
// map.markers.set('28.66670,77.21670', 'iitd.ac.in')

// // www.jaist.ac.jp (nomi)
// map.markers.set('36.43830,136.48250', 'jaist.ac.jp')

// // uade.edu.ar (argentina)
// // map.markers.set('-34.60330,-58.38170', 'www.uade.edu.ar')

// // mgimo.ru (moscow)
// map.markers.set('55.74850,37.61840', 'mgimo.ru')

// // (sydney)
// map.markers.set('-33.86120,151.19820', 'sydney.edu.au')

// // (ethiopia)
// // map.markers.set('8.00000,38.00000', 'www.astu.edu.et')

// // (berlin)
// map.markers.set('52.51550,13.40620', 'www.beuth-hochschule.de')

// draw
// map.draw()
async function run () {
  const places = new Map([
    ["193.60.250.24","51.50920,-0.09550"],
    // ["160.75.25.31","41.02140,28.96840"],
    // ["130.60.184.132","47.36670,8.55000"],
    ["130.235.52.5","55.70000,13.18330"],
    // ["150.244.214.237","40.41670,-3.68380"],
    // ["158.109.120.133","41.50260,2.08750"],
    // ["193.137.55.13","41.14960,-8.61100"],
    // ["193.0.115.152","52.25000,21.00000"],
    ["129.240.118.130","59.90500,10.74870"],
    // ["145.18.12.36","52.35000,4.91670"],
    ["130.186.7.246","44.49380,11.33870"],
    // ["150.217.6.71","43.76670,11.25000"],
    // ["54.194.208.204","53.33890,-6.25950"],
    // ["160.114.8.5","46.25000,20.16670"],
    // ["147.102.224.101","37.98330,23.73330"],
    // ["147.52.80.32","35.32500,25.13060"],
    // ["129.187.255.151","48.15000,11.58330"],
    // ["134.100.36.5","53.55530,9.99500"],
    // ["129.69.8.19","48.76670,9.18330"],
    // ["134.99.128.238","51.21670,6.76670"],
    // ["129.199.166.212","48.86280,2.32920"],
    // ["139.124.244.38","43.31030,6.01300"],
    // ["159.84.183.116","45.74850,4.84670"],
    // ["130.226.237.173","55.97070,12.02250"],
    // ["147.32.3.202","50.50960,13.63910"],
    // ["164.15.59.215","50.83330,4.33330"],
    ["131.130.70.8","48.20000,16.36670"],
    // ["178.250.249.10","24.19170,55.76060"],
    // ["54.84.26.108","39.04810,-77.47280"],
    // ["23.185.0.1","37.75100,-97.82200"],
    // ["23.77.209.53","52.35000,4.91670"],
    // ["99.86.243.129","37.75100,-97.82200"],
    // ["132.239.180.101","32.88070,-117.23590"],
    // ["128.227.9.98","29.65160,-82.32480"],
    // ["104.22.2.59","37.76970,-122.39330"],
    ["129.79.123.148","39.16530,-86.52640"],
    // ["99.86.243.4","37.75100,-97.82200"],
    // ["142.104.197.120","48.42670,-123.36550"],
    // ["192.77.51.34","46.81400,-71.21940"],
    // ["110.234.9.144","20.00000,77.00000"],
    // ["164.125.8.119","35.10280,129.04030"],
    // ["155.69.7.173","1.36670,103.80000"],
    // ["156.62.238.90","-36.86670,174.76670"],
    // ["139.80.135.136","-45.87140,170.51190"],
    // ["103.18.3.61","3.16670,101.70000"],
    // ["161.139.21.66","2.50000,112.50000"],
    ["210.152.243.234","35.69000,139.69000"],
    // ["133.3.250.141","35.69000,139.69000"],
    // ["175.184.38.117","35.82640,139.70440"],
    ["167.205.59.96","-6.90390,107.61860"],
    // ["143.89.14.1","22.29100,114.15000"],
    ["162.105.131.160","39.92890,116.38830"],
    ["210.42.121.85","30.58010,114.27340"],
    ["202.120.127.230","31.04560,121.39970"],
    // ["185.64.253.1","51.49640,-0.12240"],
    ["129.78.5.8","-33.86120,151.19820"],
    // ["130.220.1.27","-34.92870,138.59860"],
    ["81.31.186.20","30.66930,50.20550"],
    // ["103.21.127.114","18.97500,72.82580"],
    // ["103.27.9.24","28.66670,77.21670"],
    ['mgimo.ru', '55.74850,37.61840'],
    // ['www.uade.edu.ar', '-34.60330,-58.38170']
  ])
  // while (places.size < 5) {
  //   const i = Math.random() * ipCoords.length | 0
  //   places.set(ipCoords[i][1], ipCoords[i][0])
  // }
  map.markers = places
  map.draw()

  await map.getTimes().then(result => map.triangulate(result))
  // await map.getTimes().then(result => map.triangulate(result))
  // await map.getTimes().then(result => map.triangulate(result))
  // await map.getTimes().then(result => map.triangulate(result))
}

document.body.onclick = run

run()
