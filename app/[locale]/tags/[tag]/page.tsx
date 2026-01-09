import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/[locale]/tag-data.json'
import { genPageMetadata } from 'app/[locale]/seo'
import { Metadata } from 'next'
import { LocaleTypes, routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { maintitle } from '@/data/localeMetadata'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string; locale: LocaleTypes }>
}): Promise<Metadata> {
  const t = await getTranslations('common')
  const params = await props.params
  const locale = params.locale
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${maintitle[locale]} ${t('withTag')} ${tag}`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
    params: {
      locale,
    },
  })
}

export const generateStaticParams = async () => {
  const params: { locale: LocaleTypes; tag: string }[] = []

  for (const locale of routing.locales) {
    const tagCounts = tagData[locale] as Record<string, number>
    const tagKeys = Object.keys(tagCounts)

    tagKeys.forEach((tag) => {
      params.push({
        locale,
        tag: encodeURI(tag),
      })
    })
  }

  return params
}

export default async function TagPage(props: {
  params: Promise<{ tag: string; locale: LocaleTypes }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.language === params.locale &&
          post.tags &&
          post.tags.map((t) => slug(t)).includes(tag)
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
