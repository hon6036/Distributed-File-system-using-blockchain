<template>
  <div class="files" v-cloak @drop.prevent="addFile" @dragover.prevent>
    <v-item-group>
      <v-item v-for="item in file" v-bind:key="item.key">
        <div v-if="item.isLeaf">
          <v-icon large @click="fileOpen(item)">mdi-file</v-icon>
          <div>{{ item.title }}</div>
        </div>
        <div v-else>
          <v-icon  large @click="folderOpen(item)">mdi-folder</v-icon>
          <div>{{ item.title }}</div>
        </div>
      </v-item>
    </v-item-group>
  </div>
</template>
<script>
import PostsService from "@/services/apiService"
import Peer from 'peerjs'
const fs = window.require('fs')
const path = require('path')
export default {
  name: 'file-list',
  components: {
  },
  data () {
    return {
      response: {},
      file: []
    }
  },
  created () {
    this.$EventBus.$on('send-folder', payload => {
      this.file = payload.children
      console.log(payload.children)
    })
  },
  methods: {
    async addFile (e) {
      const droppedFiles = e.dataTransfer.files
      console.log(droppedFiles)
      const fileName = droppedFiles[0].name
      const fileSize = droppedFiles[0].path
      const pathNewDest = path.join(this.$path, fileName)
      fs.copyFile(fileSize, pathNewDest, (err) => {
        if (err) {
          console.log(err)
        }
      })
      const apiResponse = await PostsService.upload(
        this.$user,
        fileName,
        String(fileSize),
        'achannel'
      )
      console.log(apiResponse)
      console.log(fileName)
      console.log(fileSize)
      console.log(droppedFiles[0])
    },
    async fileOpen (item) {
      console.log("open")
      console.log(item)
      const fileP = path.join(this.$path, item.title)
      const apiResponse = await PostsService.search(
        this.$user,
        item.title
      )
      console.log(apiResponse.data)
      if (fs.existsSync(fileP)) {
        console.log("file exist")
      } else {
        const peer = new Peer(this.$user)
        const conn = peer.connect(apiResponse.data.issuer)
        conn.on('open', () => {
          conn.send(item.title)
        })
      }
    },
    async folderOpen (folder) {
      this.file = folder.children
    },
    async query (user) {
      this.response = null
      const apiResponse = await PostsService.queryAll(
        this.$user
      )
      console.log(apiResponse.data)
      console.log("apiResponse")
      this.response = apiResponse.data
    }
  }
}
</script>
<style>
.files {
  width: 500px;
  height: 100%;
  position: relative;
  left: 60%
}
</style>
