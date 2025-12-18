const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 新增：代理配置（解决跨域 + 后端地址映射）

//  publicPath: process.env.NODE_ENV === 'production'
//     ? '/data-visualization15/'  // ⚠️ 改这里！
//     : '/',
publicPath: process.env.NODE_ENV === 'production'
  ? './'  // ⚠️ 改成这个！去掉斜杠
  : '/',
  devServer: {
    proxy: {
      // 匹配所有以 "/one" 开头的前端请求（对应后端 /one 路由前缀）
      '/one': {
        target: 'http://localhost:8888', // 后端服务真实地址（端口 8888，必须和后端一致）
        changeOrigin: true, // 允许跨域（关键配置，模拟前端请求来自后端域名）
        ws: true, // 支持 WebSocket（可选，不影响当前图表功能）
        pathRewrite: {
          '^/one': '/one' // 路径重写（当前无需修改，因为前端请求 /one 正好对应后端 /one 前缀）
        }
      },
      // 可选：如果后续要对接 /two /three 等路由，直接在这里添加相同格式配置
      '/two': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        ws: true
      },
      '/three': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        ws: true
      },
      
    }
  }
})