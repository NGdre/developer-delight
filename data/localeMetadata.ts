import { LocaleTypes } from '@/i18n/routing'

type Metadata = Record<LocaleTypes, string>

export const maintitle: Metadata = {
  en: "Developer's Delight — Code Tips, Tricks & Practical Notes",
  ru: 'Находки для разработчиков — советы, хитрости и практические заметки по программированию',
}

export const maindescription: Metadata = {
  en: "A front-end developer's thoughts on technology, careers, and learning. I share my experience and useful materials.",
  ru: 'Мысли фронтенд-разработчика о технологиях, карьере и обучении. Делюсь своим опытом и полезными материалами.',
}
