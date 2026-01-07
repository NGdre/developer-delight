'use client'

import { useRouter } from '@/i18n/navigation'
import { Action, KBarProvider } from 'kbar'
import { useLocale } from 'next-intl'
import { CoreContent, MDXDocument } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import { ReactNode, useEffect, useState } from 'react'
import { KBarModal } from './KBarModal'

export interface KBarSearchProps {
  searchDocumentsPath: string | false
  defaultActions?: Action[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearchDocumentsLoad?: (json: any) => Action[]
}

interface SearchProviderProps {
  children: ReactNode
  kbarConfig: KBarSearchProps
}

export function SearchProvider({ children, kbarConfig }: SearchProviderProps) {
  const router = useRouter()
  const locale = useLocale()

  const { searchDocumentsPath, defaultActions, onSearchDocumentsLoad } = kbarConfig
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const mapPosts = (posts: CoreContent<MDXDocument>[]) => {
      const actions: Action[] = []
      for (const post of posts) {
        if (post.language !== locale) continue

        actions.push({
          id: post.path,
          name: post.title,
          keywords: post?.summary || '',
          subtitle: formatDate(post.date, locale),
          perform: () => router.push('/' + post.path),
        })
      }
      return actions
    }
    async function fetchData() {
      if (searchDocumentsPath) {
        const url =
          searchDocumentsPath.indexOf('://') > 0 || searchDocumentsPath.indexOf('//') === 0
            ? searchDocumentsPath
            : new URL(searchDocumentsPath, window.location.origin)
        const res = await fetch(url)
        const json = await res.json()
        const actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(json) : mapPosts(json)
        setSearchActions(actions)
        setDataLoaded(true)
      }
    }
    if (!dataLoaded && searchDocumentsPath) {
      fetchData()
    } else {
      setDataLoaded(true)
    }
  }, [defaultActions, dataLoaded, router, searchDocumentsPath, onSearchDocumentsLoad])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
