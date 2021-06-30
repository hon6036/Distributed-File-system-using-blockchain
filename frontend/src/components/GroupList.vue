/* eslint-disable */
<template>
  <div>
    <v-banner class="banner">{{ dir }}</v-banner>
    <div class="app">
    <sl-vue-tree v-model="nodes" @nodeclick="nodeClick">

      <template slot="toggle" slot-scope="{ node }">
          <span v-if="!node.isLeaf">
            <icon name="caret-right" v-if="!node.isExpanded"></icon>
            <icon name="caret-down"  v-if="node.isExpanded"></icon>
          </span>
      </template>

      <template slot="title" slot-scope="{ node }">
        <div v-if="node.isLeaf">
          <v-icon v-if="node.title.split('.')[1] === 'txt'">mdi-file</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'mp3'">mdi-file-music</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'png'">mdi-image-outline</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'ods'">mdi-microsoft-excel</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'odp'">mdi-microsoft-powerpoint</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'mp4'">mdi-file-video</v-icon>
          <v-icon v-else-if="node.title.split('.')[1] === 'pdf'">mdi-file-pdf</v-icon>
          {{ node.title }}
        </div>
      </template>
    </sl-vue-tree>
    </div>
  </div>
</template>
/* eslint-enable */
<script>
import PostsService from "@/services/apiService"
var nodes = []
var list = []
var dir = []
export default {
  name: 'group-list',
  components: {
  },
  data () {
    return {
      nodes: nodes,
      list: list,
      dir: dir,
      folderName: ''
    }
  },
  async mounted () {
    this.response = null
    console.log("query")
    const apiResponse = await PostsService.queryAll(
      this.$user
    )
    console.log(apiResponse.data)
    console.log("apiResponse")
    const item = apiResponse.data
    var list = []
    var fileIssuer = {}
    var fileSize = {}
    for (var j in item) {
      list.push(item[j].Record.filePath)
      fileIssuer[item[j].Record.fileName] = item[j].Record.issuer
      fileSize[item[j].Record.fileName] = item[j].Record.fileSize
    }
    this.list = list
    console.log("list")
    console.log(list)
    var data = []
    for (var i = 0; i < list.length; i++) {
      this.buildTree(list[i].split('/'), data)
      console.log(1234)
    }
    console.log(data)
    console.log(8888888888)
    this.dir = this.$channel
    this.nodes = data
    this.$EventBus.$emit('send-fileIssuer', fileIssuer)
    this.$EventBus.$emit('send-fileSize', fileSize)
  },
  methods: {
    buildTree: function (parts, treeNode) {
      if (parts.length === 0) {
        return
      }
      for (var i = 0; i < treeNode.length; i++) {
        if (parts[0] === treeNode[i].title) {
          this.buildTree(parts.splice(1, parts.length), treeNode[i].children)
          return
        }
      }
      if (parts.length === 1) {
        const newNode = { title: parts[0], isLeaf: true }
        treeNode.push(newNode)
      } else {
        const newNode = { title: parts[0], children: [] }
        treeNode.push(newNode)
        this.buildTree(parts.splice(1, parts.length), newNode.children)
      }
    },
    nodeClick (folder) {
      console.log("click")
      this.getFolder(folder)
      this.getDir(folder)
    },
    addFolder () {
      var input = this.folderName
      console.log(input)
      console.log(this.dir)
      var newDir = this.dir + '/' + input
      console.log(newDir)
      this.nodes = newDir
    }
  }
}
</script>

<style>
.app {
  width: 300px;
  min-height: 600px;
  float: left;
  position: absolute;
  overflow-y: scroll;
}
.v-banner {
  width: 300px;
}
</style>
