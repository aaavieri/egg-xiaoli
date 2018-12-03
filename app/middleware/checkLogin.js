'use strict'

module.exports = () => {
  return async function checkLogin(ctx, next) {
    if (!ctx.session.userInfo) {
      ctx.body = {
        success: false,
        loginError: true,
        data: null,
        errMsg: '您尚未登录，请前往登录页面登录'
      }
    } else {
      await next()
    }
  }
}
