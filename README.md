# 审核系统2.0

## 项目描述
> 为了实现前后端分离，老审核系统的新页面开发逐渐迁移至该项目

## 配置host
> 测试环境账号:用户名:bjadmin, 密码:xinxibu456。
- 默认开启host：127.0.0.1 localhost.jd.com
- 测试环境-前端：10.170.146.2 adq.jd.com
- 测试环境-后端：192.168.143.206 admin.deal-api.jd.com

## 项目准备
- node环境（ >= 8 的最新LTS版本 ）
- xqp拓扑名：qualification_check_system

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
- 测试环境打包：`npm run build:test`
- 预发环境打包：`npm run build`


## 注意事项

### 有关 `npm install` 失败

1. 执行`npm cache verify`或`npm cache clean --force`
2. 重启bash窗口
3. 若项目中生成过`package-lock.json`文件，则把它删除
4. 执行`npm install`

## 项目对接人
- 前端：宇文彬杰(yuwenbinjie)、袁杨(yuanyang12)
- 后端：杨智(yangzhi10)、张晓岚(zhangxiaolan10)、郐洪楠(kuaihongnan)
- 测试：董婷(dongting13)
- 产品：李颖(liying211)
