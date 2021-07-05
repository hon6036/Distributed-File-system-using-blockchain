import Api from '@/services/api'

export default {
  search (issuer, fileName) {
    return Api().post('search', {
      issuer: issuer,
      fileName: fileName,
      fileSize: "fileSize",
      channel: "channel"
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
  registerUser (name) {
    return Api().post('registerUser', {
      name: name
    })
  },
  queryAll (issuer) {
    return Api().post('queryAll', {
      issuer: issuer
    })
  }
}
