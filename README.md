# vue-simple-clamp

## 超简配置—— 提供多行文本折行功能
### 基于 [Clamp.js](https://github.com/josephschmitt/Clamp.js) 的 Vue.js 插件

## 目录
- [安装与使用](#安装与使用)
- [指令配置](指令配置)
- [常见问题](#常见问题)


### 安装与使用

1. 安装: 
```vim
npm install --save vue-simple-clamp
```
2. 在 Vue 实例化前调用插件
```javascript
import VueClamp from 'vue-simple-clamp'

Vue.use(VueClamp)

new Vue({
  ...
})
```
3. 在项目中使用 v-clamp 指令
```Vue
<template>
  <p v-clamp="{ clamp: 2 }">
    这是一段需要折行的长文本这是一段需要折行的长文本这是一段需要折行的长文本
  </p>
</template>
```

### 指令配置

```typescript
clamp: number | string | 'auto'
```
clamp属性默认为2，它规定里何时何地截断字符串。当clamp属性为数字类型时，代表在哪行末尾添加截断字符，如：clamp：2 则会让长文本的第二行末尾添加截断字符。
当clamp属性为字符串时，意味着你需要写一个css高度(px 或者 em)，如：clamp：'20px' 或 '30em'，则长文本的高度在到达该设定高度时会自动添加截断字符。
当clamp属性为'auto'字符串时，会使长文本尽可能的填满容器，一旦容器高度不足以装下长文本，则在末尾自动添加截断字符。

```typescript
useNativeClamp: boolean
```
userNativeClamp属性默认为true，它规定是否使用原生的CSS实现长文本截断功能(即添加-webkit-line-clamp属性)。若为false则使用JavaScript实现截断功能。需要注意的是，接下来介绍的属性都依赖于将userNativeClamp设置为false。

```typescript
truncationChar: string
```
truncationChar属性默认为'...'，很明显，这是用来定义截断字符的。

```typescript
truncationHTML: string
```
truncationHTML属性默认不存在，这个也是用来定义截断字符的，只不过该属性支持DOM元素的插入，如：truncationHTML: '\<span>Read More\</span>'

```typescript
splitOnChars: string[]
```
splitOnChars属性的默认值为 ['.', ',', ' '],这个属性的作用是指导JavaScript将长文本这个数组中的元素拆解为更小的片段，用于减少循环提高性能，如：设置 splitOnChars: ['.', ','] 则会先删除句子(句号)，如果删多了会再尝试删除文段(逗号),如果删多了就会一个一个的删除字符直到最后完美的截断长文本。具体的效果可以通过设置下面要介绍的animate属性来更直观的感受到差距。

***Tip:试着根据各长文本内容的不同而去设置这个属性，比如长文本中存在很多百分号%，那么就应该考虑将百分号写进该属性中，提升性能***

```typescript
animate: boolean
```
animate属性默认为false,将其开启后会出现逐步删除长文本的动画效果。

### 常见问题
*删除线代表该问题已被修复*

**Q: 设定了配置，但是却没有生效？**

**A:** 想让如自定义截断字符串这类配置生效，你需要将配置中的 useNativeClamp 设为 false（也就是开启脚本实现多行文本截断）。

**Q: 开启动画效果，字符串缩减的速度很慢？**

**A:** 字符缩减的过程会检测需要缩减字符串的表单符号，如果存在“.”、“-”、“ ”这几个符号则会优先进行删减。所以出现字符串缩减速度很慢的原因很可能是长文本中缺少这几个标点符号，或者运用了大量的中文符号。解决方法很简单，只需要设置 splitOnChars 属性为长文本中常出现的符号，比如设置属性为 ['。', '!'] 可大大增加字符串缩减效率，提升性能。

**Q: 开启脚本截断字符串后，总是多截断一行？**

**A:** 为需要截断的文本添加行高 line-height 属性即可解决。
