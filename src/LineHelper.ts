import {
  App,
  Leafer,
  Event,
  DataHelper,
  DragEvent,
  LayoutEvent,
} from '@leafer-ui/core'
import { ICanvasContext2D, IEventListenerId, IUI } from '@leafer-ui/interface'

import { ILineHelperConfig } from './interface'
import { getNodePosition } from './utils'

export class LineHelper {
  private readonly app: App
  private readonly helperLeafer: Leafer
  private readonly ctx: ICanvasContext2D

  public readonly config: ILineHelperConfig = {
    type: 'line',
    lineColor: '#3670f7',
    lineStyle: 'solid',
    lineWidth: 1,
    sticky: true,
    stickySpace: 4,
    vCompare: ['l', 'lc', 'r'],
    hCompare: ['t', 'tc', 'b'],
  }

  protected __eventIds: IEventListenerId[]

  constructor(app: App, userConfig?: Partial<ILineHelperConfig>) {
    this.app = app
    this.helperLeafer = app.addLeafer()
    this.ctx = this.helperLeafer.canvas.context

    if (userConfig) DataHelper.assign(this.config, userConfig)

    this.__listenEvents()
  }

  public setConfig(userConfig: Partial<ILineHelperConfig>) {
    DataHelper.assign(this.config, userConfig)
  }

  // 获取所有没有选中的元素
  protected getNotSelectNodes(): IUI[] {
    // 所有元素
    const allNode = this.app.tree.find(
      (item) => (!item.isLeafer && !item.isApp && item.editable ? 1 : 0) // TODO 这样的方式获取全部节点是OK的吗？
    )
    // 当前选中的元素
    const currentNodes: any[] = this.app.editor?.list || []
    const activeIdMap = {} as Record<number, boolean>
    currentNodes.forEach((item) => (activeIdMap[item.innerId] = true))
    // 所有元数中，过滤一下选中的元素
    const nodeList = allNode.filter((item) => !activeIdMap[item.innerId])
    return nodeList
  }

  // 绘制水平线
  private __drawHorizontalLine(y: number) {
    this.ctx.save()
    this.ctx.beginPath()
    if (this.config.lineStyle === 'dashed') {
      this.ctx.setLineDash([4, 4])
      this.ctx.lineDashOffset = 0
    }
    this.ctx.strokeStyle = this.config.lineColor
    this.ctx.lineWidth = this.config.lineWidth
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(this.helperLeafer.width, y)
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 绘制垂直线
  private __drawVerticalLine(x: number) {
    this.ctx.save()
    this.ctx.beginPath()
    if (this.config.lineStyle === 'dashed') {
      this.ctx.setLineDash([4, 4])
      this.ctx.lineDashOffset = 0
    }
    this.ctx.strokeStyle = this.config.lineColor
    this.ctx.lineWidth = this.config.lineWidth
    this.ctx.moveTo(x, 0)
    this.ctx.lineTo(x, this.helperLeafer.height)
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 清除画板
  protected __clearRect() {
    this.ctx.clearRect(0, 0, this.helperLeafer.width, this.helperLeafer.height)
  }

  protected onDragEnd(): void {
    this.__clearRect()
  }

  // 处理辅助线
  protected handleLineHelp(currentNode: IUI, nodeList: IUI[]): void {
    if (this.config.type === 'none') return
    this.__clearRect()

    nodeList.forEach((targetNode) => {
      const currentPos = getNodePosition(currentNode, 'world')
      const targetPos = getNodePosition(targetNode, 'world')
      // 垂直方向
      this.config.vCompare.forEach((cKey) => {
        this.config.vCompare.forEach((tKey) => {
          if (
            Math.abs(currentPos[cKey] - targetPos[tKey]) <=
            this.config.lineWidth / 2
          ) {
            this.__drawVerticalLine(currentPos[cKey])
          }
        })
      })
      // 水平方向
      this.config.hCompare.forEach((cKey) => {
        this.config.hCompare.forEach((tKey) => {
          if (
            Math.abs(currentPos[cKey] - targetPos[tKey]) <=
            this.config.lineWidth / 2
          ) {
            this.__drawHorizontalLine(currentPos[cKey])
          }
        })
      })
    })
  }

  // 处理吸附
  protected handleNodeSticky(currentNode: IUI, nodeList: IUI[]): void {
    if (!this.config.sticky) return

    nodeList.forEach((targetNode) => {
      const currentPos = getNodePosition(currentNode, 'local')
      const targetPos = getNodePosition(targetNode, 'local')
      // 垂直方向
      this.config.vCompare.forEach((cKey) => {
        this.config.vCompare.forEach((tKey) => {
          const dx = currentPos[cKey] - targetPos[tKey]
          if (Math.abs(dx) <= this.config.stickySpace) {
            if (cKey === 'l') {
              currentNode.x = targetPos[tKey]
            } else if (cKey === 'lc') {
              currentNode.x = targetPos[tKey] - currentPos.w / 2
            } else if (cKey === 'r') {
              currentNode.x = targetPos[tKey] - currentPos.w
            }
          }
        })
      })
      // 水平方向
      this.config.hCompare.forEach((cKey) => {
        this.config.hCompare.forEach((tKey) => {
          const dy = currentPos[cKey] - targetPos[tKey]
          if (Math.abs(dy) <= this.config.stickySpace) {
            // TODO 怎么解决选中多个元元素的吸附？
            // let newDy = currentPos[cKey] - dy - currentNode.y
            // if (cKey === 'tc') {
            //   newDy -= currentPos.h / 2
            // } else if (cKey === 'b') {
            //   newDy -= currentPos.h
            // }
            // this.app.editor.list.forEach((item) => {
            //   item.y += newDy
            // })
            if (cKey === 't') {
              currentNode.y = targetPos[tKey]
            } else if (cKey === 'tc') {
              currentNode.y = targetPos[tKey] - currentPos.h / 2
            } else if (cKey === 'b') {
              currentNode.y = targetPos[tKey] - currentPos.h
            }
          }
        })
      })
    })
  }

  // 拖拽处理事件
  protected onDrag(): void {
    if (!this.app.editor?.dragging) return
    const nodeList = this.getNotSelectNodes()
    const currentNode = this.app.editor?.element // 当前选中的元素 构成的一个大元素
    if (!currentNode || !nodeList?.length) return

    this.handleNodeSticky(currentNode, nodeList)
  }

  // 布局跟新后处理事件
  protected onLayoutAfter(): void {
    if (!this.app.editor?.dragging) return
    const nodeList = this.getNotSelectNodes()
    const currentNode = this.app.editor?.element // 当前选中的元素 构成的一个大元素
    if (!currentNode || !nodeList?.length) return

    this.handleLineHelp(currentNode, nodeList)
  }

  protected __listenEvents(): void {
    this.__eventIds = [
      this.app.tree.on_(DragEvent.DRAG, this.onDrag, this),
      this.app.tree.on_(LayoutEvent.AFTER, this.onLayoutAfter, this),
      this.app.tree.on_(DragEvent.END, this.onDragEnd, this),
    ]
  }

  protected __removeListenEvents(): void {
    this.app.off_(this.__eventIds)
  }

  public destroy(): void {
    this.__removeListenEvents()
  }
}

export class LineHelperEvent extends Event {}
