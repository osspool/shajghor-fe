// @/components/custom/ui/editor/MarkdownPreview.jsx
import { useState, useEffect } from 'react'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'

export function MarkdownPreview({ content }) {
  const [html, setHtml] = useState('')
  
  useEffect(() => {
    if (!content) {
      setHtml('')
      return
    }
    
    // Process normal markdown
    let result = micromark(content, {
      extensions: [gfm()],
      htmlExtensions: [gfmHtml()]
    })
    
    // Process YouTube embeds
    // Pattern: !yt[videoId]
    result = result.replace(
      /!yt\[(.*?)\]/g, 
      (match, videoId) => {
        return `
          <div class="youtube-embed-container">
            <iframe 
              width="100%" 
              height="315" 
              src="https://www.youtube.com/embed/${videoId}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    );
    
    setHtml(result)
  }, [content])
  
  if (!content) {
    return <p className="text-muted-foreground italic">No content to preview</p>
  }

  return (
    <article 
      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-p:my-3 prose-li:my-0.5 prose-ul:list-disc prose-ol:list-decimal"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}