import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useTheme } from '../../context/theme'

const DEFAULT_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline',],
    [{ header: [1, 2, 3, false] }],
    [{ 'color': [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link'],
    
  ],
}

const sanitizeHtml = (html) => {
  if (!html || html === '<p><br></p>') {
    return ''
  }
  return html
}

const RichTextEditor = ({
  id,
  value,
  onChange,
  placeholder,
  modules = DEFAULT_MODULES,
  minHeight = 120,
  wrapperStyle,
  theme = 'snow',
}) => {
  const t = useTheme()
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const isUpdatingRef = useRef(false)
  const initialValueRef = useRef(value)
  const lastUserValueRef = useRef(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Initialize Quill only once
  useEffect(() => {
    if (!editorRef.current) {
      return
    }

    // Check if Quill is already initialized on this element
    if (quillRef.current || editorRef.current.__quill) {
      return
    }

    const quillInstance = new Quill(editorRef.current, {
      theme,
      placeholder,
      modules,
    })

    // Mark the element to prevent re-initialization
    editorRef.current.__quill = quillInstance

    quillRef.current = quillInstance

    // Set initial value if provided
    if (initialValueRef.current) {
      quillInstance.clipboard.dangerouslyPasteHTML(initialValueRef.current)
    }

    // Apply styling after initialization
    const editorElement = editorRef.current.querySelector('.ql-editor')
    if (editorElement) {
      editorElement.style.fontFamily = t.font.family
      editorElement.style.fontSize = t.font.size.md
      editorElement.style.color = '#fefaff'
      editorElement.style.minHeight = `${minHeight}px`
    }

    const handleTextChange = () => {
      if (isUpdatingRef.current) {
        return
      }
      const html = quillInstance.root.innerHTML
      const sanitized = sanitizeHtml(html)
      lastUserValueRef.current = sanitized
      onChangeRef.current?.(sanitized)
    }

    quillInstance.on('text-change', handleTextChange)

    return () => {
      quillInstance.off('text-change', handleTextChange)
      // Clear the editor content before destroying
      const editorElement = editorRef.current?.querySelector('.ql-editor')
      if (editorElement) {
        editorElement.innerHTML = ''
      }
      if (editorRef.current) {
        delete editorRef.current.__quill
      }
      quillRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Initialize only once - we use refs for dynamic values

  // Update styling when theme changes
  useEffect(() => {
    if (!quillRef.current || !editorRef.current) {
      return
    }
    const editorElement = editorRef.current.querySelector('.ql-editor')
    if (editorElement) {
      editorElement.style.fontFamily = t.font.family
      editorElement.style.fontSize = t.font.size.md
      editorElement.style.color = '#0f172a'
      editorElement.style.minHeight = `${minHeight}px`
    }
  }, [minHeight, t.font.family, t.font.size.md])

  // Sync external value changes (but not during user typing)
  useEffect(() => {
    if (!quillRef.current || isUpdatingRef.current) {
      return
    }

    const currentHtml = quillRef.current.root.innerHTML
    const normalizedValue = value || ''
    const normalizedCurrent = currentHtml === '<p><br></p>' ? '' : currentHtml

    // Only update if value changed from outside (not from our own onChange)
    // Compare with last user value to avoid syncing our own changes
    if (
      normalizedValue !== normalizedCurrent &&
      value !== undefined &&
      normalizedValue !== lastUserValueRef.current
    ) {
      isUpdatingRef.current = true
      const selection = quillRef.current.getSelection()
      const delta = quillRef.current.clipboard.convert(normalizedValue)
      quillRef.current.setContents(delta, 'silent')
      if (selection && selection.length === 0) {
        // Only restore selection if it was a cursor (not a selection)
        setTimeout(() => {
          if (quillRef.current) {
            const length = quillRef.current.getLength()
            quillRef.current.setSelection(Math.min(selection.index, length - 1), 'silent')
          }
        }, 0)
      }
      lastUserValueRef.current = normalizedValue
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    } else if (normalizedValue === lastUserValueRef.current) {
      // If the value matches what we last sent, update the ref but don't sync
      lastUserValueRef.current = normalizedValue
    }
  }, [value])

  return (
    <div
      className="rich-text-editor-wrapper"
      style={{
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '14px',
        backgroundColor: 'rgba(170, 173, 174, 0.2)',
        boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        fontFamily: t.font.family,
        ...wrapperStyle,
      }}
    >
      <div ref={editorRef} id={id} />
    </div>
  )
}

RichTextEditor.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  modules: PropTypes.object,
  minHeight: PropTypes.number,
  wrapperStyle: PropTypes.object,
  theme: PropTypes.oneOf(['snow', 'bubble']),
}

export default RichTextEditor


