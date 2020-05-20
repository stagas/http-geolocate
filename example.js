const center = document.createElement('div')
center.className = 'marker center'

const map = {
  el: markers,
  markers: new Map(),
  draw () {
    this.el.innerHTML = ''
    for (const coords of this.markers.keys()) {
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
    const urls = [...this.markers.values()]
    const times = await Promise.all(urls.map(ping))
    return new Map([...this.markers.keys()].map((coords, i) => [coords, times[i]]))
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

// uoa.gr (athens)
map.markers.set('37.98330,23.73330', 'www.uoa.gr')

// helsinki.fi (helsinki)
map.markers.set('60.17560,24.93420', 'helsinki.fi')

// upc.edu (barcelona)
map.markers.set('41.72500,1.82660', 'upc.edu')

// home.iitd.ac.in (delhi)
map.markers.set('28.66670,77.21670', 'iitd.ac.in')

// www.jaist.ac.jp (nomi)
map.markers.set('36.43830,136.48250', 'jaist.ac.jp')

// uade.edu.ar (argentina)
// map.markers.set('-34.60330,-58.38170', 'www.uade.edu.ar')

// mgimo.ru (moscow)
map.markers.set('55.74850,37.61840', 'mgimo.ru')

// (sydney)
map.markers.set('-33.86120,151.19820', 'sydney.edu.au')

// (ethiopia)
// map.markers.set('8.00000,38.00000', 'www.astu.edu.et')

// (berlin)
map.markers.set('52.51550,13.40620', 'www.beuth-hochschule.de')

// draw
map.draw()

map.getTimes().then(result => map.triangulate(result))
