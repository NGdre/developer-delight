'use client'

import { useState, useRef, ReactNode } from 'react'

const Pre = ({ children }: { children: ReactNode }) => {
  const textInput = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    if (!textInput.current) return

    setCopied(true)
    navigator.clipboard.writeText(textInput.current.textContent || '')
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div ref={textInput} className="relative">
      <button
        aria-label="Copy code"
        className="absolute top-2 right-2 h-8 w-8 cursor-pointer rounded p-1 hover:bg-gray-500/20"
        onClick={onCopy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className="text-gray-500"
        >
          {copied ? (
            <polyline points="6.559 12.846 9.622 15.91 17.441 8.09" strokeWidth={2} />
          ) : (
            <path
              d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z"
              strokeWidth={2}
            />
          )}
        </svg>
      </button>

      <pre>{children}</pre>
    </div>
  )
}

export default Pre
