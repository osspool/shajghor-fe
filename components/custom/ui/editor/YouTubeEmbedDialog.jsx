// @/components/custom/ui/editor/YouTubeEmbedDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function YouTubeEmbedDialog({ open, onOpenChange, onEmbed }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleEmbed = () => {
    // Check if URL is valid
    const videoId = extractYoutubeVideoId(url);
    if (!videoId) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    onEmbed(videoId);
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Embed YouTube Video</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="youtube-url">YouTube URL</Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleEmbed}>Embed Video</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to extract YouTube video ID from various URL formats
function extractYoutubeVideoId(url) {
  if (!url) return null;
  
  // Match standard YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}