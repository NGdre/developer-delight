import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/[locale]/tag-data.json'
import { notFound } from 'next/navigation'
import { LocaleTypes, routing } from '@/i18n/routing'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const allParams: { locale: LocaleTypes; tag: string; page: string }[] = []

  for (const locale of routing.locales) {
    const tagCounts = tagData[locale] as Record<string, number>

    if (!tagCounts) continue

    Object.keys(tagCounts).forEach((tag) => {
      const postCount = tagCounts[tag]
      const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))

      for (let page = 1; page <= totalPages; page++) {
        allParams.push({
          locale,
          tag: encodeURI(tag),
          page: page.toString(),
        })
      }
    })
  }

  return allParams
}

export default async function TagPage(props: {
  params: Promise<{ tag: string; page: string; locale: LocaleTypes }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const pageNumber = parseInt(params.page)
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

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
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
