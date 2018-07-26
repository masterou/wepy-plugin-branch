'use strict';
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
// 递归创建目录 异步方法
function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      // console.log(path.dirname(dirname));
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
        console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
      });
    }
  });
}
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
var _class = function () {
  function _class() {
    var path = require('path')


    console.log('dd', path.resolve(__dirname, '../dir'))
    this.filePath=__dirname;

    var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var def = {
      replace:{

      },
      list:[

      ]
    };

    this.setting = Object.assign({}, def, c);
    var setting=this.setting;
    //小程序配置文件生成
    var fileProject_json = 'project.config.json';
    for(var i in setting.list){
      fs.writeFileSync('./'+setting.list[i].folder+'/_wepylogs.js', 'console.log(\'WePY开启错误监控\');')//写入文件
    }
    fs.exists('./dist/'+fileProject_json, function(exists) {//判断文件是否存在
      if(!exists){//不存在
        var data = JSON.parse(fs.readFileSync('./project.config.json', 'utf8'));
        if(setting.config){
          data={
            ...data,
            ...setting.config
          }
        }
        fs.writeFileSync('./dist/'+fileProject_json, JSON.stringify(data))
      }
      function setProjectFile() {
        for(var i in setting.list){
          mkdirsSync('./'+setting.list[i].folder)//创建文件夹
          var data = JSON.parse(fs.readFileSync('./dist/'+fileProject_json, 'utf8'));
          if(setting.list[i].config){
            data={
              ...data,
              ...setting.list[i].config
            }
          }
          fs.writeFileSync('./'+setting.list[i].folder+'/'+fileProject_json, JSON.stringify(data))//写入文件

        }


      }
      setProjectFile();
      fs.watch('./dist/'+fileProject_json, function (event, filename) {//监听文件
        if(event=='change'){
          setProjectFile();
        }
      })
    })
    //小程序配置文件生成end


  }
  _class.prototype.apply = function apply(op) {
    console.log("名称",op.file)
    var setting = this.setting;
    //if(new RegExp('\.(wxss|wxml|json|js|json)$').test(op.file)){//验证文件后缀
    if(op.code||new RegExp('\.(wxss|wxml|json|js|json)$').test(op.file)){
      var filecode=[];
      for(var i=0;i<setting.list.length;i++){//循环项目个数
        var mkdirsName=op.file.replace('dist',setting.list[i].folder).split('\\');//替换文件夹
        mkdirsName.pop()//删除文件名称
        mkdirsName=mkdirsName.join('\\')//转换成文件夹路径
        mkdirsSync(mkdirsName)//创建文件夹
        //替换dist以外项目文件内容
        filecode[i]=op.code;
        for(var j in setting.list[i].replace){//替换字符串
          console.log(setting.list[i].replace[j])
          filecode[i]=filecode[i].replace(setting.list[i].replace[j],j)//替换字符串
        }

        filecode[i]= filecode[i].replace(/<block[^>]+project="([\w\W]*?)"\s*[^>]*>([\w\W]*?)<\/block>/ig,function ($1,$2,$3) {
          var name = setting.list[i].name;
          if(eval($2)){
            return $1.replace(/<block\s*[^>]*>([\w\W]*?)<\/block>/ig,'$1')
          }else{
            return '';
          }
        })
        filecode[i]=filecode[i].replace(/<block[^>]+project="([\w\W]*?)"\s*[^>]*>([\w\W]*?)<\/block>/ig,'')

        fs.writeFileSync(op.file.replace('dist',setting.list[i].folder), filecode[i]);//写入文件
      }
      //替换dist目录文件内容
      op.code=op.code.replace(/:::([\w\W]*?){([\w\W]*?):::end{}}/ig,'')
      op.code= op.code.replace(/<block[^>]+project="([\w\W]*?)"\s*[^>]*>([\w\W]*?)<\/block>/ig,function ($1,$2,$3) {
        var name = setting.name;
        if(eval($2)){
          return $1.replace(/<block\s*[^>]*>([\w\W]*?)<\/block>/ig,'$1')
        }else{
          return '';
        }
      })
      op.code=op.code.replace(/<block[^>]+project="([\w\W]*?)"\s*[^>]*>([\w\W]*?)<\/block>/ig,'')
      for(var j in setting.replace){
        op.code=op.code.replace(setting.replace[j],j)//替换dist目录下文件字符串
      }
    } else {
      for(var i=0;i<setting.list.length;i++) {
        var mkdirsName=op.file.replace('src',setting.list[i].folder).split('\\');//替换文件夹
        mkdirsName.pop()//删除文件名称
        mkdirsName=mkdirsName.join('\\')//转换成文件夹路径
        mkdirsSync(mkdirsName)//创建文件夹
        console.log(mkdirsName)
        fs.writeFileSync(op.file.replace('src',setting.list[i].folder), fs.readFileSync(op.file));
      }
    }
    op.output && op.output({
      action: '变更',
      file: op.file
    });
    op.next();
  };

  return _class;
}();

exports.default = _class;
