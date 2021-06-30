import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import slVueTree from 'sl-vue-tree'
import 'sl-vue-tree/dist/sl-vue-tree-dark.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import path from 'path'
import Peer from 'peerjs'
Vue.component('sl-vue-tree', slVueTree)
Vue.component('icon', Icon)

Vue.config.productionTip = false
Vue.prototype.$EventBus = new Vue()
const { remote } = window.require('electron')
const dbPath = path.join(remote.app.getPath('appData'), '/asset')
const fs = window.require('fs')
console.log(dbPath)
Vue.prototype.$path = dbPath
const user = 'Org2AppUser'
const channel = 'mychannel'
Vue.prototype.$channel = channel
Vue.prototype.$user = user
const peer = new Peer(user)
Vue.prototype.$peer = peer
peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    console.log(data)
  })
})
const makeFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}
makeFolder(dbPath)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
