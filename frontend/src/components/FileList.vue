<template>
  <div id="dataTable" class="dataTable" @contextmenu.prevent="$refs.ctxMenu.open" v-cloak @drop.prevent="addFile" @dragover.prevent>
  <context-menu id="context-menu" ref="ctxMenu">
    <li @click="makeNewFolder()">NewFolder</li>
  </context-menu>
    <v-data-table :headers="headers" :items="items" @click:row="Open">
      <template v-slot:[`item.title`]="{ item }">
        <v-icon v-if="item.title.split('.')[1] === 'txt'">mdi-file</v-icon>
        <v-icon v-else-if="item.title.split('.')[1] === 'mp3'">mdi-file-music</v-icon>
        <v-icon v-else-if="item.title.split('.')[1] === 'png'">mdi-image-outline</v-icon>
        <v-icon v-else-if="item.title.split('.')[1] === 'ods'">mdi-microsoft-excel</v-icon>
        <v-icon v-else-if="item.title.split('.')[1] === 'odp'">mdi-microsoft-powerpoint</v-icon>
        <v-icon v-else-if="item.title.split('.')[1] === 'mp4'">mdi-file-video</v-icon>
        <v-icon v-else>mdi-folder</v-icon>
        {{ item.title }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import PostsService from "@/services/apiService"
import contextMenu from 'vue-context-menu'
const fs = window.require('fs')
const path = require('path')
const { remote } = window.require('electron')

export default {
  name: 'file-list',
  components: {
    contextMenu
  },
  data () {
    return {
      headers: [
        { text: 'Name', align: 'left', value: 'title', sortable: false, width: '250px' },
        { text: 'Owner', value: 'owner', sortable: false, width: '200px' },
        { text: 'Size', value: 'size', sortable: false }
      ],
      response: {},
      items: [],
      fileIssuer: [],
      fileSize: [],
      dir: '',
      dialog: false
    }
  },
  created () {
    this.$EventBus.$on('send-folder', payload => {
      var tmp = []
      var fileIssuer = this.fileIssuer
      var fileSize = this.fileSize
      payload.children.forEach(function (element) {
        tmp.push({ title: element.title, owner: fileIssuer[element.title], size: parseInt(fileSize[element.title] / 1024) + "MB", isLeaf: element.isLeaf })
      })
      this.items = tmp
    })
    this.$EventBus.$on('send-fileIssuer', payload => {
      this.fileIssuer = payload
    })
    this.$EventBus.$on('send-fileSize', payload => {
      this.fileSize = payload
    })
  },
  methods: {
    makeNewFolder () {
      this.dialog = true
      console.log("makeNewFolder")
      this.items.push({ title: "test", owner: this.$user, size: 0, isLeaf: false })
    },
    async addFile (e) {
      console.log(this.dir)
      console.log(123123)
      const droppedFiles = e.dataTransfer.files
      const fileName = droppedFiles[0].name
      const fileSize = String(droppedFiles[0].size)
      const filePath = path.join(String(this.dir), fileName)
      const pathNewDest = path.join(this.$path, fileName)
      fs.copyFile(droppedFiles[0].path, pathNewDest, (err) => {
        if (err) {
          console.log(err)
        }
      })
      const apiResponse = await PostsService.upload(
        this.$user,
        fileName,
        fileSize,
        this.$channel,
        filePath
      )
      console.log(apiResponse)
      console.log(this.items)
      this.items.push({ title: fileName, owner: this.$user, isLeaf: true })
      console.log(fileName)
      console.log(fileSize)
      console.log(droppedFiles[0])
    },
    async Open (item) {
      console.log(this.dir)
      console.log(item)
      if (item.isLeaf) {
        console.log(this.fileIssuer[item.title])
        console.log("open")
        console.log(item.title)
        const fileP = path.join(this.$path, item.title)
        if (fs.existsSync(fileP)) {
          console.log("file exist")
        } else {
          console.log('else')
          this.$socket.emit('find', {
            fileName: item.title,
            issuer: this.fileIssuer[item.title],

            socketID: this.$socketID
          })
        }
      } else {
        this.dir = path.join(this.dir, item.title)
        console.log(this.dir)
        console.log("asdsad")
        console.log(item)
        if (item.children) {
          this.items = item.children
        } else {
          this.items = []
        }
      }
    }
  }
}
</script>
<style>
.dataTable {
  font-family: 'Nanum Gothic', sans-serif;
  width: 600px;
  left: 300px;
  height: 600px;
  position: relative;
}
</style>
