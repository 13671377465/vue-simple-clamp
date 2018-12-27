import {
  getMaxHeight,
  getMaxLines
} from './lib/util'

function clamp(element, options) {
  options = options || {}

  var opt = {
    clamp:              options.clamp || 2,
    useNativeClamp:     typeof(options.useNativeClamp) != 'undefined' ? options.useNativeClamp : true,
    splitOnChars:       options.splitOnChars || ['.', '-', '–', '—', ' '], //Split on sentences (periods), hypens, en-dashes, em-dashes, and words (spaces).
    animate:            options.animate || false,
    truncationChar:     options.truncationChar || '…',
    truncationHTML:     options.truncationHTML
  },
  
  sty = element.style,
  originalText = element.innerHTML,
  
  supportsNativeClamp = typeof(element.style.webkitLineClamp) != 'undefined',
  clampValue = opt.clamp,
  isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1),
  truncationHTMLContainer

  if (opt.truncationHTML) {
    truncationHTMLContainer = document.createElement('span')
    truncationHTMLContainer.innerHTML = opt.truncationHTML
  }

  var splitOnChars = opt.splitOnChars.slice(0),
    splitChar = splitOnChars[0],
    chunks,
    lastChunk

  function applyEllipsis(el, str, opt) {
    el.nodeValue = str + opt.truncationChar
  }
    
  /**
   * @param {HTMLElement} el
   * @return {HTMLElement|string}
   * 获得元素的最后一个子元素
   */
  function getLastChild(el) {
    //Current element has children, need to go deeper and get last child as a text node
    if (el.lastChild.children && el.lastChild.children.length > 0) {
      return getLastChild(Array.prototype.slice.call(el.children).pop())
    }
    //This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
    else if (!el.lastChild || !el.lastChild.nodeValue || el.lastChild.nodeValue == '' || el.lastChild.nodeValue == opt.truncationChar) {
      el.lastChild.parentNode.removeChild(el.lastChild)
      return getLastChild(element)
    }
    //This is the last child we want, return it
    else {
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
    if (!maxHeight) {return}
      
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
      // console.log('chunks', chunks)
      lastChunk = chunks.pop()
      // console.log('lastChunk', lastChunk)
      applyEllipsis(target, chunks.join(splitChar), opt)
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
          applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk, opt)
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
        applyEllipsis(target, '', opt)
        target = getLastChild(element)
        
        reset()
      }
    }
      
      //If you get here it means still too big, let's keep truncating
    if (opt.animate) {
      setTimeout(function() {
        truncate(target, maxHeight)
      }, opt.animate === true ? 10 : opt.animate)
    }
    else {
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
      clampedText = truncate(getLastChild(element, opt), height)
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
