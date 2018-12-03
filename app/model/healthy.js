'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, DECIMAL, BOOLEAN } = app.Sequelize

  const Healthy = app.model.define('healthy', {
    serial: { type: STRING(7), primaryKey: true },
    name: STRING(30),
    typeId: { type: STRING(5), field: 'type_id' },
    testMethod: { type: INTEGER, field: 'test_method' },
    sampleRequirement: { type: INTEGER, field: 'sample_requirement' },
    sampleTransportCondition: { type: INTEGER, field: 'sample_transport_condition' },
    testCycleMin: { type: INTEGER, field: 'test_cycle_min' },
    testCycleMax: { type: INTEGER, field: 'test_cycle_max' },
    standardCharge: { type: DECIMAL(7, 2), field: 'standard_charge' },
    agentPrice: { type: STRING(45), field: 'agent_price' },
    testIndex: { type: TEXT, field: 'test_index' },
    laboratory: INTEGER,
    detailUrl: { type: STRING(255), field: 'detail_url' },
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
    tableName: 't_healthy'
  })
  return Healthy
}
