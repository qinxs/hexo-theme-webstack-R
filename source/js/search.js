// 中文拼音输入中，但未合成汉字
var inputFlag = true;
var searchOriginalValue = '';

const $searchInput = $('.search-input'),
  $searchBox = $('.search-box'),
  $searchBtn = $('.search-btn'),
  $searchHotList = $('.search-hot-list'),
  $cards = document.querySelectorAll('.card'),
  $searchedCards = $('.searched-cards');

var lastMatchedCards = [];

var searchEngines = {
  "必应": {
    icon: "icon-bing",
    url: "https://cn.bing.com/search?q="
  },
  "谷歌": {
    icon: "icon-google",
    url: "https://www.google.com/search?q="
  },
  "百度": {
    icon: "icon-baidu",
    url: "https://www.baidu.com/s?wd="
  },
  "好搜" :{
    icon: "icon-haosou",
    url: "https://www.so.com/s?q="
  },
  "搜狗": {
    icon: "icon-sougou",
    url: "https://www.sogou.com/web?query="
  },
  // 数字开头顺序会改变
  "_1688": {
    icon: "icon-1688",
    url: "https://s.1688.com/selloffer/offer_search.htm?keywords="
  },
  "淘宝": {
    icon: "icon-taobao",
    url: "https://s.taobao.com/search?q="
  },
  "京东": {
    icon: "icon-jingdong",
    url: "http://search.jd.com/Search?keyword="
  },
  "天猫": {
    icon: "icon-tianmao",
    url: "https://list.tmall.com/search_product.htm?q="
  },
  "知乎": {
    icon: "icon-zhihu",
    url: "https://www.zhihu.com/search?type=content&q="
  },
  "微博": {
    icon: "icon-weibo",
    url: "https://s.weibo.com/weibo?q="
  },
  "豆瓣": {
    icon: "icon-douban",
    url: "https://www.douban.com/search?q="
  },
  "B站": {
    icon: "icon-bilibili",
    url: "http://search.bilibili.com/all?keyword="
  },
  "优酷": {
    icon: "icon-youku",
    url: "https://so.youku.com/search_video/q_"
  },
  "GitHub": {
    icon: "icon-github",
    url: "https://github.com/search?utf8=✓&q="
  },
}


const search = {
  searchEngineTimer: null,

  init() {
    $('.search-icon > i').className = 'iconfont ' + config.search.icon;
    $('#hot-keyword').checked = config.search.hotKeyword;
    
    var type = config.search.searchCards
      ? 'search-cards'
      : 'search-engine';
    $searchBtn.setAttribute('role', type);

    this.render();
    
    this.addEventListeners();
  },

  render() {
    var html = [];
    for (let key in searchEngines) {
      html.push(`
        <li value="${key}">
          <i class="iconfont ${searchEngines[key].icon}"></i>
          ${key.replace('_', '')}
        </li>
      `);
    }
    $('.search-engine-list').innerHTML = html.join('');
  },

  changeSearchEngine(searchEngine) {
    config.search.engine = searchEngine;
    config.search.icon = searchEngines[searchEngine].icon;

    $('.search-icon > i').className = 'iconfont ' + config.search.icon;
    localStorage.setItem('search', JSON.stringify(config.search));

    $('.search-engine').classList.remove('active');
  },

  doSearch(searchEngine) {
    event.preventDefault();

    if (!searchEngine) {
      searchEngine = config.search.engine;
    }
    var value = $searchInput.value;
    if (value) {
      window.open(searchEngines[searchEngine].url + value);
    } else {
      $searchInput.focus();
    }
  },

  addEventListeners() {
    $searchIconBtn = $('.search-icon');
    $searchEngine = $('.search-engine');
    $searchEngineList = $('.search-engine-list');

    $('#hot-keyword').addEventListener('click', function() {
      config.search.hotKeyword = this.checked;
      localStorage.setItem('search', JSON.stringify(config.search));
    });

    $searchBtn.addEventListener('click', () => {
      switchSearchType();
    });

    $searchIconBtn.addEventListener('click', () => {
      clearTimeout(this.searchEngineTimer);
      $searchEngine.classList.toggle('active');
    });

    $searchIconBtn.addEventListener('mouseenter', () => {
      clearTimeout(this.searchEngineTimer);
      this.searchEngineTimer = setTimeout(() => {
        $searchEngine.classList.add('active');
      }, 100);
    });
    $searchIconBtn.addEventListener('mouseleave', () => {
      clearTimeout(this.searchEngineTimer);
      this.searchEngineTimer = setTimeout(() => {
        $searchEngine.classList.remove('active');
      }, 100);
    });

    $searchEngine.addEventListener('mouseenter', () => {
      clearTimeout(this.searchEngineTimer);
    });

    $searchEngine.addEventListener('mouseleave', () => {
      this.searchEngineTimer = setTimeout(() => {
        $searchEngine.classList.remove('active');
      }, 100);
    });

    $searchEngineList.addEventListener('click', event => {
      // console.log(event.target);
      var li = event.target.closest('li');
      if (!li) return;

      event.preventDefault();
      var searchEngine = li.getAttribute('value');

      if (event.ctrlKey || event.metaKey) {
        this.doSearch(searchEngine);
      } else {
        this.changeSearchEngine(searchEngine);
      }
    });

    $searchHotList.addEventListener('click', event => {
      var li = event.target.closest('li');
      if (!li) return;

      event.preventDefault();

      $searchInput.value = li.outerText.replace(/\d+ /, '');
      $searchInput.dispatchEvent(new Event('input'));
      $searchHotList.classList.remove('active');
      
      this.doSearch();
    });

    $searchInput.addEventListener('focus', event => {
      if (!config.search.searchCards && config.search.hotKeyword) {
        $searchHotList.classList.add('active');
      }
    });

    $searchInput.addEventListener('blur', event => {
      setTimeout(() => {
        if (!config.search.searchCards && config.search.hotKeyword) {
          $searchHotList.classList.remove('active');
        }
      }, 50);
    });

    $searchInput.addEventListener('compositionstart', () => {
      inputFlag = false;
    });
    $searchInput.addEventListener('compositionend', function(event) {
      inputFlag = true;
      if (config.search.searchCards) {
        if (event.data && this.value.length > event.data.length) {
          searchCards(this.value, true);
        } else {
          searchCards(this.value);
        }
      } else {
        getHotKeyword(this.value);
      }
    });
    $searchInput.addEventListener('input', function(event) {
      // console.log(event);
      if (!inputFlag) return;
      
      if (config.search.searchCards) {
        if (event.data && this.value.length > event.data.length) {
          searchCards(this.value, true);
        } else {
          searchCards(this.value);
        }
      } else {
        getHotKeyword(this.value);
      }
    });
  }
}

// 模拟jquery的ajax 支持jsonp
function ajax(params) {
  params = params || {};
  params.data = params.data || {};
  var json = params.jsonp ? jsonp(params) : json(params);

  // jsonp请求
  function jsonp(params) {
    //创建script标签并加入到页面中
    var callbackName = params.jsonp;
    var callbackFunc = callbackName + '_' + random();
    var head = document.getElementsByTagName('head')[0];
    // 设置传递给后台的回调参数名
    params.data[callbackName] = callbackFunc;
    var data = formatParams(params.data);
    var script = document.createElement('script');
    head.appendChild(script);

    //创建jsonp回调函数
    window[callbackFunc] = function (json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackFunc] = null;
      params.success && params.success(json);
    };

    //发送请求
    script.src = params.url + '?' + data;

    //为了得知此次请求是否成功，设置超时处理
    if (params.time) {
      script.timer = setTimeout(function () {
        window[callbackFunc] = null;
        head.removeChild(script);
        params.error &&
          params.error({
            message: '超时',
          });
      }, time);
    }
  }

  //格式化参数
  function formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }

    // 添加一个随机数，防止缓存
    arr.push('v=' + random());
    return arr.join('&');
  }

  // 获取随机数
  function random() {
    return Math.floor(Math.random() * 10000 + 500);
  }
}

function getHotKeyword(value) {
  if (!config.search.hotKeyword) return;

  searchOriginalValue = value;
  if (!value) {
    $searchHotList.innerHTML = '';
    return;
  }
  ajax({
    type: 'GET',
    url: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su',
    async: true,
    data: {
      wd: value,
    },
    dataType: 'jsonp',
    jsonp: 'cb',
    success: function (res) {
      // console.log(res);
      var html = [],
        hotKeywords = res.s;
      // console.log(hotKeywords);
      if (hotKeywords.length) {
        hotKeywords.forEach((item, index) => {
          html.push(`
            <li>
              <span class="order">${index+1}</span> ${item}
            </li>
          `);
        });
      }
      $searchHotList.innerHTML = html.join('');
    },
    error: function (res) {
      console.log(res);
    },
  });
}

function searchCards(value, searchFromLastResult) {
  $searchedCards.innerHTML = '';
  
  var value = $searchInput.value;

  if (!value) return;

  if (searchFromLastResult) {
    var _lastMatchedCards = lastMatchedCards;
    lastMatchedCards = [];
    _lastMatchedCards.forEach((index) => {
      _searchCard($cards[index], index);
    });
  } else {
    lastMatchedCards = [];
    $cards.forEach((card, index) => {
      _searchCard(card, index);
    });
  }

  function _searchCard(card, index) {
    ['.title', '.description'].some((css) => {
      var text = card.querySelector(css).innerHTML;
      var match = PinyinMatch.match(text, value);
      if (match) {
        lozadObserver.triggerLoad($('.lozad', card));
        
        var clone = card.cloneNode(true);
        clone.querySelector(css).innerHTML = highlight(text, match[0], match[1]);
        $searchedCards.appendChild(clone);
        
        lastMatchedCards.push(index);
        return true;
      }
      return false;
    });

  }

  function highlight(str, start ,end) {
    return str.substring(0, start) + '<b style="color: red">' + str.substring(start, end + 1) + '</b>' + str.substring(end + 1)
  }
}

function switchSearchType() {
  config.search.searchCards = !config.search.searchCards;
  
  var type = config.search.searchCards
    ? 'search-cards'
    : 'search-engine';
  $searchBtn.setAttribute('role', type);

  var value = $searchInput.value;

  if (type == 'search-cards') {
    if (config.search.hotKeyword) {
      $searchHotList.classList.remove('active');
    }

    searchCards(value);
  } else {
    $searchedCards.innerHTML = '';
    getHotKeyword(value);
  }

  // setTimeout(() => {
  //   $searchInput.focus();
  // }, 100);

  localStorage.setItem('search', JSON.stringify(config.search));
}

function hotskeyEvents(event) {
  if (event.isComposing) return;
  
  var keyCode = event.code;
  // console.log(keyCode);

  switch (keyCode) {
    case "Escape":
      if (document.activeElement != $searchInput) {
        $searchInput.focus();
        return;
      }
      if (document.activeElement == $searchInput && $searchInput.value) {
        $searchInput.value = '';
        $searchInput.dispatchEvent(new Event('input'));
        return;
      }
      break;
    case "Enter":
      if (document.activeElement == document.body) {
        $searchInput.focus();
      }
      break;
    case "Tab":
      if ($searchHotList.classList.contains('active')) {
        event.preventDefault();
        var $activeEle = $searchHotList.querySelector('li.active');
        if ($activeEle) {
          $searchInput.dispatchEvent(new Event('input'));
        }
      }
      break;
    case "ArrowUp":
    case "ArrowDown":
      if ($searchHotList.classList.contains('active')) {
        event.preventDefault();
        var $activeEle = $searchHotList.querySelector('li.active');
        if ($activeEle) {
          $activeEle.classList.remove('active');
          var $nextEle = keyCode === 'ArrowDown'
            ? $activeEle.nextElementSibling
            : $activeEle.previousElementSibling;
          if ($nextEle) {
            $nextEle.classList.add('active');
            $searchInput.value = $nextEle.outerText.replace(/\d+ /, '');
          } else {
            $searchInput.value = searchOriginalValue;
          }
        } else {
          var $activeEle = keyCode === 'ArrowDown'
            ? $searchHotList.firstElementChild
            : $searchHotList.lastElementChild;
          $activeEle.classList.add('active');
          $searchInput.value = $activeEle.outerText.replace(/\d+ /, '');
        }
      }
      break;
    default:
      break;
  }

}

search.init();
document.addEventListener('keydown', hotskeyEvents);
