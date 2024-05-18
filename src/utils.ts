import { IPosition } from './interface'
import { IUI, ILocationType } from '@leafer-ui/interface'

function getNodePosition(node: IUI, relative?: ILocationType): IPosition {
  const bound = node.getBounds('box', relative)
  return {
    x: bound.x,
    y: bound.y,
    w: bound.width,
    h: bound.height,
    l: bound.x,
    lc: bound.x + bound.width / 2,
    r: bound.x + bound.width,
    t: bound.y,
    tc: bound.y + bound.height / 2,
    b: bound.y + bound.height,
    node,
  }
}

export { getNodePosition }
