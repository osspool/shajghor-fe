"use client"

import { toast } from "sonner"
import { useTranslations } from "@/components/providers/translations-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useTranslations()

  const languages = [
    { code: 'en', label: 'English', icon: '🇬🇧' },
    { code: 'bn', label: 'Bangla', icon: '🇧🇩' },
  ]

  const onSelect = (value) => {
    setLocale(value)
    toast.success(`${t('status.language')} ${languages.find(lang => lang.code === value)?.label}`)
  }

  return (
    <Select value={locale} onValueChange={onSelect}>
      <SelectTrigger className="bg-transparent border-0 shadow-none h-9 px-2 hover:bg-retro-secondary/10 rounded-md transition-colors">
        <span>{languages.find(lang => lang.code === locale)?.icon}</span>
      </SelectTrigger>
      <SelectContent className="retro-card retro-card-secondary min-w-32">
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            className="font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {language.icon} {language.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}