import { createWorker } from 'tesseract.js';
import type { DocumentData } from '../types';

export async function processImageWithOCR(imageFile: File, documentType: 'passport' | 'license'): Promise<DocumentData> {
  const worker = await createWorker('eng');
  
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: '3',
      preserve_interword_spaces: '1',
    });

    const imageUrl = URL.createObjectURL(imageFile);
    const { data: { text } } = await worker.recognize(imageUrl);
    
    URL.revokeObjectURL(imageUrl);
    
    const extractedData = parseOCRText(text, documentType);
    
    await worker.terminate();
    return extractedData;
  } catch (error) {
    await worker.terminate();
    throw new Error('Failed to process document');
  }
}

function parseOCRText(text: string, documentType: 'passport' | 'license'): DocumentData {
  const normalizedText = text.replace(/\s+/g, ' ').toUpperCase();
  const lines = normalizedText.split('\n').map(line => line.trim());
  
  if (documentType === 'passport') {
    return parsePassportData(lines, normalizedText);
  } else {
    return parseDriverLicenseData(lines, normalizedText);
  }
}

function parsePassportData(lines: string[], fullText: string): DocumentData {
  let name = '';
  let documentNumber = '';
  let expirationDate = '';

  // Name detection patterns for passport
  const namePatterns = [
    /SURNAME\s*[:]?\s*([A-Z\s]+)\s*(?:GIVEN|FIRST)/i,
    /NAME\s*[:]?\s*([A-Z\s]+)\s*(?:NATIONALITY|DATE)/i,
    /GIVEN\s+NAMES\s*[:]?\s*([A-Z\s]+)/i
  ];

  // Document number patterns for passport
  const passportNumberPatterns = [
    /PASSPORT\s*(?:NO|NUMBER|#)?\s*[:]?\s*([A-Z0-9]{7,9})/i, 
    /DOCUMENT\s*(?:NO|NUMBER|#)?\s*[:]?\s*([A-Z0-9]{7,9})/i, 
    /(?:^|\s)([A-Z0-9]{7,9})(?:\s|$)/m 
  ];

  // Expiration date patterns for passport
  const datePatterns = [
    /(?:EXPIRY|EXPIRATION|VALIDITY)\s*(?:DATE|UNTIL|THRU)?\s*[:]?\s*(\d{2}[-/.]\d{2}[-/.]\d{2,4})/i,
    /VALID(?:ITY)?\s*[:]?\s*(\d{2}[-/.]\d{2}[-/.]\d{2,4})/i, 
    /(?<=\s|^)(\d{2}[-/.]\d{2}[-/.]\d{2,4})(?=\s|$)/m  
  ];

  for (const pattern of namePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      break;
    }
  }

  for (const pattern of passportNumberPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      documentNumber = match[1].trim();
      if (/^[A-Z0-9]{7,9}$/.test(documentNumber)) {
        break;
      }
    }
  }

  for (const pattern of datePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      expirationDate = formatDate(match[1]);
      break;
    }
  }

  return {
    name: name || 'Not Found',
    documentNumber: documentNumber || 'Not Found',
    expirationDate: expirationDate || 'Not Found',
    documentType: 'passport'
  };
}

function parseDriverLicenseData(lines: string[], fullText: string): DocumentData {
  let name = '';
  let documentNumber = '';
  let expirationDate = '';

  // Updated name detection patterns for driver's license
  const namePatterns = [
    /NAME\s*[:\-\s]*([A-Z\s]+)/i,
    /\bName\s*[:\-\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /Name\s*[:\-\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i
  ];

  // Updated license number patterns, allowing for "MH" or other starting letters
  const licenseNumberPatterns = [
    /\b([A-Z]{2}[0-9]{11})\b/,  // Matches formats like MH32300011066
    /\bLICENSE\s*(?:NO|NUMBER|#)?\s*[:\-\s]*([A-Z0-9]{6,12})/i,
    /\bDL\s*(?:NO|NUMBER|#)?\s*[:\-\s]*([A-Z0-9]{6,12})/i
  ];

  // Expiration date patterns for driver's license
  const datePatterns = [
    /(?:EXPIRY|EXPIRATION|VALIDITY)\s*(?:DATE|UNTIL|THRU)?\s*[:\-\s]*?(\d{2}[-/.]\d{2}[-/.]\d{2,4})/i,
    /VALID(?:ITY)?\s*[:\-\s]*?(\d{2}[-/.]\d{2}[-/.]\d{2,4})/i, 
    /\b(\d{2}[-/.]\d{2}[-/.]\d{2,4})\b/
  ];

  // Extract name
  for (const pattern of namePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      break;
    }
  }

  // Extract license number
  for (const pattern of licenseNumberPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      documentNumber = match[1].trim();
      break;
    }
  }

  // Extract expiration date
  for (const pattern of datePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      expirationDate = formatDate(match[1]);
      break;
    }
  }

  return {
    name: name || 'Not Found',
    documentNumber: documentNumber || 'Not Found',
    expirationDate: expirationDate || 'Not Found',
    documentType: 'license'
  };
}

function formatDate(dateStr: string): string {
  const cleanDate = dateStr.replace(/[^\d./-]/g, '');
  const parts = cleanDate.split(/[-/.]/);
  
  if (parts.length === 3) {
    let [day, month, year] = parts;
    
    if (year.length === 2) {
      const currentYear = new Date().getFullYear();
      const century = Math.floor(currentYear / 100) * 100;
      year = `${century + parseInt(year)}`;
    }
    
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  return dateStr;
}
