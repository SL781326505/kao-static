const path = require('path')
const Koa = require('koa')
const static = require('koa-static')
const httpProxyMiddleware = require('http-proxy-middleware')
const koaConnect = require('koa2-connect')

const app = new Koa()

app.use(static(path.join(__dirname, 'dist')))

const proxy = function (context, options) {
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  return async function (ctx, next) {
    await koaConnect(httpProxyMiddleware(context, options))(ctx, next)
  }
}

const proxyTable = {
  '/api': {
    target: 'http://localhost:3333',
    changeOrigin: true
  }
}

Object.keys(proxyTable).map(context => {
  const options = proxyTable[context]
  app.use(proxy(context, options))
})

app.listen(3001, () => console.log('3001'))