'use strict'

const Controller = require('egg').Controller

class UsersController extends Controller {

  async login() {
    const { userId, password } = this.ctx.request.body
    let success = false
    const rowData = await this.ctx.model.User.find({
      where: {
        userId
      }
    })
    if (rowData && rowData.userPass === password) {
      this.ctx.session.userInfo = { userId }
      success = true
    }
    this.ctx.body = {
      success: success,
      loginError: !success,
      data: null,
      errMsg: success ? null : '用户名或密码错误，请重新输入'
    }
  }

  async modifyPassword() {
    if (!this.ctx.session.userInfo) {
      this.ctx.body = {
        success: false,
        loginError: true,
        data: null,
        errMsg: '您尚未登录，请前往登录页面登录'
      }
      return
    }
    const { userId, userPass } = await this.ctx.model.User.find({
      where: {
        userId: this.ctx.session.userInfo.userId
      }
    })
    const { password, newPassword } = this.ctx.request.body
    if (password !== userPass) {
      this.ctx.body = {
        success: false,
        loginError: true,
        data: null,
        errMsg: '现密码不正确，请重新输入'
      }
      return
    }
    await this.ctx.model.User.update({
      userPass: newPassword,
      updateUser: userId,
      updateTime: this.app.Sequelize.fn('sysdate'),
      rowVersion: this.app.Sequelize.literal('`row_version` + 1')
    }, {
      where: {
        userId
      }
    })
    this.ctx.body = this.ctx.helper.getSuccessData({})
  }

  async logout() {
    this.ctx.session.userInfo = null
    this.ctx.body = this.ctx.helper.getSuccessData({})
  }

  async checkLogin() {
    let success = false
    if (!this.ctx.session.userInfo) {
      success = true
    }
    this.ctx.body = {
      success: success,
      data: null,
      errMsg: success ? null : '您尚未登录，请前往登录页面登录'
    }
  }
}

module.exports = UsersController
