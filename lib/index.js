'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _class);

    var def = {
      replace:{

      },
      list:[

      ]
    };

    this.setting = Object.assign({}, def, c);
    var setting=this.setting;
    //小程序配置文件生成
    var fileProject_json = './dist/project.config.json';
    fs.exists(fileProject_json, function(exists) {//判断文件是否存在
      if(!exists){//不存在
        var data = JSON.parse(fs.readFileSync('./project.config.json', 'utf8'));
        if(setting.config){
          data={
            ...data,
            ...setting.config
          }
        }
        fs.writeFileSync(fileProject_json, JSON.stringify(data))
      }
      function setProjectFile() {
        for(var i in setting.list){
          mkdirsSync('./'+setting.list[i].folder)//创建文件夹
          var data = JSON.parse(fs.readFileSync('./dist/project.config.json', 'utf8'));
          if(setting.list[i].config){
            data={
              ...data,
              ...setting.list[i].config
            }
          }
          fs.writeFileSync('./'+setting.list[i].folder+'/project.config.json', JSON.stringify(data))//写入文件
        }
      }
      setProjectFile();
      fs.watch(fileProject_json, function (event, filename) {//监听文件
        if(event=='change'){
          setProjectFile();
        }
      })
    })
    //小程序配置文件生成end
  }
  _class.prototype.apply = function apply(op) {

    var setting = this.setting;
    //if(new RegExp('\.(wxss|wxml|json|js|json)$').test(op.file)){//验证文件后缀
    if(op.code){
      var filecode=[];
      for(var i=0;i<setting.list.length;i++){//循环项目个数
        var mkdirsName=op.file.replace('dist',setting.list[i].folder).split('\\');//替换文件夹
        mkdirsName.pop()//删除文件名称
        mkdirsName=mkdirsName.join('\\')//转换成文件夹路径
        mkdirsSync(mkdirsName)//创建文件夹
        //替换dist以外项目文件内容
        for(var j in setting.list[i].replace){//替换字符串
          filecode[i]=op.code.replace(setting.list[i].replace[j],j)//替换字符串
        }
        fs.writeFileSync(op.file.replace('dist',setting.list[i].folder), filecode[i]);//写入文件
      }
      //替换dist目录文件内容
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
