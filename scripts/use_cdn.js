'use strict';

/*
hexo.extend.console.register('config', 'Display configuration', function(args){
  console.log("args:", args)
  console.log(args._['0'])
  // 控制台: hexo config title
  console.log(hexo.config[args._['0']]);
});
*/

const js = hexo.extend.helper.get('js').bind(hexo);
const css = hexo.extend.helper.get('css').bind(hexo);

const addCdnPath = function (path) {
  // 添加 jsd cdn 前缀
  if (hexo.config.cdn.enable) {
    const checkUrl = (url) => {
      let reg = /^(https?:)?\/\//;
      return reg.test(url) ? url : hexo.config.cdn.pref + url;
    };

    if (typeof path === 'string' || path instanceof String) {
      path = checkUrl(path);
    } else {
      path = path.map(function (el) {
        return checkUrl(el);
      });
    }
  }

  return path;
};

hexo.extend.helper.register('myjs', function (path) {
  // console.log(path)
  path = addCdnPath(path);
  // console.log(path)
  return js(path);
});

hexo.extend.helper.register('mycss', function (path) {
  // console.log(path)
  path = addCdnPath(path);
  // console.log(path)
  return css(path);
});
