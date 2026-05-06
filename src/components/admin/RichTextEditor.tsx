'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color: #6B4EFF; text-decoration: underline;',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const btnStyle = (isActive: boolean) => ({
    background: isActive ? 'var(--color-ink-deep)' : 'var(--color-surface)',
    color: isActive ? 'white' : 'var(--color-ink)',
    border: '1px solid var(--color-hairline)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  })

  function addLink() {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div style={{
      border: '1px solid var(--color-hairline-strong)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--color-canvas)',
    }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        padding: '10px 12px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-hairline)',
      }}>

        {/* Headings */}
        {([1, 2, 3, 4, 5, 6] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            style={btnStyle(editor.isActive('heading', { level }))}
          >
            H{level}
          </button>
        ))}

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={btnStyle(editor.isActive('bold'))}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={btnStyle(editor.isActive('italic'))}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={btnStyle(editor.isActive('underline'))}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={btnStyle(editor.isActive('strike'))}
        >
          <s>S</s>
        </button>

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={btnStyle(editor.isActive('bulletList'))}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={btnStyle(editor.isActive('orderedList'))}
        >
          1. List
        </button>

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          style={btnStyle(editor.isActive({ textAlign: 'left' }))}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          style={btnStyle(editor.isActive({ textAlign: 'center' }))}
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          style={btnStyle(editor.isActive({ textAlign: 'right' }))}
        >
          →
        </button>

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          style={btnStyle(editor.isActive('link'))}
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          style={btnStyle(false)}
        >
          Unlink
        </button>

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Blockquote + Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={btnStyle(editor.isActive('blockquote'))}
        >
          " Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          style={btnStyle(editor.isActive('code'))}
        >
          {'</>'}
        </button>

        <div style={{ width: '1px', background: 'var(--color-hairline)', margin: '0 4px' }} />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          style={btnStyle(false)}
        >
          ↩ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          style={btnStyle(false)}
        >
          ↪ Redo
        </button>

      </div>

      {/* Editor Content */}
      <style>{`
        .tiptap-editor {
          padding: 16px;
          min-height: 300px;
          outline: none;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--color-ink);
          line-height: 1.7;
        }
        .tiptap-editor h1 { font-size: 28px; font-weight: 700; margin: 20px 0 12px; color: var(--color-ink-deep); }
        .tiptap-editor h2 { font-size: 24px; font-weight: 600; margin: 18px 0 10px; color: var(--color-ink-deep); }
        .tiptap-editor h3 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: var(--color-ink-deep); }
        .tiptap-editor h4 { font-size: 18px; font-weight: 600; margin: 14px 0 8px; color: var(--color-ink-deep); }
        .tiptap-editor h5 { font-size: 16px; font-weight: 600; margin: 12px 0 6px; color: var(--color-ink-deep); }
        .tiptap-editor h6 { font-size: 14px; font-weight: 600; margin: 10px 0 6px; color: var(--color-ink-deep); }
        .tiptap-editor p { margin: 0 0 12px; }
        .tiptap-editor ul { padding-left: 24px; margin: 12px 0; }
        .tiptap-editor ol { padding-left: 24px; margin: 12px 0; }
        .tiptap-editor li { margin-bottom: 6px; }
        .tiptap-editor a { color: #6B4EFF; text-decoration: underline; }
        .tiptap-editor blockquote { border-left: 3px solid var(--color-primary); padding-left: 16px; margin: 16px 0; color: var(--color-slate); font-style: italic; }
        .tiptap-editor code { background: var(--color-surface); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
        .tiptap-editor strong { font-weight: 700; }
        .tiptap-editor em { font-style: italic; }
        .tiptap-editor s { text-decoration: line-through; }
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-muted);
          pointer-events: none;
          height: 0;
        }
      `}</style>

      <EditorContent
        editor={editor}
        className="tiptap-editor"
      />

    </div>
  )
}
