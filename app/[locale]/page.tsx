import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { LocaleTypes } from '@/i18n/routing'

export default async function Page(props: {
  params: Promise<{
    locale: LocaleTypes
  }>
}) {
  const { locale } = await props.params
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const filteredPosts = posts.filter((post) => post.language === locale)
  return <Main posts={filteredPosts} />
}
