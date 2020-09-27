<template>
  <div id="app">
    <v-btn  class="query" @click="query()">새로고침</v-btn>

    <sl-vue-tree v-model="nodes" @nodeclick="nodeClick">

      <template slot="toggle" slot-scope="{ node }">
          <span v-if="!node.isLeaf">
            <icon name="caret-right" v-if="!node.isExpanded"></icon>
            <icon name="caret-down"  v-if="node.isExpanded"></icon>
          </span>
      </template>

      <template slot="title" slot-scope="{ node }">
          <icon name="file" v-if="node.isLeaf"></icon> {{ node.title }} </template>
    </sl-vue-tree>
  </div>
</template>

<script>
import PostsService from "@/services/apiService"
var nodes = []
export default {
  name: 'group-list',
  components: {
  },
  data () {
    return {
      nodes: nodes
    }
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
    async query () {
      this.response = null
      const apiResponse = await PostsService.queryAll(
        this.$user
      )
      console.log(apiResponse.data)
      console.log("apiResponse")
      const item = apiResponse.data
      var list = []
      for (var j in item) {
        list.push("ICE_Group (root folder)" + item[j].Record.fileSize)
      }
      var data = []
      for (var i = 0; i < list.length; i++) {
        this.buildTree(list[i].split('/'), data)
      }
      console.log(data)
      this.nodes = data
    },
    getFolder: function (nodes, folder) {
      this.$EventBus.$emit('send-folder', folder)
    },
    nodeClick (node) {
      console.log("click")
      this.getFolder(nodes, node)
    }
  }
}
</script>

<style scoped>
.sl-vue-tree {
  position: absolute;
  width: 300px;
  height: 100%;
  overflow-y: scroll;
  float: left;
}
</style>
