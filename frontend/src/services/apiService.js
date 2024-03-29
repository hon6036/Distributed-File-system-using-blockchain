import Api from '@/services/api'

export default {
  search (issuer, fileName, fileSize, channel) {
    return Api().post('search', {
      issuer: issuer,
      fileName: fileName,
      fileSize: fileSize,
      channel: channel
    })
  },
  upload (issuer, fileName, fileSize, channel, filePath) {
    return Api().post('upload', {
      issuer: issuer,
      fileName: fileName,
      fileSize: fileSize,
      channel: channel,
      filePath: filePath
    })
  },
  queryAll (issuer) {
    return Api().post('queryAll', {
      issuer: issuer
    })
  }
}
