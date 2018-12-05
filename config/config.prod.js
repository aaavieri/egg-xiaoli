'use strict'

exports.sequelize = {
  datasources: [
    {
      alias: 'info',
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'yinjiaolong',
      database: 'information_schema',
      delegate: 'informationModel',
      baseDir: 'informationModel'
    },
    {
      alias: 'biz',
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'yinjiaolong',
      database: 'xiaoli'
    }
  ]
}

