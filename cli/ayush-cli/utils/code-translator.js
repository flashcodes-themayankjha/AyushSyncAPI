import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let namasteCodeMap = new Map();
let icd11CodeMap = new Map();

// Aggressive cleaning function
const cleanString = (str) => {
    if (!str) return '';
    // 1. Remove all non-printable ASCII characters (except common whitespace like space, tab, newline)
    //    \x00-\x1F are control characters, \x7F is DEL
    //    \u00A0 is non-breaking space, \u2000-\u200F are various spaces, \u2028-\u2029 are line/paragraph separators
    //    \uFEFF is BOM
    let cleaned = str.replace(/[\x00-\x1F\x7F\u00A0\u2000-\u200F\u2028-\u2029\uFEFF]/g, '');
    // 2. Normalize Unicode characters (e.g., composed vs. decomposed forms)
    cleaned = cleaned.normalize('NFC'); // NFC is usually preferred for compatibility
    return cleaned.trim(); // Final trim
};


export const loadCodeMappings = () => {
    const csvFilePath = path.join(__dirname, '..', 'maps.csv');
    try {
        const dataBuffer = fs.readFileSync(csvFilePath);
        const data = dataBuffer.toString('utf8');
        
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length <= 1) {
            console.error("maps.csv is empty or contains only headers.");
            return;
        }

        const headers = lines[0].split(',').map(h => cleanString(h)); // Clean headers too
        const namasteCodeIndex = headers.indexOf('NAMASTE Code');
        const icd11CodeIndex = headers.indexOf('ICD-11 TM2 Code');
        const namasteNameIndex = headers.indexOf('NAMASTE name');
        const conditionIndex = headers.indexOf('Condition');
        const descriptionIndex = headers.indexOf('Description');

        if (namasteCodeIndex === -1 || icd11CodeIndex === -1 || namasteNameIndex === -1 || conditionIndex === -1 || descriptionIndex === -1) {
            console.error("maps.csv is missing one or more required columns (NAMASTE Code, ICD-11 TM2 Code, NAMASTE name, Condition, Description).");
            return;
        }

        namasteCodeMap.clear();
        icd11CodeMap.clear();

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(val => cleanString(val)); // Clean values too
            
            if (values.length < headers.length) {
                continue; // Skip malformed rows
            }

            const entry = {
                'NAMASTE name': values[namasteNameIndex],
                'NAMASTE Code': values[namasteCodeIndex],
                'ICD-11 TM2 Code': values[icd11CodeIndex],
                'Condition': values[conditionIndex],
                'Description': values[descriptionIndex]
            };

            if (entry['NAMASTE Code'] && entry['ICD-11 TM2 Code']) {
                namasteCodeMap.set(cleanString(entry['NAMASTE Code']).toUpperCase(), entry);
                icd11CodeMap.set(cleanString(entry['ICD-11 TM2 Code']).toUpperCase(), entry);
            }
        }
    } catch (error) {
        console.error('Error loading code mappings:', error.message);
    }
};

loadCodeMappings();

export const translateNamasteToIcd11 = (namasteCode) => {
    const lookupCode = cleanString(namasteCode).toUpperCase(); // Clean and uppercase input
    return namasteCodeMap.get(lookupCode) || null;
};

export const translateIcd11ToNamaste = (icd11Code) => {
    const lookupCode = cleanString(icd11Code).toUpperCase(); // Clean and uppercase input
    return icd11CodeMap.get(lookupCode) || null;
};