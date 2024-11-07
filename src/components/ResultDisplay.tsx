import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { DocumentData } from '../types';

interface ResultDisplayProps {
  data: DocumentData;
}

export default function ResultDisplay({ data }: ResultDisplayProps) {
  const hasUndetectedFields = 
    data.name === 'Not Found' || 
    data.documentNumber === 'Not Found' || 
    data.expirationDate === 'Not Found';

  return (
    <div className={`mt-8 p-6 rounded-lg ${hasUndetectedFields ? 'bg-yellow-50' : 'bg-green-50'}`}>
      <div className="flex items-center gap-2 mb-4">
        {hasUndetectedFields ? (
          <>
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-yellow-800">
              Document Scanned - Some Fields Not Detected
            </h2>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-green-800">
              Document Successfully Scanned
            </h2>
          </>
        )}
      </div>
      <div className="grid gap-4">
        <div className={`flex justify-between p-3 rounded-lg ${
          data.name === 'Not Found' ? 'bg-yellow-100' : 'bg-white'
        }`}>
          <span className="font-medium text-gray-600">Name:</span>
          <span className={`${
            data.name === 'Not Found' ? 'text-yellow-700' : 'text-gray-900'
          }`}>{data.name}</span>
        </div>
        <div className={`flex justify-between p-3 rounded-lg ${
          data.documentNumber === 'Not Found' ? 'bg-yellow-100' : 'bg-white'
        }`}>
          <span className="font-medium text-gray-600">Document Number:</span>
          <span className={`${
            data.documentNumber === 'Not Found' ? 'text-yellow-700' : 'text-gray-900'
          }`}>{data.documentNumber}</span>
        </div>
        <div className={`flex justify-between p-3 rounded-lg ${
          data.expirationDate === 'Not Found' ? 'bg-yellow-100' : 'bg-white'
        }`}>
          <span className="font-medium text-gray-600">Expiration Date:</span>
          <span className={`${
            data.expirationDate === 'Not Found' ? 'text-yellow-700' : 'text-gray-900'
          }`}>{data.expirationDate}</span>
        </div>
      </div>
      {hasUndetectedFields && (
        <p className="mt-4 text-sm text-yellow-700">
          Tip: Ensure the document is well-lit, properly aligned, and all text is clearly visible.
        </p>
      )}
    </div>
  );
}