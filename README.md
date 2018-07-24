# wepy框架branch插件

## 安装

```
npm install wepy-plugin-branch --save-dev
```

## 配置`wepy.config.js`

```
module.exports.plugins = {
    'branch': {
      config:{//默认dist小程序配置
        "appid": "appid",//appid
        "projectname": "branch",//显目名称
      },
      replace:{//默认dist替换 dist不可更改
        'plin.cc':/__http__/ig,//替换内容:正则匹配
      },
      list:[//生成多个小程序
        {
          folder:'dists/yydr',//子项目打包目录
          replace:{
            'www.plin.cc':/__http__/ig,//替换内容:正则匹配
          },
          config:{//小程序配置
            "appid": "appid",//appid
            "projectname": "branch",//显目名称
          }
        }
    },
};
```


## 参数说明

根据配置生成多个小程序，合并小程序共同部分高效率开发与维护

