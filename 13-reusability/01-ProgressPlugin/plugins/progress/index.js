import { createApp, inject } from 'vue';
import TheTopProgressBar from './TheTopProgressBar.vue';

// Используйте эту константу в качестве ключа provide/inject
export const PROGRESS_KEY = Symbol('PROGRESS_KEY');

// Функция для удобного внедрения с Composition API
export function useProgress() {
  return inject(PROGRESS_KEY);
}

export function createProgress({ container, router } = {}) {
  const addDefaultContainer = () => document.body.appendChild(document.createElement('div'));
  const progressApp = createApp(TheTopProgressBar).mount(container ?? addDefaultContainer());

  const progress = {
    start: progressApp.start,
    finish: progressApp.finish,
    fail: progressApp.fail,
  };

  if (router) {
    router.beforeEach((to) => progressApp.start(to));
    router.afterEach((to) => progressApp.finish(to));

    router.onError(() => progressApp.fail());
  }

  progress.install = (app) => {
    app.provide(PROGRESS_KEY, progress);
  };

  return progress;
}
