<template>
    <div class="body">
      <group-list></group-list>
      <div class="right-body">
        <div class="table">
          <file-list></file-list>
        </div>
      </div>
    </div>
</template>

<script>
import GroupList from '@/components/GroupList'
import FileList from '@/components/FileList'

export default {
  name: 'container',
  components: {
    GroupList,
    FileList
  },
  data () {
    return {
    }
  }
}

</script>
