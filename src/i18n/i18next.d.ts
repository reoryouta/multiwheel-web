import 'i18next'
import type ru from './locales/ru.json'

// TypeScript подсказывает доступные ключи и замечает опечатки в t().
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof ru
    }
  }
}
