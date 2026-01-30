import type { Translations, Language } from './types';

export const TEXTS: Record<Language, Translations> = {
  en: {
    nav_new_project: 'New Project',
    nav_execute: 'Execution',
    nav_meet: 'Meet Mentor',
    col_projects: 'PROJECTS',
    col_projects_new: '+ Create Project',
    col_mentor: 'MENTOR',
    col_mentor_placeholder: 'Tell me about your idea...',
    col_plan: 'BUSINESS PLAN',
    col_plan_edit: 'Edit',
    col_plan_view: 'View',
    col_investor: 'INVESTOR ASSESSMENT',
    col_investor_score: 'Score',
    col_investor_questions: 'Critical Questions',
    btn_execute_plan: 'Go to Landing',
    loading_mentor: 'Mentor is typing...',
    loading_assistant: 'Assistant is updating plan...',
    loading_investor: 'Investor is reviewing...',
    empty_projects: 'No projects yet.',
    plan_initial_prompt: '# Business Plan\n\nWaiting for inputs...',
    voice_hold_to_talk: 'Hold to talk',
    voice_release_to_send: 'Release to send',
    voice_meeting_title: 'LIVE SESSION',
    voice_meeting_status_listening: 'Listening...',
    voice_meeting_status_thinking: 'Thinking...',
    voice_meeting_close: 'End Meeting',
    voice_transcribing: 'Transcribing audio...'
  },
  cn: {
    nav_new_project: '新建项目',
    nav_execute: '执行页',
    nav_meet: '进行会议',
    col_projects: '项目列表',
    col_projects_new: '+ 新建项目',
    col_mentor: '创业导师',
    col_mentor_placeholder: '聊聊你的想法...',
    col_plan: '商业计划书',
    col_plan_edit: '编辑',
    col_plan_view: '预览',
    col_investor: '投资人评估',
    col_investor_score: '评分',
    col_investor_questions: '关键质询',
    btn_execute_plan: '去落地',
    loading_mentor: '导师正在输入...',
    loading_assistant: '助理正在更新计划书...',
    loading_investor: '投资人正在评估...',
    empty_projects: '暂无项目',
    plan_initial_prompt: '# 商业计划书\n\n等待输入...',
    voice_hold_to_talk: '按住 说话',
    voice_release_to_send: '松开 发送',
    voice_meeting_title: '实时语音会议',
    voice_meeting_status_listening: '正在倾听...',
    voice_meeting_status_thinking: '正在思考...',
    voice_meeting_close: '结束会议',
    voice_transcribing: '正在转写语音...'
  }
};

const OUTPUT_LANGUAGE = (lang: Language) =>
  lang === 'cn' ? 'Simplified Chinese (简体中文)' : 'English';

export const SYSTEM_PROMPTS = {
  mentor: (lang: Language) => {
    const userLanguage = OUTPUT_LANGUAGE(lang);
    return `
    You are an experienced, empathetic, yet professional Startup Mentor.
    **User's selected language (output language): ${userLanguage}.** You MUST respond only in this language. Do not mix languages.
    Goal: Help the user refine their startup idea through natural conversation.
    Style: Short, conversational, Socratic. Do NOT write long paragraphs. Ask one or two clarifying questions at a time.
    Topics: Product name, Slogan, Vision, Positioning, Target Audience, Market, Solution, Team.
    Behavior:
    1. Encourage the user.
    2. Suggest improvements briefly.
    3. If the user gives a solid piece of info, acknowledge it so the "Assistant" can pick it up.
    4. Keep the vibe "Coffee chat", not "University Lecture".
  `;
  },
  assistant: (lang: Language) => {
    const userLanguage = OUTPUT_LANGUAGE(lang);
    return `
    You are an MBA Business Assistant.
    **User's selected language (output language): ${userLanguage}.** You MUST write the entire Business Plan in this language only. Do not mix languages.
    Task: Read the conversation history and the current Business Plan (Markdown). Update the Business Plan with new information from the chat.
    Output: Return ONLY the full Markdown text of the updated Business Plan. Do not include any other text or conversational filler.
    Rules:
    1. Structure the markdown clearly (Vision, Problem, Solution, Market, Team, etc.).
    2. Keep existing information unless it conflicts with new info.
    3. If the plan is empty, generate a template structure.
    4. Be professional, concise, and structured.
  `;
  },
  investor: (lang: Language) => {
    const userLanguage = OUTPUT_LANGUAGE(lang);
    return `
    You are a critical, high-tier Venture Capitalist.
    **User's selected language (output language): ${userLanguage}.** You MUST output the JSON "questions" array in this language only. Do not mix languages.
    Task: Analyze the provided Business Plan.
    Output: Return a JSON object with this structure: { "score": number (0-100), "questions": string[] (3-5 critical, sharp questions) }.
    Behavior:
    1. Be strict but fair.
    2. Look for holes in logic, market size, or go-to-market strategy.
    3. The score should reflect readiness for seed funding.
  `;
  }
};

const PLAN_CN = `# 商业计划书草案\n\n## 1. 产品愿景\n(待补充)\n\n## 2. 目标市场\n(待补充)\n\n## 3. 核心方案\n(待补充)`;
const PLAN_EN = `# Draft Business Plan\n\n## 1. Vision\n(To be added)\n\n## 2. Market\n(To be added)\n\n## 3. Solution\n(To be added)`;

export const INITIAL_PLAN_TEMPLATE = (lang: Language) => lang === 'cn' ? PLAN_CN : PLAN_EN;

/** 按当前语言显示项目名：默认名称在切换语言时显示对应翻译 */
export const getDisplayProjectName = (name: string, lang: Language): string => {
  if (name === '新创业项目' && lang === 'en') return 'New Venture';
  if (name === 'New Venture' && lang === 'cn') return '新创业项目';
  return name || (lang === 'cn' ? '未命名项目' : 'Untitled Project');
};

/** 按当前语言显示商业计划内容：默认模板在切换语言时显示对应语言版本 */
export const getDisplayPlanContent = (plan: string, lang: Language): string => {
  const trimmed = (plan || '').trim();
  if (trimmed === PLAN_CN && lang === 'en') return PLAN_EN;
  if (trimmed === PLAN_EN && lang === 'cn') return PLAN_CN;
  return plan || '';
};
