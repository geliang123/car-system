# 运用技术栈 测试远端推送是否成功 21 次

`react v16.8 + webpack v4.x+ react-router-dom v5.0.0 + babel v7 + antd`

# 环境目录

`env`

# 安装

`npm install`

# 运行(开发模式)

`npm run start || npm run dev`

`env==development react-hot-loader热更新`

# 构建

`npm run build:dev` 查看打包大小

`npm run build:prod`

`env==production 打包在dist 目录下`

# 创建容器

`npm run ctc [containerName]`.

会自动添加相应文件夹和路由

注意 containerName 首字母必须大写，例如： npm run ctc Test

# 别名

- ~代表./src
- @代表./src/component

# 热更新

引入 `import { hot } from 'react-hot-loader/root'`

添加 @hot 装饰器
