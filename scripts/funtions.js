'use strict';

const url_for = hexo.extend.helper.get('url_for').bind(hexo);

hexo.extend.helper.register('renderMenu', function (menuItems) {
  var html = [];
  // console.log(menuItems);

  renderItems(menuItems);

  function renderItems(menuItems) {
    menuItems.forEach(function(item) {

      if (item.submenu) {
        html.push('<li class="has-sub">');
        html.push(`
          <a class="fas fa-angle-right">
            <i class="menu-icon ${item.icon}"></i>
            <span class="menu-title">${item.name}</span>
          </a>
          <ul>
        `);
        renderItems(item.submenu);
        html.push('</ul>');
      } else {
        var anchor = url_for(`/#${item.config}`);
        var attribute = item.url
          ? `href="${item.url}" target="_blank"`
          : `href="${anchor}" role="anchor"`;
        
        html.push('<li>');
        html.push(`
          <a ${attribute}>
            <i class="menu-icon ${item.icon}"></i>
            <span class="menu-title">${item.name}</span>
          </a>
        `);
      }

      html.push('</li>');
    });
  }

  return html.join('');
});
