import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ErrorStackParser from 'error-stack-parser'
// import { findCodeBySourceMap } from './utils'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus)

app.config.errorHandler = (err: any, vm) => {
  //   console.log({ err, instance, info })
  const stack = ErrorStackParser.parse(err as Error)
  const jsError = {
    stack_frames: stack,
    message: err.message,
    name: err.name,
    stack: err.stack,
  }
  vm!.$message.error(`触发了一个${jsError.name}错误`)
  localStorage.setItem('jsErrorList', JSON.stringify(jsError))
  // findCodeBySourceMap(stack[0])
  // console.log({ stack, err, info, instance })
}

app.use(createPinia())
app.use(router)

app.mount('#app')
