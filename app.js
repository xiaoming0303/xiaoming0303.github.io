/* =========================================================================
 *  app.js —— 渲染逻辑，一般不用改
 * ========================================================================= */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function has(v) { return typeof v === 'string' && v.trim() !== ''; }
  function hrefOk(v) { return has(v) && v !== '#'; }
  function list(v) { return Array.isArray(v) ? v : []; }

  var teachingItems = [];

  /* ---------- 区块标题 ---------- */
  function paintHead(id, cfg) {
    var sec = document.getElementById(id);
    if (!sec || !cfg) { return; }
    $('.eyebrow', sec).textContent = cfg.eyebrow || '';
    $('h2', sec).textContent = cfg.title || '';
    $('.sec-desc', sec).textContent = cfg.desc || '';
  }

  /* ---------- 封面 / 占位 ---------- */
  /* 没配 cover 截图时，按标题关键词自动挑一个图标和配色，
     卡片看起来像有封面，而不是空白占位框。填了 cover 就以你的图为准。 */
  function toolIcon(item) {
    var t = String(item.title || '') + ' ' + String(item.tag || '') + ' ' + String(item.desc || '');
    if (/成绩|统计|分数|分析|报表/.test(t))  return { i: '\uD83D\uDCCA', bg: 'linear-gradient(135deg,#eef3ff,#d9e4ff)', s: '数据 · 统计' };
    if (/点名|随机|抽取|抽签|分组/.test(t))  return { i: '\uD83C\uDFAF', bg: 'linear-gradient(135deg,#fff4e8,#ffdfc0)', s: '互动 · 抽取' };
    if (/游戏|闯关|钓鱼|分类|竞赛/.test(t))  return { i: '\uD83C\uDFAE', bg: 'linear-gradient(135deg,#e9faf1,#c9ecda)', s: '游戏 · 互动' };
    if (/scratch|sb3|图形化/i.test(t))       return { i: '\uD83E\uDDE9', bg: 'linear-gradient(135deg,#f4eeff,#e1d2ff)', s: '图形化编程' };
    if (/python|代码|脚本|算法/.test(t))     return { i: '\uD83D\uDC0D', bg: 'linear-gradient(135deg,#eaf6ff,#cfe6fb)', s: '代码 · 脚本' };
    return { i: '\uD83E\uDDF0', bg: 'linear-gradient(135deg,#f2f5f9,#e2e9f3)', s: '网页工具' };
  }

  function coverInner(item, i, dir, runnable) {
    if (has(item.cover)) { return '<img src="' + esc(item.cover) + '" alt="' + esc(item.title) + '">'; }
    if (runnable) {
      var t = toolIcon(item);
      return '<div class="cover-ph" style="background:' + t.bg + '">' +
             '<span class="ci">' + t.i + '</span>' +
             '<span class="ct">点击卡片运行</span>' +
             '<span class="cs">' + esc(t.s) + '</span></div>';
    }
    if (i === 0) {
      return '<div class="ph">封面图待补充<br>把图片放进 assets 文件夹，<br>再在 data.js 里填 <code>' +
        esc(dir) + '</code></div>';
    }
    return '<div class="ph">封面图待补充</div>';
  }

  function galleryHTML(item) {
    var g = list(item.gallery).filter(has);
    if (!g.length) { return ''; }
    return '<div class="thumb-row">' + g.map(function (x) {
      return '<img src="' + esc(x) + '" alt="作品截图">';
    }).join('') + '</div>';
  }

  function linksHTML(item, kind) {
    var ls = list(item.links).filter(function (l) { return hrefOk(l && l.href); });
    if (ls.length) {
      return '<div class="links">' + ls.map(function (l) {
        return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label || '查看') + '</a>';
      }).join('') + '</div>';
    }
    if (kind === 'muted') {
      return '<div class="links"><span style="color:#8b93a0;font-size:12px">链接待补充</span></div>';
    }
    return '';
  }

  /* ---------- 文件清单 ---------- */
  function fileListHTML(files) {
    var fs = list(files);
    if (!fs.length) {
      return '<ul class="file-list"><li class="file-item empty">这个课件包还没有上传文件</li></ul>';
    }
    return '<ul class="file-list">' + fs.map(function (f) {
      var ok = hrefOk(f.href);
      return '<li class="file-item">' +
        '<span class="fname">' + esc(f.name || '未命名文件') + '</span>' +
        (has(f.note) ? '<span class="fnote">' + esc(f.note) + '</span>' : '') +
        (ok ? '<a class="fdown" href="' + esc(f.href) + '" download>下载</a>'
            : '<span class="fnod">待上传</span>') +
      '</li>';
    }).join('') + '</ul>';
  }

  function countFiles(arr) {
    return arr.reduce(function (n, it) { return n + list(it.files).length; }, 0);
  }

  /* ---------- 卡片 ---------- */
  function cardHTML(item, i, cfg) {
    var files = list(item.files);
    var runnable = cfg.mode !== 'files' && has(item.embed);
    var top = '<div class="cover">' + coverInner(item, i, cfg.dir, runnable) + '</div>';
    var foot;
    if (cfg.mode === 'files') {
      foot = files.length
        ? '<div class="hint"><span class="go">点击查看全部课件</span><span class="cnt">共 ' + files.length + ' 个文件</span></div>'
        : '<div class="hint muted"><span class="go">文件待补充</span></div>';
    } else if (runnable) {
      foot = '<div class="hint"><span class="go">点击运行</span><span class="cnt">' +
             esc(item.embedLabel || 'HTML 工具') + '</span></div>';
    } else {
      foot = linksHTML(item, 'muted');
    }
    var cls = 'card' + ((cfg.mode === 'files' && files.length) || runnable ? ' clickable' : '');
    return '<article class="' + cls + '" data-idx="' + i + '">' + top +
      '<div class="card-body">' +
        '<h3>' + esc(item.title) + '</h3>' +
        (has(item.tag) ? '<span class="tag">' + esc(item.tag) + '</span>' : '') +
        (has(item.desc) ? '<p>' + esc(item.desc) + '</p>' : '') +
        galleryHTML(item) +
        foot +
      '</div></article>';
  }

  /* ---------- 弹窗 ---------- */
  function openModal(tag, title, desc, innerHTML) {
    var m = document.getElementById('modal');
    if (!m) { return; }
    $('#modalTag').textContent = tag || '';
    $('#modalTitle').textContent = title || '';
    $('#modalDesc').textContent = desc || '';
    $('#modalFiles').innerHTML = innerHTML || '';
    m.hidden = false;
    if (document.body && document.body.style) { document.body.style.overflow = 'hidden'; }
  }

  function closeModal() {
    var m = document.getElementById('modal');
    if (!m) { return; }
    m.hidden = true;
    if (document.body && document.body.style) { document.body.style.overflow = ''; }
  }

  function initModal() {
    var m = document.getElementById('modal');
    if (!m) { return; }
    m.addEventListener('click', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-close')) { closeModal(); }
    });
    if (document.addEventListener) {
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); }
      });
    }
  }

  function openEmbedModal(item) {
    openModal(item.tag || '工具', item.title, item.desc || '',
      '<div class="embed-big"><iframe src="' + esc(item.embed) + '" title="' + esc(item.title) + '"></iframe></div>' +
      '<div class="modal-foot">' +
        '<a href="' + esc(item.embed) + '" target="_blank" rel="noopener">在新窗口打开</a>' +
        (has(item.source) ? '<a href="' + esc(item.source) + '" target="_blank" rel="noopener">查看源码</a>' : '') +
      '</div>');
  }

  function openItemModal(item) {
    var n = list(item.files).length;
    openModal(item.tag || '课件', item.title,
      (has(item.desc) ? item.desc + ' ' : '') + '共 ' + n + ' 个文件，点右侧"下载"获取。',
      fileListHTML(item.files));
  }

  function openAllModal() {
    var groups = teachingItems.filter(function (it) { return list(it.files).length; });
    if (!groups.length) { return; }
    openModal('全部课件', '全部课件清单',
      '共 ' + groups.length + ' 个课件包、' + countFiles(groups) + ' 个文件，点右侧"下载"获取。',
      groups.map(function (it) {
        return '<div class="file-group"><h4>' + esc(it.title) +
               '<span>' + esc(it.tag || '') + '</span></h4>' + fileListHTML(it.files) + '</div>';
      }).join(''));
  }

  /* ---------- 导航 ---------- */
  function renderNav() {
    $('#brand').textContent = SITE.hero.name + ' · 作品集';
    var sections = [
      { id: 'about',      label: '关于我',   on: !!(SITE.about && SITE.about.title) },
      { id: 'teaching',   label: '教学课件', on: !!(SITE.teaching && list(SITE.teaching.items).length) },
      { id: 'coding',     label: '编程作品', on: !!(SITE.coding && list(SITE.coding.items).length) },
      { id: 'opensource', label: 'GitHub',   on: !!(SITE.opensource && list(SITE.opensource.items).length) },
      { id: 'resume',     label: '简历',     on: has(SITE.resume && SITE.resume.file) },
      { id: 'contact',    label: '联系',     on: !!(SITE.contact && list(SITE.contact.items).length) }
    ];
    $('#navlinks').innerHTML = sections.filter(function (s) { return s.on; })
      .map(function (s) { return '<a href="#' + s.id + '">' + s.label + '</a>'; }).join('');
  }

  /* ---------- 首页 ---------- */
  function renderHero() {
    var h = SITE.hero;
    document.title = h.name + ' · 初中信息技术教师作品集';
    var avatar = has(h.avatar)
      ? '<img src="' + esc(h.avatar) + '" alt="' + esc(h.name) + '">'
      : '<div class="ph" style="width:80%">形象照<br>建议 1:1 生活照<br><code>assets/avatar.jpg</code></div>';
    $('#hero').innerHTML =
      '<div>' +
        (has(h.target) ? '<span class="badge">' + esc(h.target) + '</span>' : '') +
        '<h1>你好，我是 ' + esc(h.name) + '</h1>' +
        (has(h.tagline) ? '<div class="tagline">' + esc(h.tagline) + '</div>' : '') +
        (has(h.intro) ? '<p class="intro">' + esc(h.intro) + '</p>' : '') +
        '<div class="btn-row">' +
          ((h.primaryBtn && hrefOk(h.primaryBtn.href)) ? '<a class="btn btn-primary" href="' + esc(h.primaryBtn.href) + '">' + esc(h.primaryBtn.label) + '</a>' : '') +
          ((h.secondaryBtn && hrefOk(h.secondaryBtn.href)) ? '<a class="btn btn-ghost" href="' + esc(h.secondaryBtn.href) + '">' + esc(h.secondaryBtn.label) + '</a>' : '') +
        '</div>' +
      '</div>' +
      '<div class="avatar">' + avatar + '</div>';
  }

  /* ---------- 关于我 ---------- */
  function renderAbout() {
    var a = SITE.about;
    if (!a) { return; }
    var facts = list(a.facts).filter(function (f) { return has(f.value); });
    var left = '<div class="about-text">' +
      list(a.paragraphs).filter(has).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (facts.length ? '<div class="facts">' + facts.map(function (f) {
        return '<div class="fact"><div class="k">' + esc(f.label) + '</div><div class="v">' + esc(f.value) + '</div></div>';
      }).join('') + '</div>' : '') + '</div>';
    var skills = list(a.skills).filter(function (s) { return has(s.name); });
    var right = skills.length ? '<div>' + skills.map(function (s) {
      var v = Math.max(0, Math.min(100, Number(s.score) || 0));
      return '<div class="skill"><div class="skill-row"><span>' + esc(s.name) + '</span><span>' + v + '</span></div>' +
             '<div class="bar"><i style="width:' + v + '%"></i></div></div>';
    }).join('') + '</div>' : '';
    $('#aboutBody').innerHTML = left + right;
  }

  /* ---------- 教学课件区（点击看全部文件）---------- */
  function renderTeaching() {
    var cfg = SITE.teaching;
    if (!cfg) { return; }
    var items = list(cfg.items);
    teachingItems = items;
    var packed = items.filter(function (it) { return list(it.files).length; });
    var html = '';
    if (packed.length > 1 && cfg.showAllCard !== false) {
      html += '<article class="card clickable featured" data-all="1">' +
        '<div class="cover"><div class="ph">一键查看全部课件</div></div>' +
        '<div class="card-body">' +
          '<h3>全部课件</h3>' +
          '<span class="tag">' + packed.length + ' 个课件包</span>' +
          '<p>点击展开完整清单，包含每个课件的 PPT、任务单与配套材料。</p>' +
          '<div class="hint"><span class="go">点击查看</span><span class="cnt">共 ' + countFiles(packed) + ' 个文件</span></div>' +
        '</div></article>';
    }
    html += items.map(function (it, i) {
      return cardHTML(it, i, { mode: 'files', dir: 'assets/kejian.png' });
    }).join('');
    $('#teachingBody').innerHTML = html;

    var grid = $('#teachingBody');
    if (grid.addEventListener) {
      grid.addEventListener('click', function (e) {
        var card = e.target && e.target.closest ? e.target.closest('.card') : null;
        if (!card) { return; }
        if (card.getAttribute('data-all') === '1') { openAllModal(); return; }
        var it = teachingItems[Number(card.getAttribute('data-idx'))];
        if (it && list(it.files).length) { openItemModal(it); }
      });
    }
  }

  /* ---------- 其他卡片区 ---------- */
  var cardSections = [
    { key: 'coding',     el: '#codingBody',     dir: 'assets/works.png', mode: 'embed' },
    { key: 'opensource', el: '#opensourceBody', dir: 'assets/repo.png',  mode: 'link' }
  ];

  function renderCardSections() {
    cardSections.forEach(function (cfg) {
      var data = SITE[cfg.key];
      if (!data) { return; }
      paintHead(cfg.key, data);
      $(cfg.el).innerHTML = list(data.items).map(function (it, i) {
        return cardHTML(it, i, cfg);
      }).join('');

      var grid = $(cfg.el);
      if (grid && grid.addEventListener) {
        grid.addEventListener('click', function (e) {
          var card = e.target && e.target.closest ? e.target.closest('.card') : null;
          if (!card) { return; }
          var it = list(data.items)[Number(card.getAttribute('data-idx'))];
          if (!it) { return; }
          if (cfg.mode === 'embed' && has(it.embed)) { openEmbedModal(it); return; }
          var first = list(it.links).filter(function (l) { return hrefOk(l && l.href); })[0];
          if (first && typeof window !== 'undefined') { window.open(first.href, '_blank', 'noopener'); }
        });
      }
    });
    paintHead('about', SITE.about);
    paintHead('contact', SITE.contact);

    if (SITE.opensource && has(SITE.opensource.githubUser)) {
      $('#githubTip').innerHTML = '完整代码在 <a href="https://github.com/' + esc(SITE.opensource.githubUser) +
        '" target="_blank" rel="noopener" style="color:var(--accent)">github.com/' + esc(SITE.opensource.githubUser) + '</a>';
    }
  }

  /* ---------- 简历 ---------- */
  function renderResume() {
    var r = SITE.resume;
    if (!r) { return; }
    if (has(r.file)) {
      $('#resumeBox').innerHTML =
        '<div><h3>' + esc(r.title) + '</h3><p>' + esc(r.desc) + '</p></div>' +
        '<a class="btn btn-primary" href="' + esc(r.file) + '" download>' + esc(r.btnLabel || '下载简历') + '</a>';
    } else {
      $('#resumeBox').innerHTML =
        '<div><h3>' + esc(r.title) + '</h3><p>' + esc(r.desc) + '</p>' +
        '<div class="tip">还没上传：把简历 PDF 重命名为 resume.pdf，放进 assets 文件夹即可自动生效。</div></div>';
    }
  }

  /* ---------- 联系 + 页脚 ---------- */
  function renderContact() {
    var c = SITE.contact;
    if (!c) { return; }
    $('#contactBody').innerHTML = list(c.items).filter(function (i) { return has(i.value); }).map(function (i) {
      var inner = '<div class="k">' + esc(i.label) + '</div><div class="v">' + esc(i.value) + '</div>';
      return hrefOk(i.href)
        ? '<a class="contact-item" href="' + esc(i.href) + '"' + (i.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>'
        : '<div class="contact-item">' + inner + '</div>';
    }).join('');
    if ($('#footer')) { $('#footer').textContent = c.footer || ''; }
  }

  /* ---------- 启动 ---------- */
  try {
    renderNav();
    renderHero();
    renderAbout();
    renderTeaching();
    renderCardSections();
    renderResume();
    renderContact();
    initModal();
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="padding:16px;margin:16px;border:1px solid #e6e8ec;border-radius:12px;background:#fff5f5;color:#a32d2d;font-size:14px">' +
      'data.js 好像出了点问题，检查一下引号或逗号是不是漏了：<br><code>' + esc(e.message) + '</code></div>');
  }
})();
