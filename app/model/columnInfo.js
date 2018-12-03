'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize

  const ColumnInfo = app.model.define('columnInfo', {
    tableName: { type: STRING(30), primaryKey: true, field: 'table_name' },
    columnName: { type: STRING(30), primaryKey: true, field: 'column_name' },
    label: STRING(70),
    fixed: INTEGER,
    listDisplay: { type: BOOLEAN, field: 'list_display' },
    editDisplay: { type: BOOLEAN, field: 'edit_display' },
    editable: BOOLEAN,
    dataType: { type: STRING(10), field: 'data_type' },
    listDisplayPosition: { type: INTEGER, field: 'list_display_position' },
    order: INTEGER,
    nullable: BOOLEAN,
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
    tableName: 't_column_info'
  })

  return ColumnInfo
}
