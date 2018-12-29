import {
  getMaxHeight,
  getMaxLines
} from './lib/util'
import * as R from 'ramda'

function clamp(element, options = {}) {

  const opt = {
    clamp:              options.clamp || 2,
    useNativeClamp:     typeof(options.useNativeClamp) != 'undefined' ? options.useNativeClamp : true,
    splitOnChars:       options.splitOnChars || ['.', '。', '，', ',', ' '],
    animate:            options.animate || false,
    truncationChar:     options.truncationChar || '…',
    truncationHTML:     options.truncationHTML
  }
  
  const sty = element.style
  const originalText = element.innerHTML
  
  const supportsNativeClamp = typeof(element.style.webkitLineClamp) != 'undefined'
  const clampValue = opt.clamp
  const isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1)
  let truncationHTMLContainer

  if(opt.truncationHTML) {
    truncationHTMLContainer = document.createElement('span')
    truncationHTMLContainer.innerHTML = opt.truncationHTML
  }

  var splitOnChars = opt.splitOnChars.slice(0),
    splitChar = splitOnChars[0],
    chunks,
    lastChunk

  const concatEllipsis = R.curry(R.flip((text, opt) => R.concat(text, opt.truncationChar)))

  /**
   * @param {HTMLElement} el
   * @return {HTMLElement|string}
   * 获得元素的最后一个子元素
   */
  function getLastChild(el) {
    if (el.lastChild.children && el.lastChild.children.length > 0) {
      return getLastChild(Array.prototype.slice.call(el.children).pop())
    } else if (!el.lastChild || !el.lastChild.nodeValue || el.lastChild.nodeValue === '' || el.lastChild.nodeValue === opt.truncationChar) {
      el.lastChild.parentNode.removeChild(el.lastChild)
      return getLastChild(el)
    } else {
      return el.lastChild
    }
  }

  /**
   * @param {HTMLElement|string} target 最后一个元素
   * @param {number} maxHeight
   * @param {object} option 配置
   * 从文本重一次删除一个字符，直到宽度与高度的积低于传入的最大高度
   */
  function truncate(target, maxHeight) {

    const applyEllipsis = concatEllipsis(opt)

    if (!maxHeight) { return }
      
      /**
       * Resets global variables.
       */
    function reset() {
      splitOnChars = opt.splitOnChars.slice(0)
      splitChar = splitOnChars[0]
      chunks = null
      lastChunk = null
    }
    
    var nodeValue = target.nodeValue.replace(opt.truncationChar, '')
      
      //Grab the next chunks
    if (!chunks) {
      //If there are more characters to try, grab the next one
      if (splitOnChars.length > 0) {
        splitChar = splitOnChars.shift()
      }
      //No characters to chunk by. Go character-by-character
      else {
        splitChar = ''
      }
        
      chunks = nodeValue.split(splitChar)
    }
      
      //If there are chunks left to remove, remove the last one and see if
      // the nodeValue fits.
    if (chunks.length > 1) {

      lastChunk = chunks.pop()

      target.nodeValue = applyEllipsis(chunks.join(splitChar))
    }
    //No more chunks can be removed using this character
    else {
      chunks = null
    }
      
    //Insert the custom HTML before the truncation character
    if (truncationHTMLContainer) {
      target.nodeValue = target.nodeValue.replace(opt.truncationChar, '')
      element.innerHTML = target.nodeValue + ' ' + truncationHTMLContainer.innerHTML + opt.truncationChar
    }

    //Search produced valid chunks
    if (chunks) {
      //It fits
      if (element.clientHeight <= maxHeight) {
        //There's still more characters to try splitting on, not quite done yet
        if (splitOnChars.length >= 0 && splitChar != '') {
          target.nodeValue = applyEllipsis(chunks.join(splitChar) + splitChar + lastChunk)
          chunks = null
        }
        //Finished!
        else {
          return element.innerHTML
        }
      }
    }
    //No valid chunks produced
    else {
      //No valid chunks even when splitting by letter, time to move
      //on to the next node
      if (splitChar == '') {
        target.nodeValue = applyEllipsis('')
        target = getLastChild(element)
        
        reset()
      }
    }
      
    //If you get here it means still too big, let's keep truncating
    if(opt.animate) {
      setTimeout(function() {
        truncate(target, maxHeight)
      }, opt.animate === true ? 10 : opt.animate)
    } else {
      return truncate(target, maxHeight)
    }
  }


// CONSTRUCTOR ________________________________________________________________

  if (clampValue == 'auto') {
    clampValue = getMaxLines(element)
  }
  else if (isCSSValue) {
    clampValue = getMaxLines(element, parseInt(clampValue))
  }

  var clampedText
  if (supportsNativeClamp && opt.useNativeClamp) {
    sty.overflow = 'hidden'
    sty.textOverflow = 'ellipsis'
    sty.webkitBoxOrient = 'vertical'
    sty.display = '-webkit-box'
    sty.webkitLineClamp = clampValue

    if (isCSSValue) {
      sty.height = opt.clamp + 'px'
    }
  } else {
    var height = getMaxHeight(element, clampValue)

    if (height <= element.clientHeight) {
      clampedText = truncate(getLastChild(element), height)
    }
  }
  
  return {
    'original': originalText,
    'clamped': clampedText
  }
}

const hookClamp = (el, binding) => {
  clamp(el, binding.value)
}

var vueSimpleClamp = {}

vueSimpleClamp.install = function (Vue) {
  Vue.directive('clamp', {
    inserted: hookClamp,
    componentUpdated: hookClamp
  })
}

export default vueSimpleClamp
