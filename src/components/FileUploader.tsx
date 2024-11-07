import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  preview: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function FileUploader({ preview, onFileChange, onClear }: FileUploaderProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Document preview"
            className="max-h-[400px] mx-auto rounded-lg"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-gray-600">Drop your document here or click to upload</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
        </label>
      )}
    </div>
  );
}