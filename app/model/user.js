'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, BOOLEAN } = app.Sequelize

  const User = app.model.define('user', {
    userId: { type: STRING(10), primaryKey: true, field: 'user_id' },
    userPass: { type: STRING(50), field: 'user_pass' },
    settings: TEXT,
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
    tableName: 't_user'
  })
  return User
}
