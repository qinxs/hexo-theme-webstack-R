# hexo-theme-webstack-R

hexo-theme-webstack-Refactor 重构版

> 使用了[ hexo-theme-webstack ](https://github.com/HCLonely/hexo-theme-webstack/)的UI和配置文件
>
> 其余所有代码完全重写

示例地址：https://nav.7bxing.com


## 改动内容

- 去掉大部分js和css依赖，使网站加载更快
- 增加站内 `Card` 搜索，支持拼音
- 代码解构，dom优化
- UI多处细节优化
- 搜索引擎图标使用阿里字体图标
- 将 `menu`、`links` 单独放在 `根目录\source\_data` 文件夹下，便于维护


## 第三方库及功能

- [font awesome](https://fontawesome.com.cn/)：字体图标
- [pinyin-match](https://github.com/xmflswood/pinyin-match)：`Card` 搜索，支持拼音
- [lozad](https://apoorv.pro/lozad.js/)：图片懒加载
- [SmoothScroll](https://github.com/iamdustan/smoothscroll)：平滑滚动（主要是兼容 safari）
- [busuanzi](http://busuanzi.ibruce.info/)：卜算子 uv、pv 统计


## 致谢
[hexo](https://hexo.io/zh-cn/) | 
[vercel](https://vercel.com/dashboard) | 
[hexo-theme-webstack](https://github.com/HCLonely/hexo-theme-webstack/) | 
[字节跳动静态资源公共库](https://cdn.bytedance.com/)
