"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Upload, X, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  failed?: boolean;
  fileObject?: File;
}

interface FileUploadContextType {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onDropFiles: (files: FileList) => void;
  onDeleteFile: (id: string) => void;
  onRetryFile: (id: string) => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(
  undefined
);

const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUpload.Root");
  }
  return context;
};

interface FileUploadRootProps {
  children: ReactNode;
  onDropFiles?: (files: FileList) => void;
  onDeleteFile?: (id: string) => void;
  onRetryFile?: (id: string) => void;
}

const FileUploadRoot: React.FC<FileUploadRootProps> = ({
  children,
  onDropFiles: externalOnDropFiles,
  onDeleteFile: externalOnDeleteFile,
  onRetryFile: externalOnRetryFile,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDropFiles = useCallback(
    (files: FileList) => {
      const newFiles = Array.from(files);
      const newFilesWithIds = newFiles.map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        fileObject: file,
      }));

      setUploadedFiles((prev) => [
        ...newFilesWithIds.map(({ fileObject: _, ...file }) => file),
        ...prev,
      ]);

      if (externalOnDropFiles) {
        externalOnDropFiles(files);
      }
    },
    [externalOnDropFiles]
  );

  const handleDeleteFile = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
      if (externalOnDeleteFile) {
        externalOnDeleteFile(id);
      }
    },
    [externalOnDeleteFile]
  );

  const handleRetryFile = useCallback(
    (id: string) => {
      if (externalOnRetryFile) {
        externalOnRetryFile(id);
      }
    },
    [externalOnRetryFile]
  );

  return (
    <FileUploadContext.Provider
      value={{
        uploadedFiles,
        setUploadedFiles,
        onDropFiles: handleDropFiles,
        onDeleteFile: handleDeleteFile,
        onRetryFile: handleRetryFile,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

interface DropZoneProps {
  children?: ReactNode;
  isDisabled?: boolean;
  onDropFiles?: (files: FileList) => void;
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  children,
  isDisabled = false,
  onDropFiles,
  className,
}) => {
  const { onDropFiles: contextOnDropFiles } = useFileUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (isDisabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const handler = onDropFiles || contextOnDropFiles;
        handler(files);
      }
    },
    [isDisabled, onDropFiles, contextOnDropFiles]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const handler = onDropFiles || contextOnDropFiles;
        handler(target.files);
      }
    };
    input.click();
  }, [isDisabled, onDropFiles, contextOnDropFiles]);

  return (
    <div
      className={cx(
        "border border-primary-50 rounded-lg p-6 text-center transition-colors cursor-pointer",
        dragActive && !isDisabled
          ? "border-primary-500 bg-primary-50"
          : "border-gray-300 hover:border-gray-400",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {children || (
        <>
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm  text-gray-900 mb-1">
            <span className="font-semibold text-[#E31B54]">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (max. 800x400px){" "}
          </p>
        </>
      )}
    </div>
  );
};

interface ListProps {
  children: ReactNode;
  className?: string;
}

const List: React.FC<ListProps> = ({ children, className }) => {
  return <div className={cx("space-y-2", className)}>{children}</div>;
};

interface ListItemProgressBarProps extends UploadedFile {
  onDelete: () => void;
  onRetry: () => void;
  className?: string;
}

const ListItemProgressBar: React.FC<ListItemProgressBarProps> = ({
  id,
  name,
  type,
  size,
  progress,
  failed = false,
  onDelete,
  onRetry,
  className,
}) => {
  const getFileIcon = () => {
    if (failed) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (progress === 100)
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    return <Upload className="w-4 h-4 text-gray-400" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={cx(
        "flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50",
        className
      )}
    >
      <div className="flex-shrink-0">{getFileIcon()}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500">{getFileSize(size)}</p>

        {!failed && progress < 100 && (
          <div className="mt-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        )}

        {failed && <p className="text-xs text-red-500 mt-1">Upload failed</p>}
      </div>

      <div className="flex-shrink-0 flex gap-1">
        {failed && (
          <Button color="secondary" size="sm" onClick={onRetry} className="p-1">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        <Button color="secondary" size="sm" onClick={onDelete} className="p-1">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const FileUpload = {
  Root: FileUploadRoot,
  DropZone,
  List,
  ListItemProgressBar,
};

export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
