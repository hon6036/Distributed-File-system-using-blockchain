import Api from '@/services/api'

export default {
  search (issuer, fileName, fileSize) {
    return Api().post('search', {
      issuer: issuer,
      fileName: fileName,
      fileSize: "fieSize",
      channel: "channel"
    })
  },
  upload (issuer, fileName, fileSize, channel) {
    return Api().post('upload', {
      issuer: issuer,
      fileName: fileName,
      fileSize: fileSize,
      channel: channel
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
