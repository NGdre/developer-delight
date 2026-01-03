/* eslint-disable jsx-a11y/anchor-has-content */
import { Link as LocaleLink } from '@/i18n/navigation'

import Link from 'next/link'

import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

const CustomLink = ({
  href,
  withoutLocale,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { withoutLocale?: boolean }) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    if (withoutLocale) return <Link className="break-words" href={href} {...rest} />
    else return <LocaleLink className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
