import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { usePermissions } from './usePermissions';
import { useToast } from './useToast';

export const useOCR = () => {
  const [imageUri, setImageUri] = useState(null);
  const [ocrData, setOcrData] = useState({ name: '', idNumber: '', dob: '' });
  const [confidenceData, setConfidenceData] = useState({ name: null, idNumber: null, dob: null });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { requestCameraPermission, requestStoragePermission } = usePermissions();
  const { showToast } = useToast();

  const extractTextFromImage = useCallback(async (uri) => {
    try {
      setIsProcessing(true);
      const result = await TextRecognition.recognize(uri);
      
      if (!result?.blocks?.length) {
        Alert.alert('No Text Found', 'No text detected in the image. Try a clearer image.');
        return;
      }

      const allLines = result.blocks
        .flatMap(block => block.lines)
        .map(line => ({
          text: line.text || '',
          confidence: typeof line.confidence === 'number' && !isNaN(line.confidence) 
            ? Math.round(Math.max(0, Math.min(100, line.confidence * 100)))
            : 75 // Default confidence when ML Kit doesn't provide one
        }))
        .filter(line => line.text.trim().length > 0);

      let name = '', idNumber = '', dob = '';
      let nameConfidence = 0, idConfidence = 0, dobConfidence = 0;

      const getValueAfterKey = (line, key) => {
        const regex = new RegExp(`${key}\\s*[:\\-]?\\s*(.*)`, 'i');
        const match = line.text.match(regex);
        return match ? match[1].trim() : '';
      };

      allLines.forEach(line => {
        const textLower = line.text.toLowerCase();
        const confidence = line.confidence || 0;
        
        // Name extraction
        if (!name && (textLower.includes('name') || textLower.includes('full name'))) {
          const extractedName = getValueAfterKey(line, 'name') || getValueAfterKey(line, 'full name');
          if (extractedName && extractedName.length > 1) {
            name = extractedName;
            nameConfidence = confidence || 85; // High confidence for labeled fields
          }
        }
        
        // ID Number extraction
        if (!idNumber && (textLower.includes('id') || textLower.includes('number') || /\d{4,}/.test(line.text))) {
          const extractedId = getValueAfterKey(line, 'id') || 
                              getValueAfterKey(line, 'number') || 
                              (line.text.match(/\d{4,}/) ? line.text.match(/\d{4,}/)[0] : '');
          if (extractedId && extractedId.length >= 4) {
            idNumber = extractedId;
            // Higher confidence for labeled ID fields, lower for pattern-matched numbers
            idConfidence = (textLower.includes('id') || textLower.includes('number')) ? 
                          (confidence || 85) : (confidence || 70);
          }
        }
        
        // Date of Birth extraction
        if (!dob && (textLower.includes('dob') || textLower.includes('date of birth') || 
                     textLower.includes('birth') || /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(line.text))) {
          const extractedDob = getValueAfterKey(line, 'dob') || 
                               getValueAfterKey(line, 'date of birth') ||
                               getValueAfterKey(line, 'birth') || 
                               (line.text.match(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/) ? 
                                line.text.match(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/)[0] : '');
          if (extractedDob && extractedDob.length >= 6) {
            dob = extractedDob;
            // Higher confidence for labeled date fields, lower for pattern-matched dates
            dobConfidence = (textLower.includes('dob') || textLower.includes('date of birth') || textLower.includes('birth')) ? 
                           (confidence || 85) : (confidence || 65);
          }
        }
      });

      // Fallback extraction with default confidence
      if (!name && !idNumber && !dob && allLines.length > 0) {
        if (allLines[0]?.text.length > 2) {
          name = allLines[0].text;
          nameConfidence = allLines[0].confidence || 60; // Lower confidence for fallback
        }
        
        const numberLine = allLines.find(line => /\d{4,}/.test(line.text));
        if (numberLine) {
          const match = numberLine.text.match(/\d{4,}/);
          if (match) {
            idNumber = match[0];
            idConfidence = numberLine.confidence || 55; // Lower confidence for pattern match
          }
        }
      }

      setOcrData({ name, idNumber, dob });
      setConfidenceData({ 
        name: name ? (nameConfidence || 70) : null, 
        idNumber: idNumber ? (idConfidence || 70) : null, 
        dob: dob ? (dobConfidence || 70) : null 
      });
      
      showToast('Text extracted successfully', 'success');
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('OCR Error', 'Failed to recognize text. Try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  const captureImage = useCallback(async () => {
    try {
      const result = await launchCamera({ 
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        extractTextFromImage(uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Failed to capture image');
    }
  }, [extractTextFromImage]);

  const selectImage = useCallback(async () => {
    try {
      const result = await launchImageLibrary({ 
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        extractTextFromImage(uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Gallery Error', 'Failed to select image');
    }
  }, [extractTextFromImage]);

  const resetOCR = useCallback(() => {
    setImageUri(null);
    setOcrData({ name: '', idNumber: '', dob: '' });
    setConfidenceData({ name: null, idNumber: null, dob: null });
    setIsProcessing(false);
  }, []);

  const updateOCRData = useCallback((field, value) => {
    setOcrData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateConfidenceData = useCallback((confidenceObj) => {
    setConfidenceData(confidenceObj);
  }, []);

  const updateImageUri = useCallback((uri) => {
    setImageUri(uri);
  }, []);

  return {
    imageUri,
    ocrData,
    confidenceData,
    isProcessing,
    captureImage,
    selectImage,
    resetOCR,
    updateOCRData,
    updateConfidenceData,
    updateImageUri,
  };
};