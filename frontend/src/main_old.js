import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import slVueTree from 'sl-vue-tree'
import 'sl-vue-tree/dist/sl-vue-tree-minimal.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import path from 'path'
import VueSimpleContextMenu from 'vue-simple-context-menu'

var wrtc = require('wrtc')
var Peer = require('simple-peer')
var io = require('socket.io-client')
var socket = io.connect(`http://192.168.25.40:8080`)
// var peers = {}
// var useTrickle = true
Vue.prototype.$channel = "ICE_Group(root folder)"
Vue.prototype.$socket = socket
const userEmail = 'jerry@gmail.com'
const user = 'Jerry'
Vue.component('sl-vue-tree', slVueTree)
Vue.component('icon', Icon)
Vue.component('vue-simple-context-menu', VueSimpleContextMenu)
Vue.config.productionTip = false
Vue.prototype.$EventBus = new Vue()
const { remote } = window.require('electron')
const dbPath = path.join(remote.app.getPath('appData'), '/asset')
const fs = window.require('fs')
console.log(dbPath)
Vue.prototype.$path = dbPath
Vue.prototype.$user = user
Vue.prototype.$userEmail = userEmail
console.log(dbPath)
const makeFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}
makeFolder(dbPath)
socket.on('connect', function () {
  console.log('Connected to signalling server, Peer ID: %s', socket.id)
  socket.emit('id', {
    user: userEmail,
    socketID: socket.id
  })
  Vue.prototype.$socketID = socket.id
})
socket.on('peer', function (data) {
  var peerId = data.socketid
  var peer = new Peer({ initiator: data.initiator, trickle: false, wrtc: wrtc })
  console.log(peer)
  socket.on('signal', function (data) {
    if (data.peerId === peerId) {
      console.log('Received signalling data', data, 'from Peer ID:', peerId)
      peer.signal(data.signal)
    }
  })
  peer.on('signal', function (data) {
    socket.emit('signal', {
      signal: data,
      peerId: peerId
    })
  })
  peer.on('error', function (e) {
    console.log('Error sending connection to peer %s:', e)
  })
  peer.on('connect', function () {
    if (data.fileName) {
      console.log("send file")
      var newPath = path.join(dbPath, data.fileName)
      var fileName = data.fileName
      console.log(fileName)
      fs.readFile(newPath, function (err, data) {
        if (err) {
          console.log("err", err)
        } else {
          peer.send([fileName.length, fileName, data])
        }
      })
    }
    console.log('Peer connection established')
    peer.send("hey peer")
  })
  peer.on('data', function (data) {
    console.log("asdef")
    var num = data.slice(0, 2)
    num = Number(String.fromCharCode.apply(null, num)) + 3
    console.log(num)
    var title = String.fromCharCode.apply(null, data.slice(3, num))
    console.log(title)
    var bufSize = Number(data.length)
    var fileData = data.slice(num + 1, bufSize)
    var filePath = path.join(dbPath, title)
    fs.writeFile(filePath, fileData, function (err) {
      if (err) {
        console.log("err", err)
      } else {
        console.log("saved")
      }
    })
    console.log('Recieved data from peer:', data)
  })
})
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
