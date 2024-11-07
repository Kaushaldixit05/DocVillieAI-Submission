export interface DocumentData {
  name: string;
  documentNumber: string;
  expirationDate: string;
  documentType: 'passport' | 'license';
}

export interface ExtractedData {
  success: boolean;
  data?: DocumentData;
  error?: string;
}