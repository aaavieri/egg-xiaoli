'use strict'

const checkLoginRegs = [
  '/authApi/'
].map(pattern => new RegExp(pattern))

module.exports = appInfo => {
  // const config = exports = {}
  const config = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543485814754_1070'

  // add your config here
  config.middleware = [ 'checkLogin' ]
  config.checkLogin = {
    match(ctx) {
      return checkLoginRegs.reduce((previousValue, reg) => {
        return previousValue || reg.test(ctx.path)
      }, false)
    }
  }
  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => ctx.ip === 'localhost' || ctx.ip === '127.0.0.1'
    }
  }
  config.multipart = {
    mode: 'file'
  }

  return config
}
