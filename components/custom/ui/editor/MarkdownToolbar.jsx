// components/markdown/MarkdownToolbar.jsx
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Link,
  Image,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Minus,
  HelpCircle,
  Video,
} from "lucide-react";
import { YouTubeEmbedDialog } from "./YouTubeEmbedDialog";
import { useState } from "react";

export function MarkdownToolbar({ onInsert, textareaId }) {
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const handleButtonClick = (e, text, selectionStart, selectionEnd) => {
    e.preventDefault();
    e.stopPropagation();
    onInsert(text, selectionStart, selectionEnd);
  };

  const handleYoutubeEmbed = (videoId) => {
    onInsert(`!yt[${videoId}]`, 0, 0);
  };

  const ToolbarButton = ({ icon, tooltip, onClick, shortcut }) => (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="flex flex-col items-start">
          <span>{tooltip}</span>
          {shortcut && (
            <span className="text-xs text-muted-foreground">{shortcut}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
      {/* Text Formatting */}
      <ToolbarButton
        icon={<Bold className="h-4 w-4" />}
        tooltip="Bold"
        shortcut="**bold**"
        onClick={(e) => handleButtonClick(e, "**bold**", 2, 6)}
      />

      <ToolbarButton
        icon={<Italic className="h-4 w-4" />}
        tooltip="Italic"
        shortcut="_italic_"
        onClick={(e) => handleButtonClick(e, "_italic_", 1, 7)}
      />

      <div className="w-px h-6 bg-border mx-1"></div>

      {/* Headings */}
      <ToolbarButton
        icon={<Heading1 className="h-4 w-4" />}
        tooltip="Heading 1"
        shortcut="# Heading"
        onClick={(e) => handleButtonClick(e, "# Heading 1\n", 2, 10)}
      />

      <ToolbarButton
        icon={<Heading2 className="h-4 w-4" />}
        tooltip="Heading 2"
        shortcut="## Heading"
        onClick={(e) => handleButtonClick(e, "## Heading 2\n", 3, 11)}
      />

      <ToolbarButton
        icon={<List className="h-4 w-4" />}
        tooltip="Bullet List"
        shortcut="- item"
        onClick={(e) => handleButtonClick(e, "- List item\n", 2, 11)}
      />

      <ToolbarButton
        icon={<ListOrdered className="h-4 w-4" />}
        tooltip="Numbered List"
        shortcut="1. item"
        onClick={(e) => handleButtonClick(e, "1. List item\n", 3, 12)}
      />

      <div className="w-px h-6 bg-border mx-1"></div>

      {/* Links and Media */}
      <ToolbarButton
        icon={<Link className="h-4 w-4" />}
        tooltip="Link"
        shortcut="[text](url)"
        onClick={(e) =>
          handleButtonClick(e, "[link text](https://example.com)", 1, 10)
        }
      />

      <ToolbarButton
        icon={<Image className="h-4 w-4" />}
        tooltip="Image"
        shortcut="![alt](url)"
        onClick={(e) =>
          handleButtonClick(
            e,
            "![image alt](https://example.com/image.jpg)",
            2,
            11
          )
        }
      />

      <ToolbarButton
        icon={<Video className="h-4 w-4 text-red-500" />}
        tooltip="YouTube Video"
        shortcut="Embed video"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setYoutubeDialogOpen(true);
        }}
      />

      <YouTubeEmbedDialog
        open={youtubeDialogOpen}
        onOpenChange={setYoutubeDialogOpen}
        onEmbed={handleYoutubeEmbed}
      />

      <ToolbarButton
        icon={<Code className="h-4 w-4" />}
        tooltip="Code Block"
        shortcut="```code```"
        onClick={(e) => handleButtonClick(e, "```\ncode block\n```", 4, 14)}
      />

      <ToolbarButton
        icon={<Minus className="h-4 w-4" />}
        tooltip="Horizontal Rule"
        shortcut="---"
        onClick={(e) => handleButtonClick(e, "\n---\n", 0, 0)}
      />

      <div className="ml-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1 text-muted-foreground"
              >
                <HelpCircle className="h-3 w-3" />
                <span>Markdown Guide</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80 p-4">
              <div className="space-y-2 text-sm">
                <h3 className="font-medium">Markdown Cheatsheet</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <code className="text-xs"># Heading 1</code>
                  </div>
                  <div>Large heading</div>
                  <div>
                    <code className="text-xs">!yt[videoId]</code>
                  </div>
                  <div>YouTube embed</div>
                  <div>
                    <code className="text-xs">## Heading 2</code>
                  </div>
                  <div>Medium heading</div>
                  <div>
                    <code className="text-xs">**bold**</code>
                  </div>
                  <div>Bold text</div>
                  <div>
                    <code className="text-xs">_italic_</code>
                  </div>
                  <div>Italic text</div>
                  <div>
                    <code className="text-xs">[Link](url)</code>
                  </div>
                  <div>Hyperlink</div>
                  <div>
                    <code className="text-xs">![Alt](url)</code>
                  </div>
                  <div>Image</div>
                  <div>
                    <code className="text-xs">- item</code>
                  </div>
                  <div>Bullet list</div>
                  <div>
                    <code className="text-xs">1. item</code>
                  </div>
                  <div>Numbered list</div>
                  <div>
                    <code className="text-xs">```code```</code>
                  </div>
                  <div>Code block</div>
                  <div>
                    <code className="text-xs">---</code>
                  </div>
                  <div>Horizontal rule</div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
