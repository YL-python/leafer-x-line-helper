import { App, Rect, Frame } from 'leafer-ui'
// import '@leafer-in/editor'

import { LineHelper } from './src'

const app = new App({
  view: window,
  // editor: {},
  tree: {},
})
const lineHelper = new LineHelper(app)

const fra = new Frame({})
fra.name = 'frame'

app.tree.add(fra)

for (let i = 0; i < 9; i++) {
  const randomNumber = Math.random() * 50 + 150
  const rect = new Rect({
    x: Math.floor(i / 3) * 250 + 400,
    y: Math.floor(i % 3) * 250 + 400,
    width: randomNumber,
    height: randomNumber / 2,
    fill: getRandomColor(),
    editable: true,
  })
  fra.add(rect)
}
function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

console.log(lineHelper)
