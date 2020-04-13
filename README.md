# Checksystem-UI

## 相关文档
https://cf.jd.com/pages/viewpage.action?pageId=188060925   框架文档

## 项目准备
- node环境（ >= 8 的最新LTS版本 ）

## 安装与启动
- `npm install`
- `npm run dll`
- `npm start`

## ESLINT 格式检查
- `npm run lint`
同时检查`src`目录与`tests`目录代码格式
- `npm run lintfix`
同时检查并自动修复`src`目录与`tests`目录代码格式

## GITHOOKS
使用`husky`安装相关的`githooks`，因为`npm install husky@next`时会在当前项目仓库自动安装相关`githooks`，所以要保证当前项目已经初始化了`git`仓库，否则需要重新手动安装`husky`

### 提交前
使用`eslint`校验代码

### 提交代码
- `git commit`
使用`commitlint`检验提交信息，提交时会按照类似`[feature #123] 提交信息`的格式校验

## 打包
- `npm run build`

**更多配置见`build/const.js`相关项**

## webpack 打包分析
- `npm run analyze`
分析业务代码打包情况
- `npm run analyze:dll`
分析组件代码打包情况

## src 结构

```
┌ assets     样式文件、图片字体资源等
| ├ imgs
| ├ scss
| └ ...
├ components 公用组件
├ filters    过滤器
├ router     路由配置文件
├ store      vuex公共存储
├ utils      工具方法
├ views      各路由下的视图vue文件
├ App.vue    应用入口vue文件
├ index.html html模板
└ main.js    入口文件
```

**为了减少引用文件时过多地使用`../`，可以使用`@/views/a`的写法，其中`@`即是`src`**

## JEST 单元测试
- `npm run test`
运行单元测试并输出覆盖率报告

### 单元测试覆盖率
运行单元测试后自动生成coverage目录，用浏览器打开`coverage/Icov-report/index.html`可查看详细信息

## tests 结构

```
┌ conf  单元测试配置文件
└ unit  单元测试文件
```


## 注意事项

### 有关 `npm install` 失败

1. 执行`npm cache verify`或`npm cache clean --force`
2. 重启bash窗口
3. 若项目中生成过`package-lock.json`文件，则把它删除
4. 执行`npm install`
