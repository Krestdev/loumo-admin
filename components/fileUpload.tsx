"use client"

import {
  AlertCircleIcon,
  ImageUpIcon,
  XIcon,
} from "lucide-react"
import { useEffect } from "react"

import { useFileUpload } from "@/hooks/use-file-upload"

interface FileUploaderProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  name: string
  maxSizeMB?: number
}

export function FileUploader({
  value,
  onChange,
  name,
  maxSizeMB = 1,
}: FileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  })

  const currentFile = value instanceof File ? value : files[0]?.file instanceof File ? files[0].file : null
  const previewUrl =  files[0]?.preview ?? (typeof value === "string" ? value : value instanceof File ? URL.createObjectURL(value) : null);

  // Update RHF when file changes
  useEffect(() => {
    if (currentFile) {
      onChange(currentFile)
    }
  }, [currentFile, onChange])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-gray-300 hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Importer le fichier"
            name={name}
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <img
                src={previewUrl.includes("http") ? previewUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL}${previewUrl.startsWith("/")?previewUrl.slice(1):previewUrl}`}
                alt={currentFile?.name || "Uploaded image"}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                {"Déposez votre image ici ou cliquez pour la parcourir"}
              </p>
              <p className="text-muted-foreground text-xs">
                {`JPG, PNG, WEBP (max. ${maxSizeMB}MB)`}
              </p>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => {
                removeFile(files[0]?.id)
                onChange(null)
              }}
              aria-label="Retirer l'image"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
