'use strict'

const Controller = require('egg').Controller

class ApiController extends Controller {
  async getDictionary() {
    const dictionaryData = await this.ctx.model.Dictionary.findAll()
    const retData = {}
    dictionaryData.forEach(record => {
      const item = Object.assign(record.dataValues)
      item.categoryName = `${item.tableName}-${item.columnName}`
      if (!retData[item.categoryName]) {
        retData[item.categoryName] = []
      }
      if (item.columnName !== 'type_id') {
        item.value = Number(item.value)
      }
      retData[item.categoryName].push(item)
    })
    Object.keys(retData).forEach(key => {
      if (key === 'type_id') {
        return
      }
      retData[key] = retData[key].sort((item1, item2) => {
        return item1.value - item2.value
      })
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
