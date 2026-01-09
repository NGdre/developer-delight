import { MetadataRoute } from 'next'
import { allBlogs, Blog } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { LocaleTypes } from '@/i18n/routing'

export const dynamic = 'force-static'

type PostGroup = {
  en: Blog | null
  ru: Blog | null
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const postGroups = allBlogs.reduce<Record<string, PostGroup>>((acc, post) => {
    if (post.draft) return acc

    const path = post.path
    const language = post.language as LocaleTypes

    if (!acc[path]) {
      acc[path] = {
        en: null,
        ru: null,
      }
    }

    acc[path][language] = post
    return acc
  }, {})

  const blogRoutes = Object.entries(postGroups).flatMap(([path, group]) => {
    const languages = Object.entries(group).filter(
      (entry): entry is [LocaleTypes, Blog] =>
        (entry[0] === 'en' || entry[0] === 'ru') && entry[1] !== null
    ) as [LocaleTypes, Blog][]

    return languages.map(([lang, post]) => ({
      url: `${siteUrl}/${lang}/${path}`,
      lastModified: post.lastmod || post.date,
      alternates: {
        languages: languages.reduce(
          (acc, [l]) => ({
            ...acc,
            [l]: `${siteUrl}/${l}/${path}`,
          }),
          {} as Record<LocaleTypes, string>
        ),
      },
    }))
  })

  const now = new Date().toISOString().split('T')[0]

  const staticRoutes = ['', 'blog']
  const staticRouteEntries = staticRoutes.flatMap((route) =>
    (['en', 'ru'] as const).map((lang) => ({
      url: `${siteUrl}/${lang}/${route}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${siteUrl}/en/${route}`,
          ru: `${siteUrl}/ru/${route}`,
        },
      },
    }))
  )

  return [...staticRouteEntries, ...blogRoutes]
}
