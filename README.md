# 流付

## 项目描述
> 实现流支付功能

## 本地环境配置
> 本地搭建后端环境每次生成adress不同，需替换前端utils/*instance.js中的adress

## 项目准备
- node环境（ >= 8 的最新LTS版本 ）
- vue

## 安装与启动
- `npm install`
- `npm run dll`
- `npm start`

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

