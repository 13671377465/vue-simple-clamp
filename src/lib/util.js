import * as R from 'ramda'

const setFloatProperty = R.ifElse(
  R.equals('float'),
  () => 'styleFloat',
  R.identity
)
const reg = /(\-([a-z]){1})/g
const upperTwo = (...arg) => R.toUpper(arg[2])
const setUpperCase = R.ifElse(
  R.test(reg),
  R.replace(reg, upperTwo),
  R.identity
)

const polyfillGetStyleProp = (el, prop) => {
  const p = R.compose(
    setUpperCase,
    setFloatProperty
  )(prop)
  
  return el.currentStyle && el.currentStyle[p]
  ? el.currentStyle[p]
  : null
}

const getPropertyValue = (style) => style.getPropertyValue.bind(style)

const winGetComputedStyle = (el) => window.getComputedStyle(el, null)

const hasGetComputedStyle = () => R.has('getComputedStyle', window)
const curryPolyfillGetStyleProp = (...arg) => R.curry(polyfillGetStyleProp)(arg)

/**
 * 返回元素的当前样式
 * @param {HTMLElement} el
 * @param {string} prop 查询的元素属性
 * @return {number} 属性值
 */
const computeStyle = R.ifElse(
  hasGetComputedStyle,
  R.compose(getPropertyValue, winGetComputedStyle),
  curryPolyfillGetStyleProp
)

/**
 * @param {HTMLElement} el
 * @return {number} 整数
 * 得到元素的行高
 */
function getLineHeight(el) {
  const getElStyle = computeStyle(el)
  const elLineHeight = getElStyle('line-height')

  return R.equals(elLineHeight, 'normal')
  ? R.multiply(parseInt(getElStyle('font-size')), 1.4)
  : parseInt(elLineHeight)
}

/**
 * @param {HTMLElement} el
 * @param {HTMLElement} clmp 配置的clamp属性
 * @return {number} 最大高度
 * 根据文本的行高和给定的截断值返回给定元素应具有的最大高度。
 */
export const getMaxHeight = (el, clmp) => R.multiply(getLineHeight(el), clmp)

/**
 * @param {HTMLElement} el
 * @param {number} height 容器高度
 * @return {number} 最大行数
 * 根据元素的高度与文本行高
 * 返回最大行数
 */
export function getMaxLines(el, height) {
  const getLines = R.compose(Math.floor, R.divide)
  const defaultToHeight =  R.defaultTo(el.clientHeight)

  const availHeight = defaultToHeight(height)
  const lineHeight = getLineHeight(el)

  return R.max(0, getLines(availHeight, lineHeight))
}
