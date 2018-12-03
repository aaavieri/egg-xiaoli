'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/product/authApi/getShareData', controller.product.authApi.getShareData)
  router.post('/product/authApi/saveSettings', controller.product.authApi.saveSettings)
  router.post('/product/authApi/clearSettings', controller.product.authApi.clearSettings)

  router.get('/product/api/getDictionary', controller.product.api.getDictionary)
  router.get('/product/api/getColumnInfo', controller.product.api.getColumnInfo)
  router.get('/product/api/getDataByType/:dataType', controller.product.api.getDataByType)
  router.get('/product/api/getData', controller.product.api.getData)

  router.post(/[^\/]+\/users\/login/, controller.common.users.login)
  router.post(/[^\/]+\/users\/modifyPassword/, controller.common.users.modifyPassword)
  router.post(/[^\/]+\/users\/logout/, controller.common.users.logout)
  router.post(/[^\/]+\/users\/checkLogin/, controller.common.users.checkLogin)

  router.get('/backend/api/getDictionary', controller.backend.api.getDictionary)
}
