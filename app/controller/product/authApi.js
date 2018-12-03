'use strict'

const Controller = require('egg').Controller

class AuthApiController extends Controller {
  async getShareData() {
    const healthyPromise = this.ctx.model.Healthy.findAll()
    const medicalPromise = this.ctx.model.Medical.findAll()
    const userPromise = this.ctx.model.User.find({
      where: {
        userId: this.ctx.session.userInfo.userId
      }
    })
    const [ healthyData, medicalData, { settings: userSettings }] = await Promise.all([ healthyPromise, medicalPromise, userPromise ])
    const productData = healthyData.map(item => Object.assign({ tableName: 't_healthy' }, item.dataValues))
      .concat((medicalData).map(item => Object.assign({ tableName: 't_medical' }, item.dataValues)))
    productData.forEach(record => {
      record.createTime = record.createTime.getTime()
      record.updateTime = record.updateTime.getTime()
    })
    this.ctx.body = this.ctx.helper.getSuccessData({
      userSettings,
      productData
    })
  }

  async saveSettings() {
    const { userId } = this.ctx.session.userInfo
    const { settings } = this.ctx.request.body
    await this.ctx.model.User.update({
      settings,
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

  async clearSettings() {
    const { userId } = this.ctx.session.userInfo
    await this.ctx.model.User.update({
      settings: null,
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
}

module.exports = AuthApiController
