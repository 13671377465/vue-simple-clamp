# vue-simple-clamp

### 超简配置—— 提供多行文本折行功能
### 基于 [Clamp.js](https://github.com/josephschmitt/Clamp.js) 的 Vue.js 插件

## 目录
- [安装与使用](#安装与使用)


#### 安装与使用

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
