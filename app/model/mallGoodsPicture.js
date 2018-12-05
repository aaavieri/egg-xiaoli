'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const MallGoodsPicture = app.model.define('mallGoodsPicture', {
    goodsId: { type: INTEGER, field: 'goods_id', primaryKey: true },
    pictureId: { type: INTEGER, field: 'picture_id', primaryKey: true },
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
    tableName: 't_mall_goods_picture'
  })

  return MallGoodsPicture
}
