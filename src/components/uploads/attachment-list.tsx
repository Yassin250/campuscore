"use client";

import { ExternalLink, FileText, Image as ImageIcon, Video } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatFileSize, getPreviewUrl } from "@/lib/cloudinary";
import type { CloudinaryAsset } from "@/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AttachmentListProps = {
  assets: CloudinaryAsset[];
  /** Optional heading shown above the list */
  title?: string;
  /** Layout — grid of cards or compact rows. Default "grid" */
  variant?: "grid" | "list";
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AttachmentList({
  assets,
  title,
  variant = "grid",
  className,
}: AttachmentListProps) {
  if (assets.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}

      {variant === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AttachmentCard key={asset.publicId} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {assets.map((asset) => (
            <AttachmentRow key={asset.publicId} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}

AttachmentList.displayName = "AttachmentList";

/* ------------------------------------------------------------------ */
/*  Grid card                                                          */
/* ------------------------------------------------------------------ */

function AttachmentCard({ asset }: { asset: CloudinaryAsset }) {
  const isImage = asset.type === "image";
  const isVideo = asset.type === "video";

  return (
    <Link
      href={asset.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      {/* Preview */}
      <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPreviewUrl(asset)}
            alt={asset.name ?? "Attachment"}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : isVideo ? (
          <Video className="h-8 w-8 text-muted-foreground" />
        ) : (
          <FileText className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {asset.name ?? "Untitled"}
          </p>
          <p className="text-xs text-muted-foreground">
            {asset.type === "image"
              ? "Image"
              : asset.type === "video"
                ? "Video"
                : "Document"}
            {asset.size ? ` · ${formatFileSize(asset.size)}` : ""}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  List row                                                           */
/* ------------------------------------------------------------------ */

function AttachmentRow({ asset }: { asset: CloudinaryAsset }) {
  const Icon =
    asset.type === "image"
      ? ImageIcon
      : asset.type === "video"
        ? Video
        : FileText;

  return (
    <Link
      href={asset.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {asset.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPreviewUrl(asset)}
            alt={asset.name ?? "Attachment"}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {asset.name ?? "Untitled"}
        </p>
        <p className="text-xs text-muted-foreground">
          {asset.size ? formatFileSize(asset.size) : ""}
        </p>
      </div>

      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}