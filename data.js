/* =========================================================================
 *  只需要改这一个文件 —— data.js
 *  ------------------------------------------------------------------------
 *  规则很简单：
 *   1. 所有中文写字的地方，都用一对单引号 ' 包起来
 *   2. 暂时没有的内容，把引号里留空 ''，页面上会自动变成占位提示，不会难看
 *   3. 删掉整个 { ... } 对象，对应卡片也会跟着消失
 *   4. 图片路径统一写成  'assets/文件名.png'  （图片放进 assets 文件夹里）
 *  改完保存，双击 index.html 就能看效果。
 * ========================================================================= */

const SITE = {

  /* ---------- 【一】页头和首页 ---------- */
  hero: {
    name: '明路路',
    avatar: 'assets/zhaopian.jpg',                       // 证件照/形象照，建议正方形，例如 'assets/avatar.jpg'
    target: '求职意向：信息技术教师',
    tagline: '用学生玩得起来的方式，讲清楚技术的本质',
    intro: '我是安徽师范大学现代教育技术（师范）专业应届毕业生，喜欢把抽象的信息技术知识拆成学生能亲手完成的小作品。',
    primaryBtn:  { label: '查看我的作品', href: '#teaching' },
    secondaryBtn:{ label: '联系我',       href: '#contact'  }
  },

  /* ---------- 【二】关于我 ---------- */
  about: {
    eyebrow: 'About me',
    title: '关于我',
    desc: '技术与教学的结合点，是我一直投入的方向。',
    paragraphs: [
      '习惯用任务驱动拆解知识点 每节课给时间让学生自己动手做作品 '
    ],
    // 一行一句的基本信息，留空的会自动隐藏
    facts: [
      { label: '学历', value: '安徽师范大学 · 硕士研究生' },
      { label: '专业', value: '现代教育技术（师范）' },
      { label: '教师资格', value: '高级中学信息技术教师资格证' },
      { label: '实习经历', value: '芜湖弋江中学 · 信息技术实习教师' }
    ]
  },

  /* ---------- 【三】教学课件（信息技术 PPT）----------
   *  用法：一个 {} 就是一个课件包
   *    files 里放这个包的所有文件，访客点卡片就能看到完整清单
   *    文件放 assets/courseware/ 文件夹，路径填 'assets/courseware/文件名.pptx'
   *    href 留空 = 显示"待上传"，等文件传好了再填
   * ---------------------------------------------------- */
  teaching: {
    eyebrow: 'Teaching',
    title: '教学课件与设计',
    desc: '按课时设计的完整课件，含情境导入、任务单与课堂检测。点击卡片查看该课件的全部文件。',
    showAllCard: false,          // 是否显示第一张"全部课件"汇总卡（改成 false 就不显示）
    items: [
      {
        title: '《输入输出与计算》',
        tag: '六年级 · 沪教版',
        desc: '用"机器人送餐"的案例学习控制系统的输入，计算，输出三个环节。',
        cover: 'assets/kj1.png',                    // 封面图路径，例：'assets/kejian-01.png'
        gallery: [],                  // 内页截图：['assets/k1a.png','assets/k1b.png']
        files: [
          { name: '课件 PPT', href: 'assets/kj1ppt.pptx', note: 'PPTX' },
          { name: '教学设计', href: 'assets/kj1sj.docx', note: 'DOCX' },
          { name: '学习任务单', href: 'assets/kj1rwd.docx', note: 'DOCX' },
          { name: '送餐模拟html', href:'assets/kj1html.html',note:'HTML'}
        ]
      },
      {
        title: '《人工智能 · 语音识别技术》',
        tag: '七年级 · 安徽',
        desc: '项目式学习，通过分析景区导览新功能，学习语音识别技术的原理，过程及其应用。',
        cover: 'assets/kj2.png',
        gallery: [],
        files: [
          { name: '课件 PPT', href: 'assets/kj2ppt.pptx', note: 'PPTX' },
          { name: '教学设计', href:'assets/kj2sj.docx',note:'DOCX'},
          { name: '送餐模拟html', href:'assets/kj2html.html',note:'HTML'},
        ]
      },
      {
        title: '《智能物联系统的设计》',
        tag: '八年级 · 浙教版',
        desc: '以智能校园数字气象站系统的设计导入，学习智能物联网设计的需求分析与整体设计。',
        cover: 'assets/kj3.png',
        gallery: [],
        files: [
          { name: '课件 PPT',   href: 'assets/kj3ppt.pptx', note: 'PPTX' },
          { name：'教学设计', href:'assets/kj3sj.docx',note:'DOCX'},
          { name: '送餐模拟html', href:'assets/kj3html.html',note:'HTML'},
        ]
      }
    ]
  },

  /* ---------- 【四】编程与创作（sb3 作品 + 小游戏 + HTML 工具）----------
   *  embed 填 HTML 文件路径（例：'tools/grade-stats.html'），
   *  卡片就会变成"点击运行"，工具直接在弹窗里跑，不需要跳转。
   * ---------------------------------------------------------------------- */
  coding: {
    eyebrow: 'Creation',
    title: '编程作品',
    desc: '图形化编程、自制小游戏与教学实用工具，均可在线运行。',
    items: [
      {
        title: 'Scratch 作品1 · 飞船射击游戏',
        tag: 'Scratch · sb3',
        desc: '飞船射击游戏，简单的实现逻辑结合丰富的游戏特效。',
        cover: 'assets/html1.png',
        gallery: [],
        // ★ 想让访客直接在网页上玩，就把 sb3 传到网上后填这里（README 里有做法）
        embed: 'tools/lemonshot.html',
        links: [ { label: '源文件下载', href: 'tools/lemonshot.html' } ]
      },
      {
        title: 'Scratch 作品2 ·程序化蜥蜴',
        tag: 'Scratch · sb3',
        desc: '程序化动画，使用程序设计了一只可控制的动画蜥蜴。',
        cover: 'assets/html2.png',
        gallery: [],
        // ★ 想让访客直接在网页上玩，就把 sb3 传到网上后填这里（README 里有做法）
        embed: 'tools/codexiyi.html',
        links: [ { label: '源文件下载', href: 'tools/codexiyi.html' } ]
      },
      {
        title: 'Scratch 作品3 · 递归梅花树',
        tag: 'Scratch · sb3',
        desc: '采用递归法，现场设计一颗梅花树。',
        cover: 'assets/html3.png',
        gallery: [],
        // ★ 想让访客直接在网页上玩，就把 sb3 传到网上后填这里（README 里有做法）
        embed: 'tools/diguitree.html',
        links: [ { label: '源文件下载', href: 'tools/codexiyi.html' } ]
      },
      {
        title: '成绩统计工具',
        tag: 'HTML · 教学工具',
        desc: '粘贴一整列成绩，自动算出平均分、中位数、及格率、优秀率和分数段分布，并列出需要关注的学生。支持带姓名导入，可导出 CSV。',
        cover: '',
        gallery: [],
        embed: 'tools/grade-stats.html',
        embedLabel: 'HTML 工具 · 点击运行',
        source: '',
        links: [ { label: '在新窗口打开', href: 'tools/grade-stats.html' } ]
      },
      {
        title: '随机点名工具',
        tag: 'HTML · 教学工具',
        desc: '粘贴班级名单，随机滚动抽取学生，支持不重复模式和一次抽取多人，空格键即可开始或停止。',
        cover: '',
        gallery: [],
        embed: 'tools/roll-call.html',
        embedLabel: 'HTML 工具 · 点击运行',
        source: '',
        links: [ { label: '在新窗口打开', href: 'tools/roll-call.html' } ]
      },
      {
        title: '知识分类小游戏',
        tag: 'HTML · 课堂互动',
        desc: '用于课堂知识点归类练习的互动小游戏，学生拖拽词条完成分类并即时得到反馈，可作为课堂检测或小组竞赛环节。',
        cover: '',
        gallery: [],
        embed: 'tools/knowledge-sort.html',
        embedLabel: 'HTML 游戏 · 点击运行',
        source: '',
        links: [ { label: '在新窗口打开', href: 'tools/knowledge-sort.html' } ]
      }
    ]
  },

  /* ---------- 【五】GitHub 项目 ---------- */
  opensource: {
    eyebrow: 'Open source',
    title: 'GitHub 项目',
    desc: '把仓库直接推给对方看，是最直接的能力证明。',
    githubUser: 'xiaoming0303',
    items: [
      {
        title: '项目名称一',
        tag: '主要语言',
        desc: '一两句话说明这个项目做什么、解决了什么问题、你自己负责哪部分。',
        cover: '',
        gallery: [],
        links: [ { label: '代码仓库', href: '' } ]
      },
      {
        title: '项目名称二',
        tag: '主要语言',
        desc: '一两句话说明这个项目做什么、解决了什么问题、你自己负责哪部分。',
        cover: '',
        gallery: [],
        links: [ { label: '代码仓库', href: '' } ]
      }
    ]
  },

  /* ---------- 【六】简历下载 ---------- */
  resume: {
    title: '想看完整简历？',
    desc: '这份线上作品集是简历的补充说明：PDF 简历负责讲清楚经历，这里负责让经历变得可见。',
    // 把 PDF 放进 assets 文件夹，命名 resume.pdf，下面的路径就不用动
    file: 'assets/resume.pdf',
    btnLabel: '下载 PDF 简历'
  },

  /* ---------- 【七】联系方式 ---------- */
  contact: {
    eyebrow: 'Contact',
    title: '联系我',
    desc: '随时欢迎交流，看到邮件一般当天回复。',
    items: [
      { label: '邮箱',   value: '2827098045@qq.com',  href: 'mailto:2827098045@qq.com' },
      { label: '电话',   value: '134 7081 4729 ',    href: '' },
      { label: '在线作品集', value: 'xiaoming0303.github.io', href: 'https://xiaoming0303.github.io' },
      { label: 'GitHub', value: 'github.com/xiaoming0303', href: 'https://github.com/xiaoming0303' }
    ],
    footer: '© 2026 明路路 · 在线作品集 xiaoming0303.github.io · 本站由 HTML + CSS 手写，托管于 GitHub Pages'
  }
};
