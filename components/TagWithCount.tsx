'use client'

import Link from 'next/link'
import { slug } from 'github-slugger'
import { useState } from 'react'

interface Props {
  text: string
  count: number
}

const TagWithCount = ({ text, count }: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hover:text-primary-600 dark:hover:text-primary-300 mt-2 mr-5 mb-2 text-sm font-medium text-gray-600 capitalize dark:text-gray-300"
    >
      <Link href={`/tags/${slug(text)}`} aria-label={`View posts tagged ${text}`}>
        {text}{' '}
        <span
          className={`rounded-full bg-gray-200 px-3 py-1 font-bold dark:bg-gray-800 ${isHovered && 'bg-primary-200 dark:bg-primary-800'}`}
        >
          {count}
        </span>
      </Link>
    </div>
  )
}

export default TagWithCount
