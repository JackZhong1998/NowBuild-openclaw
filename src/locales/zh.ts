export default {
  navbar: {
    home: "首页",
    showcase: "成功案例",
    download: "资源下载",
    about: "理念",
    subscription: "订阅计划", // Keep for legacy/admin
    waitlist: "加入候补", // New
    login: "登录",
    launch: "启动 OpenClaw",
    console: "控制台",
    start_now: "立即启动",
    enter_console: "进入控制台"
  },
  footer: {
    tagline: "定义未来的一人公司。\n无需招聘，即可组建由 AI 驱动的自动化商业帝国。",
    products: "产品",
    community: "社区",
    about: "关于 NowBuild",
    copyright: "© {{year}} NowBuild Inc. All rights reserved."
  },
  landing: {
    badge: "The Future of Solopreneurship",
    title_prefix: "以一人之力",
    title_suffix: "统治商业帝国",
    description: "NowBuild 是为极少数人准备的终极武器。告别繁琐的开源配置，拥抱真正的自动化霸权。",
    btn_showcase: "见证自动化奇迹",
    btn_idea: "先生成商业计划书",
    btn_resources: "资源与兼容性",
    why_title: "为什么选择 NowBuild？",
    why_desc: "OpenClaw (Clawdbot/Moltbot) 是优秀的开源实验场，而 NowBuild 是为您打造的商业战场。",
    comparison: {
      oss_title: "传统开源方案",
      oss_1: "复杂的 Docker 部署与环境配置",
      oss_2: "依赖本地硬件性能，不仅费电且不稳定",
      oss_3: "不仅需要编写代码，还需要维护服务器",
      nb_title: "NowBuild 平台",
      nb_1: "零配置开箱即用：注册即拥有企业级 AI 算力",
      nb_2: "7x24小时云端托管：业务永不掉线",
      nb_3: "完全兼容生态：无缝导入 OpenClaw 配置与插件"
    },
    features: {
      arch_title: "一人公司架构",
      arch_desc: "专为超级个体设计。无需招聘，即可组建由 AI 驱动的销售、客服、研发团队，所有指令由您一人下达。",
      privacy_title: "隐私堡垒",
      privacy_desc: "NowBuild 采用独立的沙箱环境，您的数据与商业机密拥有银行级的安全保障，远超本地明文存储的安全性。",
      evo_title: "从 OpenClaw 进化",
      evo_desc: "如果您曾尝试过 Moltbot 或 Clawdbot，NowBuild 是您的下一站。我们不仅兼容您的旧工作流，更赋予其商业化的稳定性。"
    },
    ecosystem_title: "About The Ecosystem",
    ecosystem_desc: "OpenClaw (此前被称为 Clawdbot 和 Moltbot) 是这一波 AI Agent 浪潮中的先驱。NowBuild 致敬开源精神，并在此基础上构建了全新的商业基础设施。我们不是 OpenClaw 的托管商，我们是 Next Level 的构建者。NowBuild 提供了 OpenClaw 无法企及的云端协同、企业级权限管理以及可视化的业务编排能力。对于追求极致效率的一人公司创始人，NowBuild 是唯一的选择。"
  },
  showcase: {
    title: "OpenClaw 案例展示",
    badge: "精选社区创新案例",
    description: "探索全球开发者如何使用 OpenClaw 构建下一代自动化工具、生产力助手和创意应用。\n汇聚真实场景，激发无限灵感。",
    search_placeholder: "搜索案例、作者或技术栈...",
    filter_all: "全部",
    no_results: "没有找到匹配的案例",
    no_results_desc: "尝试调整搜索关键词或筛选分类",
    clear_filter: "清除筛选",
    view_details: "查看详情",
    footer_text: "Based on OpenClaw Showcase",
    organized_by: "Organized by AnyGen · {{year}}"
  },
  download: {
    title: "下载 OpenClaw",
    badge: "v1.0.0 Stable",
    description: "在您的设备上本地运行全能 AI 助手。\n100% 开源，MIT 协议，支持 macOS, Windows 和 Linux。",
    btn_official: "前往官方下载页",
    btn_github: "GitHub 源码",
    tabs: {
      quick: "快速安装 (推荐)",
      npm: "NPM 安装",
      source: "源码编译",
      desktop: "桌面客户端"
    },
    quick_desc: "适用于 macOS, Windows (WSL), 和 Linux。这是最快的启动方式。",
    npm_desc: "如果您已安装 Node.js (v22+)，可以直接通过 npm 全局安装。",
    source_desc: "适合希望完全控制或参与贡献的开发者。",
    mac_desc: "原生 macOS 伴侣应用，提供系统集成、文件管理和浏览器控制能力。",
    win_desc: "目前 Windows 用户可以通过 WSL2 运行 OpenClaw。原生应用正在开发中。",
    features_title: "下载 OpenClaw 后您可以获得什么？",
    features: {
      chat_title: "多平台聊天集成",
      chat_desc: "连接 WhatsApp, Telegram, Discord, Slack 等，随时随地与 AI 助手对话。",
      browser_title: "浏览器自动化",
      browser_desc: "自动浏览网页、填写表单、提取数据，无需编写代码即可处理重复性 Web 任务。",
      file_title: "本地文件管理",
      file_desc: "读取、写入和整理计算机文件。处理文档并优化数据结构。",
      shell_title: "Shell 命令执行",
      shell_desc: "执行终端命令、运行脚本并管理开发环境。完全掌控命令行。"
    },
    req_title: "系统要求",
    req_node: "需要 Node.js 22 或更高版本。",
    req_os: "macOS 13+, Windows 10+ (WSL2), 或带有现代内核的 Linux。仅支持 64 位系统。",
    req_api: "需要 Anthropic (Claude), OpenAI 或其他支持的提供商 API Key。也支持本地模型。"
  },
  about: {
    badge: "Philosophy",
    title: "关于 NowBuild",
    description: "产品以人为本，而非以 Agent 为本。\nAI 越强大，人类应当越自由。",
    values_title: "产品价值观",
    values_1: "LLM 是工具，不是人，也不是智能本身，更谈不上智能「体」。",
    values_2: "无论什么时候实现 AGI，**「去创造」**是人类幸福的本质之一，另一个是健康。NowBuild 致力于支持团队成员成为更有创造力、更有生命力的人，而非劳动力。",
    origins_title: "起源的三点思考",
    val_judgement: "价值判断",
    val_judgement_desc: "经济压迫是人类的最大痛苦。AI 的最大价值在于让人类与**「劳动力」**解绑，从而获得真正的自由。",
    empathy: "用户同理心",
    empathy_desc: "现有的协作形态（如 ChatGPT/Manus）存在问题：被动激活、对话与任务混淆。",
    empathy_list: [
      "用户无法对不知道之事提出要求",
      "用户往往词不达意",
      "用户语焉不详，且不愿多说"
    ],
    needs: "我的需求",
    needs_desc: "作为创业者，我深知缺少合伙人、时间与全栈知识的痛苦。我要补课 SEO、设计、运营... **NowBuild 正是为了解决这种「一人分身乏术」的困境而生。**",
    why_now_title: "为什么是现在？",
    diff_val: "差异化价值",
    diff_val_desc: "将任务放进具体场景里，为用户省时间并提升模型效果。这是一个高频日活产品，而非偶尔使用的工具。",
    opportunity: "时代机遇",
    opportunity_desc: "处于技术繁荣周期，个体创业人群正在爆发式增长，且付费意愿高。",
    mission: "使命感",
    mission_desc: "带着 AI 帮助人类的理想主义。我在字节做设计 Agent，在创业中做 MultiAgent，这一切都是为 NowBuild 做准备。",
    loop: "闭环",
    loop_desc: "我是目标用户，用创业的方式给创业者做产品，实现知识技能的完美闭环。"
  },
  waitlist: {
    badge: "早期体验",
    title: "加入变革",
    description: "NowBuild 目前处于内测阶段。\n锁定您的席位，成为第一批构建自动化帝国的先驱。",
    form_title: "申请访问权限",
    email_placeholder: "输入您的常用邮箱",
    join_btn: "加入候补名单",
    success_toast: "您已加入名单！我们会尽快联系您。",
    success_title: "欢迎加入",
    success_desc: "我们已将您加入优先队列。请留意您的收件箱，等待邀请码。",
    spam_policy: "我们尊重您的隐私。绝无垃圾邮件。",
    stat_1_label: "创始人等待中",
    stat_2_label: "SLA 在线率",
    stat_3_label: "技术支持",
    enter_idea: "先生成商业计划书"
  },
  idea: {
    nav_execute: "执行页",
    nav_meet: "进行会议",
    col_projects: "项目列表",
    col_mentor: "创业导师",
    col_mentor_placeholder: "聊聊你的想法...",
    col_plan: "商业计划书",
    col_plan_edit: "编辑",
    col_plan_view: "预览",
    col_investor_questions: "关键质询",
    btn_execute_plan: "去落地",
    voice_hold_to_talk: "按住 说话",
    voice_release_to_send: "松开 发送",
    voice_meeting_title: "实时语音会议",
    voice_meeting_status_listening: "正在倾听...",
    voice_meeting_status_thinking: "正在思考...",
    voice_meeting_close: "结束会议",
    voice_transcribing: "正在转写语音...",
    voice_meeting_hint: "Gemini Live 已开启。自然说话，导师会在您停顿后自动回复。",
    voice_label: "语音",
    voice_playing: "播放中",
    initialising: "正在初始化工作区",
    untitled_project: "未命名项目",
    mentor_label: "导师"
  },
  subscription: {
    title: "选择您的帝国版图",
    description: "从基础自动化到完全接管，NowBuild 提供适合不同阶段的一人公司解决方案。",
    contact: "需要定制化企业方案？联系销售团队",
    free: {
      title: "基础版",
      desc: "适合初试自动化的一人公司",
      price: "Free",
      period: "/ 永久免费",
      features: [
        "基础 Agent 托管 (1个实例)",
        "每日 100 次自动化执行",
        "社区版插件支持",
        "标准 API 速率限制",
        "社区论坛支持"
      ],
      btn: "当前计划"
    },
    pro: {
      title: "专业版",
      desc: "为追求极致效率的统治者打造",
      price: "$200",
      period: "/ 月",
      popular: "POPULAR",
      features: [
        "无限 Agent 实例",
        "无限自动化执行次数",
        "企业级插件全解锁",
        "优先 API 访问权",
        "7x24 专属技术支持",
        "私有化部署选项",
        "团队协作权限 (多账号)"
      ],
      btn: "立即订阅"
    }
  },
  categories: {
    "⚡ 自动化": "⚡ 自动化",
    "📋 生产力": "📋 生产力",
    "💻 开发者": "💻 开发者",
    "🏠 智能家居": "🏠 智能家居",
    "🔗 集成": "🔗 集成",
    "👤 个人": "👤 个人",
    "👨‍👩‍👧 家庭": "👨‍👩‍👧 家庭",
    "🚀 高级用户": "🚀 高级用户",
    "general": "general",
    "creative": "creative",
    "hardware": "hardware",
    "setup": "setup"
  }
};
