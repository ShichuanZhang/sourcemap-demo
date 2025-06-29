<template>
  <div class="about">
    <p @click="triggerTypeError">触发TypeError</p>
    <el-divider></el-divider>
    <p @click="triggerReferenceError">触发ReferenceError</p>
    <el-divider></el-divider>
    <p @click="triggerSyntaxError">触发SyntaxError</p>
  </div>
</template>

<script setup lang="ts">
const triggerTypeError = () => {
  //   throw new TypeError('这是一个TypeError')
  if (typeError.length > 0) {
    console.log('!error')
  }
}
const triggerReferenceError = () => {
  throw new ReferenceError('这是一个ReferenceError')
}
const triggerSyntaxError = () => {
  throw new SyntaxError('这是一个SyntaxError')
}
</script>

<style></style>
