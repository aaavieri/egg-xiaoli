'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const Sequence = app.model.define('sequence', {
    tableName: { type: STRING(30), field: 'table_name', primaryKey: true },
    prefix: { type: STRING(5), primaryKey: true },
    sequenceNumber: { type: INTEGER, field: 'sequence_number' },
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
    tableName: 't_sequence'
  })
  return Sequence
}
