/**
 * 返回元素的当前样式
 * @param {HTMLElement} el
 * @param {string} prop 查询的元素属性
 * @return {number} 属性值
 */
function computeStyle(el, prop) {
  if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
      this.el = el
      this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g
        if (prop == 'float') prop = 'styleFloat'
        if (re.test(prop)) {
          prop = prop.replace(re, function () {
            return arguments[2].toUpperCase()
          })
        }
        return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null
      }
      return this
    }
  }

  return window.getComputedStyle(el, null).getPropertyValue(prop)
}

/**
 * @param {HTMLElement} el
 * @param {HTMLElement} clmp 配置的clamp属性
 * @return {number} 最大高度
 * 根据文本的行高和给定的截断值返回给定元素应具有的最大高度。
 */
export function getMaxHeight(el, clmp) {
  var lineHeight = getLineHeight(el)
  return lineHeight * clmp
}

/**
 * @param {HTMLElement} el
 * @return {number} 整数
 * 得到元素的行高
 */
function getLineHeight(el) {
  var lh = computeStyle(el, 'line-height')
  if (lh == 'normal') {
    // Normal line heights vary from browser to browser. The spec recommends
    // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
    lh = parseInt(computeStyle(el, 'font-size')) * 1.2
  }
  return parseInt(lh)
}

/**
 * @param {HTMLElement} el
 * @param {number} height 容器高度
 * @return {number} 最大行数
 * 根据元素的高度与文本行高
 * 返回最大行数
 */
export function getMaxLines(el, height) {
  var availHeight = height || el.clientHeight,
      lineHeight = getLineHeight(el)

  return Math.max(Math.floor(availHeight/lineHeight), 0)
}
