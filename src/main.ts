import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ErrorStackParser from 'error-stack-parser'
import { findCodeBySourceMap } from './utils'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  //   console.log({ err, instance, info })
  const stack = ErrorStackParser.parse(err as Error)
  findCodeBySourceMap(stack[0])
  console.log({ stack, err, info, instance })
}

app.use(createPinia())
app.use(router)

app.mount('#app')
