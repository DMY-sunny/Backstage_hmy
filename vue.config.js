const path = require('path')
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = {
    outputDir: 'dist',
    lintOnSave: true,
    baseUrl: './',
    // 是否为生产环境构建生成 source map
    productionSourceMap: false,
    chainWebpack: config => {
        config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
        //const svgRule = config.module.rule('svg')
        //svgRule.uses.clear()
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/icons')) //处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
    configureWebpack: config => {
        config.externals = {
            jquery: 'jQuery',
            // jqprint:'jqprint'
        }
    },
    devServer: {
        port: 80,
        disableHostCheck: true,
        // proxy: 'http://biu.test.dfs800.com/',//开发-测试环境域名
        // proxy: 'http://haowenzhi.test.dfs800.com/',//开发-测试环境域名
        proxy:'http://ems.test.dfs800.com/',//正式-测试环境域名 QA
        // proxy: 'http://ems.dfs800.com/'//正式环境域名
    }
}