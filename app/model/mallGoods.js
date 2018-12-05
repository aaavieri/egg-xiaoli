'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, DECIMAL, TEXT } = app.Sequelize

  const MallGoods = app.model.define('mallGoods', {
    id: { type: INTEGER, primaryKey: true },
    serial: STRING(7),
    name: STRING(45),
    typeId: { type: STRING(5), field: 'type_id' },
    price: DECIMAL(7, 2),
    coverPicId: { type: INTEGER, field: 'cover_pic_id' },
    introduction: TEXT,
    // TODO key用attributes的话居然Sequelize初始化的时候会报错，猜测attributes可能是它的关键字
    goodsAttributes: { type: TEXT, field: 'attributes' },
    faqs: TEXT,
    outFlag: { type: BOOLEAN, field: 'out_flag' },
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
    tableName: 't_mall_goods'
  })

  MallGoods.associate = () => {
    app.model.MallGoods.belongsToMany(app.model.MallPicture, {
      through: {
        model: app.model.MallGoodsPicture
      },
      foreignKey: 'goods_id',
      otherKey: 'picture_id'
    })
  }

  return MallGoods
}
