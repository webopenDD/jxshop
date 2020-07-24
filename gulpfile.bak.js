// 引入GULP模块
const gulp = require('gulp')

// 开发调试用 =========================
const { createProxyMiddleware } = require('http-proxy-middleware')
const server = require('browser-sync').create(); 
const watch = require('gulp-watch'); 

gulp.task('serve', function() {
    server.init({
        // server:'./src',
        server: {
            baseDir: './src',
            middleware: [

                // target http://ip.taobao.com/outGetIpInfo
                // url    /api?ip=122.192.9.122&accessKey=alibaba-inc
                // target + url  http://ip.taobao.com/outGetIpInfo/api?ip=122.192.9.122&accessKey=alibaba-inc
                // pathRewrite replace /api替换掉了 http://ip.taobao.com/outGetIpInfo?ip=122.192.9.122&accessKey=alibaba-inc

                createProxyMiddleware('/api', {
                    // 目标服务器网址
                    target: "http://ip.taobao.com/outGetIpInfo",
                    changeOrigin: true, // 是否允许跨域
                    secure: false,      // 关闭SSL证书验证https协议接口需要改成true
                    pathRewrite: {      // 重写路径请求
                        // 重写
                        // '^/old/api' : '/new/api'
                        // 移除
                        // '^/remove/api' : ''
                        '^/api' : ''
                        // 添加 
                        // '^/' : '/basepath/'
                    },
                })

            ]
        },
        port: 80
    })
    // 监控文件修改
    watch('src/html/*.html', function() {
        console.log('你修改HTML文件了')
        server.reload()
    })
    watch('src/style/*.css', function() {
        console.log('你修改CSS文件了')
        server.reload()
    }) 
    watch('src/js/*.js', function() {
        console.log('你修改JS文件了')
        server.reload()
    })
})

// 上线打包用 ==========================

const uglify = require('gulp-uglify');  // 压缩JS并去掉注释
const babel = require('gulp-babel');    // 解决ES6兼容问题
const rev = require('gulp-rev');        // 打包文件加随机名 hash名 根据内容
const revCollector = require('gulp-rev-collector'); // 根据JSON数据替换HTML路径
const minifyCss = require('gulp-minify-css');       // 压缩CSS并去掉注释
const imagemin = require('gulp-imagemin');          // 压缩图片
const minifyHtml = require('gulp-minify-html');     // 压缩HTML并去掉注释

// 打包HTML
gulp.task('html', function(done) {
    gulp
        // .src('./src/html/*')
        .src(['./temp/**/*.json','./src/html/*'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
              '../style': '../style',
              '../js': '../js'
            }
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist/html'))
    
    done()
})

// 打包IMAGES
gulp.task('images', function(done) {
    gulp
        .src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
    
        
    setTimeout(() => {
        done()
    }, 30000)
})

// 打包CSS  style
gulp.task('style', function(done){
    gulp
        .src('./src/style/*.css')
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('dist/style'))
        // 后续继续交给管道记录名字方便后期替换 目的后期HTML替换
        .pipe(rev.manifest())
        .pipe(gulp.dest('temp/style'))
    
    done()
})

// 打包JS
gulp.task('js', function(done) {
    gulp
    // .src('./src/js/a.js')
    // .src(['./src/js/a.js', './src/js/b.js'])
    .src('./src/js/*.js')
    .pipe(babel({"presets": ["env"]}))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    // 后续继续交给管道记录名字方便后期替换 目的后期HTML替换
    .pipe(rev.manifest())
    .pipe(gulp.dest('temp/js'))
    
    done()
})

// gulp.task('build', 函数)
gulp.task('build', gulp.series('js', 'style', 'images', 'html', function(){
    console.log('打包成功，可以将dist放到服务器上')
}))