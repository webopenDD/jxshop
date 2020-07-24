// 1. 引入gulp模块（切记需要npm i gulp
const gulp = require('gulp')

// 2. 创建一个个任务，来帮助我们完成实战开发中经常需要自己做的任务
//    语法：gulp.task（标识，处理函数）
//    运行：gulp 标识
//    留心：默认gulp  相当于gulp default
// 需求：在DOS窗口输入gulp qf打印 webopenfather@qf

// gulp.task('qf', function() {
gulp.task('default', function() {
    console.log('webopenfather@qf')
})

