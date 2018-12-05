'use strict'
const crypto = require('crypto')

module.exports = {
  underLineToHump(str) {
    return str.split('_')
      .map(function(word, index) {
        if (index === 0) return word
        return word.split('').map(function(char, charIndex) {
          return charIndex === 0 ? char.toLocaleUpperCase() : char
        }).join('')
      }).join('')
  },

  humpToUnderLine(str) {
    return str.split('')
      .map(function(word) {
        if (word.toLocaleUpperCase() === word) {
          return '_' + word.toLocaleLowerCase()
        }
        return word
      }).join('')
  },

  leftPad(number, n) {
    return (Array(n).join('0') + number).slice(-n)
  },

  rightPad(number, n) {
    return (number + Array(n).join('0')).slice(0, n)
  },

  md5(str) {
    str = str || ''
    const md5sum = crypto.createHash('md5')
    md5sum.update(str)
    str = md5sum.digest('hex')
    return str
  },

  getSuccessData(data) {
    return {
      success: true,
      data: data,
      errMsg: null
    }
  },

  getFailureData(errMsg, data) {
    return {
      success: false,
      data: data,
      errMsg: errMsg
    }
  },

  getTableName(dataType) {
    let tableName = ''
    switch (dataType) {
      case '1':
        tableName = 't_medical'
        break
      case '2':
        tableName = 't_healthy'
        break
      default:
        tableName = 't_medical'
    }
    return tableName
  },

  getModelName(dataType) {
    let modelName = ''
    switch (dataType) {
      case '1':
        modelName = 'Medical'
        break
      case '2':
        modelName = 'Healthy'
        break
      default:
        modelName = 'Medical'
    }
    return modelName
  },

  distinctArray(array) {
    return Array.from(new Set(array))
  }
}
