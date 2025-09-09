// @/components/custom/ui/editor/MarkdownEditor.jsx
"use client"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownToolbar } from "./MarkdownToolbar"
import { MarkdownPreview } from "./MarkdownPreview"

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Write markdown here..." 
}) {
  const [activeTab, setActiveTab] = useState("edit")
  const textareaRef = useRef(null)
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleInsert = (text, selectionStart, selectionEnd) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const currentValue = textarea.value || ""
    const cursorPos = textarea.selectionStart
    const textBefore = currentValue.substring(0, textarea.selectionStart)
    const textAfter = currentValue.substring(textarea.selectionEnd)
    
    const newValue = textBefore + text + textAfter
    onChange(newValue)
    
    // Set selection if provided
    setTimeout(() => {
      textarea.focus()
      if (selectionStart !== undefined && selectionEnd !== undefined) {
        const newCursorPos = cursorPos + selectionStart
        textarea.setSelectionRange(
          newCursorPos, 
          newCursorPos + (selectionEnd - selectionStart)
        )
      }
    }, 0)
  }

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const resizeTextarea = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(textarea.scrollHeight, 300)}px`
    }
    
    resizeTextarea()
    
    // Listen for input events to resize as user types
    textarea.addEventListener('input', resizeTextarea)
    
    return () => {
      textarea.removeEventListener('input', resizeTextarea)
    }
  }, [value])

  return (
    <Card className="w-full border shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b bg-muted/20 px-2">
          <TabsList className="h-10">
            <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="mt-0 p-0">
          <MarkdownToolbar 
            textareaId="markdown-editor"
            onInsert={handleInsert}
          />
          
          <div className="p-4">
            <textarea
              id="markdown-editor"
              ref={textareaRef}
              value={value || ""}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full min-h-[300px] outline-none resize-none font-mono text-sm p-0 bg-transparent"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="p-4 min-h-[300px] overflow-auto">
            <MarkdownPreview content={value || ""} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}