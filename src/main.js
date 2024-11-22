import {createApp} from 'vue'
import App from './App.vue'
import routers from './routers/index.js'
import {createPinia} from 'pinia'
import '@/styles/variables.css'
import './styles/global.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const pinia = createPinia()

createApp(App)
    .use(routers)
    .use(pinia)

    .mount('#app')
