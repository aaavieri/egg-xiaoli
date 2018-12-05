'use strict'

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
    // const { host, port, username, password } = this.app.config.sequelize
    // const sequelizeInformationSchema = new Sequelize('information_schema', username, password, {
    //   host,
    //   port,
    //   dialect: 'mysql',
    //   operatorsAliases: false,
    //
    //   pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    //   }
    // })
    // this.app.sequelizeInformationSchema = sequelizeInformationSchema
    //
    // this.app.informationModel = {}
    // Object.keys(informationModel).forEach(key => {
    //   if (typeof informationModel[key] === 'function') {
    //     this.app.informationModel[this.getInformationModelKey(key)] = informationModel[key](this.app)
    //   }
    // })
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.
  }

  async beforeClose() {
    // Do some thing before app close.
  }

  getInformationModelKey(key) {
    return key.slice(0, 1).toLocaleUpperCase() + key.slice(1, key.length)
  }
}

module.exports = AppBootHook
