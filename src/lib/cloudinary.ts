import type { CloudinaryAsset } from "@/types";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE,
  ALLOWED_ALL_TYPES,
} from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type UploadOptions = {
  /** Cloudinary folder, e.g. "campuscore/courses" */
  folder?: string;
  /** Optional callback fired as upload progresses (0–100) */
  onProgress?: (percent: number) => void;
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (max ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`;
  }
  if (!ALLOWED_ALL_TYPES.includes(file.type as never)) {
    return `File type not allowed (${file.type || "unknown"})`;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Upload                                                             */
/* ------------------------------------------------------------------ */

/**
 * Upload a single file to Cloudinary using an unsigned upload preset.
 * Returns a normalized `CloudinaryAsset` on success.
 * Throws a descriptive Error on failure.
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryAsset> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Check NEXT_PUBLIC_CLOUDINARY_* env vars."
    );
  }

  const validationError = validateFile(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (options.folder) formData.append("folder", options.folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

  // Use XMLHttpRequest so we can report progress (fetch doesn't support
  // upload progress reliably yet).
  return new Promise<CloudinaryAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && options.onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        options.onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            type: normalizeResourceType(data.resource_type),
            name: data.original_filename ?? file.name,
            size: data.bytes ?? file.size,
          });
        } catch {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err?.error?.message) message = err.error.message;
        } catch {
          // ignore — use default message
        }
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeResourceType(
  resourceType: string
): CloudinaryAsset["type"] {
  if (resourceType === "image" || resourceType === "video") return resourceType;
  return "raw";
}

/**
 * Derive a "safe" URL for inline viewing. For PDFs and Office docs,
 * Cloudinary serves a preview at a transformation URL.
 */
export function getPreviewUrl(asset: CloudinaryAsset): string {
  if (asset.type === "image") return asset.url;
  if (asset.type === "video") return asset.url;
  // raw (docs) — Cloudinary can serve as image preview
  return asset.url.replace("/raw/upload/", "/image/upload/");
}

/** Human-readable file size */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}