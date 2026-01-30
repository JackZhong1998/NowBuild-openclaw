import type { Project, Language } from './types';

const STORAGE_KEYS = {
  PROJECTS: 'nowbuild_projects',
  LANG: 'nowbuild_lang',
  LAST_PROJECT: 'nowbuild_last_project_id'
};

export const ideaStorage = {
  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load projects', e);
      return [];
    }
  },

  saveProjects: (projects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  },

  getLanguage: (): Language | null => {
    return localStorage.getItem(STORAGE_KEYS.LANG) as Language | null;
  },

  saveLanguage: (lang: Language) => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  },

  getLastProjectId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.LAST_PROJECT);
  },

  saveLastProjectId: (id: string) => {
    localStorage.setItem(STORAGE_KEYS.LAST_PROJECT, id);
  }
};
