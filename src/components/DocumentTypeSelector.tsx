import React from 'react';

interface DocumentTypeSelectorProps {
  documentType: 'passport' | 'license';
  onSelect: (type: 'passport' | 'license') => void;
}

export default function DocumentTypeSelector({ documentType, onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onSelect('passport')}
        className={`px-4 py-2 rounded-lg ${
          documentType === 'passport'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Passport
      </button>
      <button
        onClick={() => onSelect('license')}
        className={`px-4 py-2 rounded-lg ${
          documentType === 'license'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Driver's License
      </button>
    </div>
  );
}