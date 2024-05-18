import { useEffect, useRef } from 'react'
import { App, Rect, Frame } from 'leafer-ui'
import '@leafer-in/editor'

import { LineHelper } from '../../src'
import { getRandomColor } from './utils'

let app: App, // Leafer
  lineHelper: LineHelper // 辅助线插件

function Index() {
  const canvasRef = useRef<HTMLDivElement>()

  useEffect(() => {
    app = new App({
      view: canvasRef.current,
      editor: {},
      tree: {},
    })
    lineHelper = new LineHelper(app)

    const fra = new Frame({
      width: canvasRef.current?.clientWidth,
      height: canvasRef.current?.clientHeight,
    })
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

    setTimeout(() => {
      lineHelper.setConfig({ lineStyle: 'dashed' })
    }, 2000)
  }, [])

  return (
    <div className="content">
      <div ref={canvasRef} id="canvasRef"></div>
    </div>
  )
}

export default Index
