import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'

export const languages = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
] as const

export type Language = (typeof languages)[number]['code']

const storageKey = 'multiwheel.language'

export function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(storageKey, language)
  } catch {
    // Переключатель работает и без сохранения в браузере.
  }
}

function getInitialLanguage(): Language {
  // Хранилище может быть недоступно из-за настроек браузера.
  try {
    const savedLanguage = localStorage.getItem(storageKey)
    if (savedLanguage === 'ru' || savedLanguage === 'en') return savedLanguage
  } catch {
    // В этом случае используем русский язык по умолчанию.
  }

  return 'ru'
}

// Обновляем язык документа и метаданные вместе с текстом страницы.
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  document.title = i18n.t('app.name')
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute('content', i18n.t('home.description'))

  if (language === 'ru' || language === 'en') rememberLanguage(language)
})

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'ru',
  supportedLngs: languages.map(({ code }) => code),
  initAsync: false,
  interpolation: {
    escapeValue: false, // React сам экранирует текст.
  },
})

export default i18n
