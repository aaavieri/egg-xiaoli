'use strict'

const Controller = require('egg').Controller

class ApiController extends Controller {
  async getDictionary() {
    const dictionaryData = await this.ctx.model.Dictionary.findAll({
      attributes: [ 'tableName', 'columnName', 'value', 'name', 'displayOrder', 'delFlag' ]
    })
    const tableSet = new Set()
    dictionaryData.forEach(item => {
      tableSet.add(item.tableName)
    })
    const columnData = await this.ctx.informationModel.Column.findAll({
      attributes: [ 'columnName', 'columnComment', 'ordinalPosition' ],
      order: [
        [{ model: this.ctx.informationModel.Table }, 'tableName', 'ASC' ],
        [ 'ordinalPosition', 'ASC' ]
      ],
      where: {
        tableName: Array.from(tableSet)
      },
      include: {
        attributes: [ 'tableName', 'tableComment' ],
        model: this.ctx.informationModel.Table
      }
    })
    const retData = {}
    dictionaryData.forEach(dictRecord => {
      const columnRecord = columnData.find(columnRecord => {
        return columnRecord.table.tableName === dictRecord.tableName && columnRecord.columnName === dictRecord.columnName
      })
      const { columnComment, ordinalPosition, table: { tableComment } } = columnRecord
      const { categoryName, value, columnName } = dictRecord
      const mergeRecord = Object.assign({}, dictRecord.dataValues, {
        columnComment,
        ordinalPosition,
        tableComment,
        categoryName,
        value: columnName === 'type_id' ? value : Number(value)
      })
      if (!retData[categoryName]) {
        retData[categoryName] = []
      }
      retData[categoryName].push(mergeRecord)
    })
    Object.keys(retData).forEach(key => {
      retData[key] = retData[key].sort((item1, item2) => {
        const displaySort = item1.displayOrder - item2.displayOrder
        if (key === 'type_id') {
          return displaySort
        }
        return displaySort !== 0 ? displaySort : (item1.value - item2.value)
      })
    })
    this.ctx.body = this.ctx.helper.getSuccessData(retData)
  }

  async addDictionary() {
    const { dataType, type: columnName, value } = this.ctx.params
    const modelName = this.ctx.helper.getModelName(dataType)
    const tableName = this.ctx.helper.getTableName(dataType)
    const { name, displayOrder = 0 } = this.ctx.request.body
    const { userId } = this.ctx.session.userInfo
    const results = await this.ctx.model[modelName].create({
      tableName, columnName, value, name, displayOrder,
      createUser: userId,
      createTime: this.app.Sequelize.fn('sysdate'),
      updateUser: userId,
      updateTime: this.app.Sequelize.fn('sysdate'),
      rowVersion: 1
    })
    this.ctx.body = this.ctx.helper.getSuccessData(results)
  }

  async getColumnInfo() {
    const dataType = this.ctx.params.dataType
    const tableName = this.ctx.helper.getTableName(dataType)
    const columnData = await this.ctx.model.ColumnInfo.findAll({ tableName })
    const retData = columnData.map(record => {
      const retRecord = Object.assign({}, record.dataValues)
      retRecord.columnName = this.ctx.helper.underLineToHump(record.columnName)
      return retRecord
    })
    this.ctx.body = this.ctx.helper.getSuccessData(retData)
  }

  async getDataByType() {
    const dataType = this.ctx.params.dataType
    const modelName = this.ctx.helper.getModelName(dataType)
    const productData = await this.ctx.model[modelName].findAll()
    this.ctx.body = this.ctx.helper.getSuccessData(productData)
  }

  async getRecord() {
    const { dataType, serial } = this.ctx.params
    const modelName = this.ctx.helper.getModelName(dataType)
    const record = await this.ctx.model[modelName].findOne({
      where: { serial }
    })
    this.ctx.body = this.ctx.helper.getSuccessData(record)
  }

  async updateRecord() {
    const { dataType, serial } = this.ctx.params
    const rowData = this.ctx.request.body.rowData
    const rowVersion = rowData.rowVersion
    rowData.rowVersion = rowVersion + 1
    rowData.updateUser = this.ctx.session.userInfo.userId
    rowData.updateTime = this.app.Sequelize.fn('sysdate')
    delete rowData.serial
    const modelName = this.ctx.helper.getModelName(dataType)
    // TODO to be test
    const results = await this.ctx.model[modelName].update(rowData, {
      where: { serial, rowVersion }
    })
    this.ctx.body = this.ctx.helper.getSuccessData(results)
  }

  async deleteRecord() {
    const { dataType, serial } = this.ctx.params
    const rowVersion = this.ctx.request.body.rowVersion
    const modelName = this.ctx.helper.getModelName(dataType)
    const updateData = {
      rowVersion: rowVersion + 1,
      updateUser: this.ctx.session.userInfo.userId,
      updateTime: this.app.Sequelize.fn('sysdate'),
      delFlag: true
    }
    // TODO to be test
    const results = await this.ctx.model[modelName].update(updateData, {
      where: { serial, rowVersion }
    })
    this.ctx.body = this.ctx.helper.getSuccessData(results)
  }

  async addRecord() {
    const dataType = this.ctx.params.dataType
    const rowData = this.ctx.request.body.rowData
    const { typeId: prefix = '' } = rowData
    rowData.createUser = this.ctx.session.userInfo.userId
    rowData.createTime = this.app.Sequelize.fn('sysdate')
    rowData.updateUser = this.ctx.session.userInfo.userId
    rowData.updateTime = this.app.Sequelize.fn('sysdate')
    const modelName = this.ctx.helper.getModelName(dataType)
    const tableName = this.ctx.helper.getTableName(dataType)

    const Sequelize = this.app.Sequelize
    const transaction = await Sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED })
    try {
      const { sequenceNumber, rowVersion } = await this.ctx.model.Sequence.findOne({
        attributes: [ 'sequenceNumber', 'rowVersion' ],
        where: { tableName, prefix }
      })
      await this.ctx.model.Sequence.update({
        sequenceNumber: sequenceNumber + 1,
        rowVersion: rowVersion + 1,
        updateUser: this.ctx.session.userInfo.userId,
        updateTime: this.app.Sequelize.fn('sysdate')
      }, {
        where: { tableName, prefix, rowVersion }
      })
      rowData.serial = prefix + this.ctx.helper.leftPad(sequenceNumber, 3)
      await this.ctx.model[modelName].create(rowData)
      transaction.commit()
    } catch (err) {
      transaction.rollback()
      this.ctx.body = this.ctx.helper.getFailureData('添加失败', err)
      return
    }
    this.ctx.body = this.ctx.helper.getSuccessData(rowData.serial)
  }

  async getSerial() {
    const { dataType, prefix } = this.ctx.params
    const tableName = this.ctx.helper.getTableName(dataType)

    const Sequelize = this.app.Sequelize
    const transaction = await Sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED })
    try {
      const { sequenceNumber, rowVersion } = await this.ctx.model.Sequence.findOne({
        attributes: [ 'sequenceNumber', 'rowVersion' ],
        where: { tableName, prefix }
      })
      await this.ctx.model.Sequence.update({
        sequenceNumber: sequenceNumber + 1,
        rowVersion: rowVersion + 1,
        updateUser: this.ctx.session.userInfo.userId,
        updateTime: this.app.Sequelize.fn('sysdate')
      }, {
        where: { tableName, prefix, rowVersion }
      })
      transaction.commit()
      const serial = prefix + this.ctx.helper.leftPad(sequenceNumber, 3)
      this.ctx.body = this.ctx.helper.getSuccessData(serial)
    } catch (err) {
      transaction.rollback()
      this.ctx.body = this.ctx.helper.getFailureData('添加失败', err)
    }
  }

  // 商品相关
  async getGoodsList() {
    const goodsData = await this.ctx.model.MallGoods.findAll({
      include: {
        required: false,
        attributes: [ 'id', 'name', 'url', 'localFlag', 'rowVersion' ],
        model: this.ctx.model.MallPicture
      }
    })
    this.ctx.body = this.ctx.helper.getSuccessData(goodsData)
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
