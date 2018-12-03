'use strict'

const Controller = require('egg').Controller

class ApiController extends Controller {
  async getDictionary() {
    const retData = await this.app.informationModel.Table.findAll({
      attributes: [ 'tableName', 'tableComment' ],
      where: {
        tableSchema: 'xiaoli'
      }
    })
    this.ctx.body = this.ctx.helper.getSuccessData(retData)
  }

  async getColumnInfo() {
    const columnInfo = await this.ctx.model.ColumnInfo.findAll()
    const helper = this.ctx.helper
    const retData = columnInfo.map(record => {
      const item = Object.assign({}, record.dataValues)
      item.columnName = helper.underLineToHump(item.columnName)
      return item
    })
    this.ctx.body = this.ctx.helper.getSuccessData(retData)
  }

  async getDataByType() {
    const dataType = this.ctx.params.dataType
    const modelName = this.ctx.helper.getModelName(dataType)
    const productData = await this.ctx.model[modelName].findAll({
      order: this.app.Sequelize.col('display_order')
    })
    this.ctx.body = this.ctx.helper.getSuccessData(productData)
  }

  async getData() {
    const healthyPromise = this.ctx.model.Healthy.findAll({ order: this.app.Sequelize.col('display_order') })
    const medicalPromise = this.ctx.model.Medical.findAll({ order: this.app.Sequelize.col('display_order') })
    const [ healthyData, medicalData ] = await Promise.all([ healthyPromise, medicalPromise ])
    this.ctx.body = this.ctx.helper.getSuccessData(healthyData.map(item => Object.assign({ tableName: 't_healthy' }, item.dataValues))
      .concat((medicalData).map(item => Object.assign({ tableName: 't_medical' }, item.dataValues))))
  }
}

module.exports = ApiController
