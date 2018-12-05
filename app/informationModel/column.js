'use strict'

module.exports = app => {
  const { STRING, ENUM, INTEGER, BIGINT, TEXT } = app.Sequelize

  const bizSchema = app.config.sequelize.datasources.find(datasource => datasource.alias === 'biz').database

  const Column = app.informationModel.define('column', {
    tableCatalog: { type: STRING(64), field: 'TABLE_CATALOG' },
    tableSchema: {
      type: STRING(64),
      field: 'TABLE_SCHEMA'
    },
    tableName: {
      type: STRING(64),
      field: 'TABLE_NAME'
    },
    columnName: { type: STRING(64), field: 'COLUMN_NAME' },
    ordinalPosition: { type: INTEGER, field: 'ORDINAL_POSITION' },
    columnDefault: { type: TEXT, field: 'COLUMN_DEFAULT' },
    isNullable: { type: STRING(3), field: 'IS_NULLABLE' },
    dataType: { type: TEXT, field: 'DATA_TYPE' },
    characterMaximumLength: { type: BIGINT, field: 'CHARACTER_MAXIMUM_LENGTH' },
    characterOctetLength: { type: BIGINT, field: 'CHARACTER_OCTET_LENGTH' },
    numericPrecision: { type: BIGINT, field: 'NUMERIC_PRECISION' },
    numericScale: { type: BIGINT, field: 'NUMERIC_SCALE' },
    datetimePrecision: { type: INTEGER, field: 'DATETIME_PRECISION' },
    characterSetName: { type: STRING(64), field: 'CHARACTER_SET_NAME' },
    collationName: { type: STRING(64), field: 'COLLATION_NAME' },
    columnType: { type: TEXT, field: 'COLUMN_TYPE' },
    columnKey: { type: ENUM('', 'PRI', 'UNI', 'MUL'), field: 'COLUMN_KEY' },
    extra: { type: STRING(57), field: 'EXTRA' },
    privileges: { type: STRING(154), field: 'PRIVILEGES' },
    columnComment: { type: TEXT, field: 'COLUMN_COMMENT' },
    generationExpress: { type: TEXT, field: 'GENERATION_EXPRESSION' },
    srsId: { type: INTEGER, field: 'SRS_ID' }
  }, {
    defaultScope: {
      where: {
        tableSchema: bizSchema
      }
    },
    timestamps: false,
    tableName: 'COLUMNS'
  })

  Column.removeAttribute('id')
  Column.associate = () => {
    app.informationModel.Column.belongsTo(app.informationModel.Table, { targetKey: 'tableName', foreignKey: 'tableName' })
  }
  return Column
}
