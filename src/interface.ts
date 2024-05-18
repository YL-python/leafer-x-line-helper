import { IUI } from '@leafer-ui/interface'

/**
 * 辅助线插件的配置
 */
export interface ILineHelperConfig {
  /**
   * 辅助线类型
   * @default 'line'
   * @description none: 不显示辅助线，line: 显示直线辅助线，arrow: 显示箭头辅助线（待开发）
   */
  type: 'none' | 'line' | 'arrow'
  /**
   * 辅助线颜色
   * @default '#3670f7'
   */
  lineColor: string
  /**
   * 辅助线样式
   * @default 'solid'
   * @description solid: 实线 dashed: 虚线
   */
  lineStyle: 'solid' | 'dashed'

  /**
   * 辅助线宽度
   * @default 1
   */
  lineWidth: number
  /**
   * 是否开启吸附功能
   * @default true
   */
  sticky: boolean
  /**
   * 吸附距离
   * @default 4
   */
  stickySpace: number
  /**
   * 垂直方向比较类型
   * @default ['l', 'lc', 'r']
   */
  vCompare: TVCompare[]
  /**
   * 水平方向比较类型
   * @default ['t', 'tc', 'b']
   */
  hCompare: THCompare[]
}

type TVCompare = keyof Pick<IPosition, 'l' | 'lc' | 'r'>
type THCompare = keyof Pick<IPosition, 't' | 'tc' | 'b'>

/**
 * 每个节点的坐标信息
 */
export interface IPosition {
  x: number // 元素 x 坐标
  y: number // 元素 y 坐标
  w: number // 元素宽度
  h: number // 元素高度
  l: number // 元素左边线
  lc: number // 元素竖向 中心线
  r: number // 元素右边线
  t: number // 元素上边线
  tc: number // 元素横向 中心线
  b: number // 元素下边线
  node: IUI
}
