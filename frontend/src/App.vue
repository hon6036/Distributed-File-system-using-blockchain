<template>
  <div id="app">
    <group-list></group-list>
    <div id="body">
      <file-list></file-list>
    </div>
  </div>
</template>

<script>
import GroupList from '@/components/GroupList'
import FileList from '@/components/FileList'
export default {
  name: 'file-tree',
  components: {
    GroupList,
    FileList
  },
  data: () => ({
    //
  })
}
</script>
