import React, { useCallback, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import type { DocumentData } from '../types';
import DocumentTypeSelector from './DocumentTypeSelector';
import FileUploader from './FileUploader';
import ResultDisplay from './ResultDisplay';
import { processImageWithOCR } from '../utils/ocrProcessor';

export default function DocumentScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [extractedData, setExtractedData] = useState<DocumentData | null>(null);
  const [documentType, setDocumentType] = useState<'passport' | 'license'>('passport');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setPreview('');
    setExtractedData(null);
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setExtractedData(null);
    
    try {
      const data = await processImageWithOCR(file, documentType);
      setExtractedData(data);
    } catch (err) {
      setError('Failed to process document. Please ensure the image is clear and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Document Scanner</h1>
            <DocumentTypeSelector 
              documentType={documentType}
              onSelect={setDocumentType}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUploader
              preview={preview}
              onFileChange={handleFileChange}
              onClear={handleClear}
            />

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || loading}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg
                  ${!file || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  text-white font-medium transition-colors
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Document...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Scan Document
                  </>
                )}
              </button>
            </div>
          </form>

          {extractedData && <ResultDisplay data={extractedData} />}
        </div>
      </div>
    </div>
  );
}