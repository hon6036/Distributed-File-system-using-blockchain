<template>
    <div
      class="group-list-item">
      <div class="text">
          <span class="channel">{{ entry }}</span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'file-list-item',
  props: ["entry"]
}
</script>
<style scoped>
.group-list-item {
  width: 200%;
  height: 50px;
  padding: 5%;
  box-sizing: border-box;
  border-bottom: solid 1px #CDCDCD;
  background: linear-gradient(141deg, rgb(124, 173, 143) 0%, rgb(62, 139, 66) 85%);
  cursor: pointer;
}

.text {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
</style>
