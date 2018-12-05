'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const MallPicture = app.model.define('mallPicture', {
    id: { type: INTEGER, primaryKey: true },
    name: STRING(100),
    url: STRING(100),
    localFlag: { type: BOOLEAN, field: 'local_flag' },
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
    tableName: 't_mall_picture'
  })

  // MallPicture.associate = () => {
  //   app.model.MallPicture.belongsTo(app.model.MallGoods)
  // }
  MallPicture.associate = () => {
    // app.model.MallPicture.belongsToMany(app.model.MallGoods, {
    //   through: {
    //     model: app.model.MallGoodsPicture
    //   }
    // })
  }

  return MallPicture
}
