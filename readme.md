## 简介  
一个带权限管理的用户管理系统  

## 架构  
restful前后端分离架构  
前端：基于ant design pro的Reacr web  
相关文章:[基于ant design pro脚手架+hapi rest api写一个带权限的用户管理功能-front](http://www.seekhow.cn/ji-yu-ant-design-projiao-shou-jia-hapi-rest-apixie-yi-ge-dai-quan-xian-de-yong-hu-guan-li-gong-neng/)  
后端：基于hapijs的rest api server   
相关文章:[基于ant design pro脚手架+hapi rest api写一个带权限的用户管理功能-server](http://www.seekhow.cn/ji-yu-ant-design-projiao-shou-jia-hapi-rest-apixie-yi-ge-dai-quan-xian-de-yong-hu-guan-li-gong-neng-server/)  


## 截图  
用户列表  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-6/9061644.jpg)  
编辑用户  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-7/82116476.jpg)  
增加用户  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-7/83507218.jpg)  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-7/39035910.jpg)  
查询用户  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-7/6937687.jpg)   
删除用户  
![](http://otjjfdfdp.bkt.clouddn.com/17-12-7/52736135.jpg)  



## 登录和验证    
登录是采取token验证的方式  

登录的时候，发送用户名和密码给后端，后端进行验证(这个工程里面没有进行第三方的验证如ldap验证对，只是简单的从数据库中查询了之后验证)   

验证完了之后，如果正确，就通过jsonwebtoken加密用户名和role然后返回给前端，前端拿到之后用jwt-decode模块解析之后，存储在sessionStorage或者localStorage里面，然后以后每次发送请求的时候都在请求头里面加上token，然后后端接收到请求之后先从请求头里面取出token,然后验证，验证成功之后再根据请求内容进行相应的操作和返回  

前端的登录请求
```
export async function fakeAccountLogin(params) {
  return axios.post('http://127.0.0.1:3000/api/login', {
    name: params.userName,
    password: params.password,
  }).then((res) => {
    if (res.status === 200) {
      return res.data;
    } else {
      message.error('登录错误,请检查用户名和密码');
    }
  });
}
```
后端的验证
```
const getToken = function getToken(username, role) {
  return (0, jsonwebtoken.sign)({ username: username, role: role }, config, { expiresIn: '2h' });
};

login: {
    tags: ['api'],
    validate: {
      payload: {
        name: Joi.string(),
        password: Joi.string(),
      },
    },
    handler: (request, reply) => {
      const { name, password } = request.payload;
      try {
        UsersModel.findOne({ name: name, passwd: password })
          .then((doc) => {
            reply({ doc, token: getToken(name, doc.role) }).code(200);
          });
      } catch (e) {
        request.log.error(e);
        reply(Boom.notFound(e.message));
      }
    }
  }
```  

其他请求的发送
```
export async function addUser(params) {
  return axios.post('http://127.0.0.1:3000/api/user', {
    name: params.name,
    passwd: params.passwd,
    role: params.role,
    group: params.group,
    description: params.description,
  }, {
    headers: { Authorization: token },
  }).then((res) => {
    if (res.status === 201) {
      message.success('添加成功');
    } else {
      message.error('权限不足，不能添加和自己权限一样或权限比自己高的用户');
    }
  });
}
```