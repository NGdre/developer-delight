import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { LocaleTypes } from '@/i18n/routing'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const groups: Record<string, typeof allBlogs> = {}

  for (const blog of allBlogs) {
    if (!groups[blog.language]) {
      groups[blog.language] = []
    }

    groups[blog.language].push(blog)
  }

  const paths: { page: string; locale: string }[] = []

  for (const [language, blogs] of Object.entries(groups)) {
    const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE)

    paths.push(
      ...Array.from({ length: totalPages }, (_, i) => ({
        page: (i + 1).toString(),
        locale: language,
      }))
    )
  }

  return paths
}

export default async function Page(props: {
  params: Promise<{ page: string; locale: LocaleTypes }>
}) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs))
  const filteredPosts = posts.filter((post) => post.language === params.locale)
  const pageNumber = parseInt(params.page as string)
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
      title="All Posts"
    />
  )
}
