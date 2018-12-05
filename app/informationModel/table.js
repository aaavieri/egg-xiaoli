'use strict'

module.exports = app => {
  const { STRING, ENUM, INTEGER, DATE, BIGINT } = app.Sequelize

  const bizSchema = app.config.sequelize.datasources.find(datasource => datasource.alias === 'biz').database

  const Table = app.informationModel.define('table', {
    tableCatalog: { type: STRING(64), field: 'TABLE_CATALOG' },
    tableSchema: {
      type: STRING(64),
      field: 'TABLE_SCHEMA'
    },
    tableName: {
      type: STRING(64),
      field: 'TABLE_NAME'
    },
    tableType: { type: ENUM('BASE TABLE', 'VIEW', 'SYSTEM VIEW'), field: 'TABLE_TYPE' },
    engine: { type: STRING(64), field: 'ENGINE' },
    version: { type: INTEGER, field: 'VERSION' },
    rowFormat: { type: ENUM('Fixed', 'Dynamic', 'Compressed', 'Redundant', 'Compact', 'Paged'), field: 'ROW_FORMAT' },
    tableRows: { type: BIGINT, field: 'TABLE_ROWS' },
    avgRowLength: { type: BIGINT, field: 'AVG_ROW_LENGTH' },
    dataLength: { type: BIGINT, field: 'DATA_LENGTH' },
    maxDataLength: { type: BIGINT, field: 'MAX_DATA_LENGTH' },
    indexLength: { type: BIGINT, field: 'INDEX_LENGTH' },
    dataFree: { type: BIGINT, field: 'DATA_FREE' },
    autoIncrement: { type: BIGINT, field: 'AUTO_INCREMENT' },
    createTime: { type: DATE, field: 'CREATE_TIME' },
    updateTime: { type: DATE, field: 'UPDATE_TIME' },
    checkTime: { type: DATE, field: 'CHECK_TIME' },
    tableCollation: { type: STRING(64), field: 'TABLE_COLLATION' },
    checksum: { type: BIGINT, field: 'CHECKSUM' },
    createOptions: { type: STRING(256), field: 'CREATE_OPTIONS' },
    tableComment: { type: STRING(256), field: 'TABLE_COMMENT' }
  }, {
    defaultScope: {
      where: {
        tableSchema: bizSchema
      }
    },
    timestamps: false,
    tableName: 'TABLES'
  })

  Table.removeAttribute('id')
  Table.associate = () => {
    app.informationModel.Table.hasMany(app.informationModel.Column, { sourceKey: 'TABLE_NAME' })
  }
  return Table
}
