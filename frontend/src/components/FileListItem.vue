<template>
    <div class="file-list-item">
      <div class="text">
          <span class="filename" > {{entry.Record.fileName}} </span>
          <span class="issuer"> /issuer: {{entry.Record.issuer}}</span>
          <span class="filesize"> {{entry.Record.fileSize}}kb</span>
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
.file-list-item {
  width: 100%;
  height: 50px;
  padding: 5%;
  box-sizing: border-box;
  border-bottom: solid 1px #CDCDCD;
  background: linear-gradient(141deg, #505D74 0%, #15223A 75%);
  cursor: pointer;
}

.text {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
span.filename {
  font-weight: bold;
  font-size: 20px;
}
span.filesize {
  color: #CFCFCF;
  font-size: 14px;
  float: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
span.issuer {
  color: #CFCFCF;
  font-size: 14px;
  float: middle;
  white-space: nowrap;
  overflow: hidden;
}
</style>
