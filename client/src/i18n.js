import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend) // Загружает перевод через HTTP (с вашего сервера или публичного репозитория)
    .use(LanguageDetector) // Автоматически определяет язык
    .use(initReactI18next) // Связывает i18next с React
    .init({
        fallbackLng: 'en', // Язык по умолчанию, если язык пользователя не найден
        debug: true,
        interpolation: {
            escapeValue: false, // React сам обрабатывает защиту от XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Путь к файлам перевода
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
