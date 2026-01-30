export type Language = 'en' | 'cn';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isVoice?: boolean;
  audioUrl?: string; // URL for the recorded or generated audio
}

export interface PlanVersion {
  id: string;
  content: string; // Markdown content
  timestamp: number;
  author: 'ai' | 'user';
}

export interface InvestorFeedback {
  score: number;
  questions: string[];
  lastUpdated: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  messages: Message[];
  currentPlan: string; // Latest markdown
  planHistory: PlanVersion[];
  investorFeedback: InvestorFeedback | null;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  language: Language;
  isSidebarOpen: boolean;
}

export interface Translations {
  nav_new_project: string;
  nav_execute: string;
  nav_meet: string;
  col_projects: string;
  col_projects_new: string;
  col_mentor: string;
  col_mentor_placeholder: string;
  col_plan: string;
  col_plan_edit: string;
  col_plan_view: string;
  col_investor: string;
  col_investor_score: string;
  col_investor_questions: string;
  btn_execute_plan: string;
  loading_mentor: string;
  loading_assistant: string;
  loading_investor: string;
  empty_projects: string;
  plan_initial_prompt: string;
  voice_hold_to_talk: string;
  voice_release_to_send: string;
  voice_meeting_title: string;
  voice_meeting_status_listening: string;
  voice_meeting_status_thinking: string;
  voice_meeting_close: string;
  voice_transcribing: string;
}