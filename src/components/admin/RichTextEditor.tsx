'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'align',
    'color', 'background',
    'link', 'image', 'video'
  ]

  return (
    <div className="wordpress-editor-container">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your blog post here..."
      />
      <style jsx global>{`
        .wordpress-editor-container .ql-container {
          min-height: 350px;
          font-family: var(--font-sans);
          font-size: 15px;
          background: white;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 1px solid var(--color-hairline-strong) !important;
          border-top: none !important;
        }
        .wordpress-editor-container .ql-toolbar {
          background: #f8f9fa;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border: 1px solid var(--color-hairline-strong) !important;
        }
        .wordpress-editor-container .ql-editor {
          min-height: 350px;
          padding: 20px;
          line-height: 1.6;
          color: var(--color-ink);
        }
        .wordpress-editor-container .ql-editor h1,
        .wordpress-editor-container .ql-editor h2,
        .wordpress-editor-container .ql-editor h3 {
          color: var(--color-ink-deep);
          margin-bottom: 12px;
        }
        .wordpress-editor-container .ql-editor p {
          margin-bottom: 12px;
        }
        .wordpress-editor-container .ql-editor img {
          max-width: 100%;
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}
