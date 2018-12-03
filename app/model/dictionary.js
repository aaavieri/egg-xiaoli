'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const Dictionary = app.model.define('dictionary', {
    tableName: { type: STRING(30), primaryKey: true, field: 'table_name' },
    columnName: { type: STRING(30), primaryKey: true, field: 'column_name' },
    value: { type: STRING(10), primaryKey: true },
    name: STRING(45),
    displayOrder: { type: INTEGER, field: 'display_order' },
    delFlag: { type: BOOLEAN, field: 'del_flag' },
    createTime: { type: DATE, field: 'create_time' },
    createUser: { type: STRING(10), field: 'create_user' },
    updateTime: { type: DATE, field: 'update_time' },
    updateUser: { type: STRING(10), field: 'update_user' },
    rowVersion: { type: INTEGER, field: 'row_version' }
  }, {
    defaultScope: {
      where: {
        delFlag: false
      }
    },
    timestamps: false,
    tableName: 't_dictionary'
  })
  return Dictionary
}
