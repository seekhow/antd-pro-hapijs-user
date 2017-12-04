## 简介  
基于hapijs+mongoose的rest api server  
在[rjmreis/hapi-api](https://github.com/rjmreis/hapi-api)的基础上改动  

## 使用  
```
npm start -s
```  

## 项目结构  
```
.
├── api/
|   ├── handlers/
|   |   └── home.js   * 示例handlers
|   └── index.js      * api 路由配置
├── config/
|   ├── manifest.js   * hapijs的配置
    ├── config.js     * mongo配置
|   └── secret.js     * 数据库密码
├── models/
    ├── Users.js      * mongoose模型文件
├── plugins/
    ├── mongodb.js    * 基于hapijs的插件配置mongodb
├── test/
|   └── api.js        * 测试文件
├── server.js         * 路由启动
├── auth.js           * 授权验证
└── package.json
```