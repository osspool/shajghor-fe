import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChatSDKError } from "./errors";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Normalize possible populated objects to string ids
export const getIdString = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val._id) return val._id;
  return "";
};

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function fetchWithErrorHandlers(
  input, //: RequestInfo | URL,
  init //: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      try {
        const { code, cause } = await response.json();
        throw new ChatSDKError(code, cause);
      } catch (jsonError) {
        // If we can't parse the JSON or code is undefined, throw a generic error
        if (response.status === 404) {
          throw new ChatSDKError(
            "not_found:api",
            `Resource not found: ${input}`
          );
        }
        throw new ChatSDKError(
          `bad_request:api`,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }
    }

    return response;
  } catch (error) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat");
    }

    throw error;
  }
}

/**
 * Formats a number as currency in USD
 *
 * @param {number|string} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export function formatCurrency(amount) {
  // Handle undefined or null amounts
  if (amount === undefined || amount === null) {
    return "";
  }

  // Convert string to number if needed
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Get file extension from URL or mime type
export const getFileExtension = (file) => {
  if (!file) return "";

  if (file.media?.url) {
    const urlParts = file.media.url.split(".");
    if (urlParts.length > 1) {
      return urlParts[urlParts.length - 1].toUpperCase();
    }
  }

  if (file.media?.mimeType) {
    const mimeType = file.media.mimeType;
    if (mimeType.includes("zip") || mimeType.includes("x-zip")) return "ZIP";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("image")) return "IMG";
    if (mimeType.includes("audio")) return "AUDIO";
    if (mimeType.includes("video")) return "VIDEO";
    if (mimeType.includes("text")) return "TXT";
  }

  return "FILE";
};



export function sanitizeText(text) {
  return text.replace("<has_function_call>", "");
}

/**
 * Copy text to clipboard with optional toast notifications
 *
 * @param {string} value - The text to copy
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Whether to show toast notifications (default: true)
 * @param {string} options.successMessage - Success toast message (default: "Copied to clipboard")
 * @param {string} options.errorMessage - Error toast message (default: "Failed to copy")
 * @returns {Promise<boolean>} - Returns true if successful, false if failed
 */
export const copyToClipboard = async (value, options = {}) => {
  const {
    showToast = true,
    successMessage = "Copied to clipboard",
    errorMessage = "Failed to copy",
  } = options;

  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);

    if (showToast) {
      // Dynamic import to avoid issues if toast is not available
      const { toast } = await import("sonner");
      toast.success(successMessage);
    }

    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);

    if (showToast) {
      // Dynamic import to avoid issues if toast is not available
      const { toast } = await import("sonner");
      toast.error(errorMessage);
    }

    return false;
  }
};

export function convertToUIMessages(messages) {
  return messages.map((message) => {
    // If the message already has parts array (v5 format), just return it with required fields
    if (message.parts && Array.isArray(message.parts)) {
      return {
        id: message.id,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata,
        createdAt: message.createdAt,
      };
    }

    // Legacy conversion for messages with content or attachments
    const parts = [];

    // Convert content to parts if it exists
    if (message.content) {
      if (typeof message.content === "string") {
        parts.push({
          type: "text",
          text: message.content,
        });
      } else if (Array.isArray(message.content)) {
        // If content is already an array of parts, use it
        parts.push(...message.content);
      }
    }

    // Convert attachments to file parts if they exist
    if (message.attachments && Array.isArray(message.attachments)) {
      const fileParts = message.attachments.map((attachment) => ({
        type: "file",
        url: attachment.url,
        filename: attachment.name,
        mediaType: attachment.contentType || attachment.type,
      }));
      parts.push(...fileParts);
    }

    return {
      id: message.id,
      role: message.role,
      parts: parts,
      metadata: message.metadata,
      createdAt: message.createdAt,
    };
  });
}
