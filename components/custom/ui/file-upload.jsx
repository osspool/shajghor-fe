// components/custom/ui/file-upload.jsx
"use client"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

export function FileUpload({
  onFileChange,
  accept = "*",
  className,
  buttonText = "Upload File",
  showPreview = false,
  previewUrl,
  onRemove,
  disabled = false,
}) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(previewUrl || null)
  const [fileName, setFileName] = useState(null)

  const handleButtonClick = (e) => {
    e.preventDefault()
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    
    // Pass the file directly to the parent component along with the event
    onFileChange(file, e)

    if (showPreview && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    setPreview(null)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          onClick={handleButtonClick} 
          variant="outline" 
          size="sm"
          disabled={disabled}
        >
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        {(fileName || previewUrl) && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {fileName && !showPreview && (
        <div className="text-sm text-muted-foreground">{fileName}</div>
      )}
      
      {showPreview && preview && (
        <div className="relative mt-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-40 rounded-md object-contain" 
          />
        </div>
      )}
    </div>
  )
}