import React, { useContext, useState } from "react";
import { SafeAreaView, View, Text, Image, FlatList, Alert, ToastAndroid, Platform } from "react-native";
import Header from "../components/Header/Header";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton/CustomButton";
import SavedListItem from "../components/SavedList/SavedList";
import { ThemeContext } from "../theme/ThemeContext";
import { useOCR } from "../hooks/useOCR";
import { validateConfidence } from "../utils/validation";
import DEFAULT_TEXT from "../constants/defaultText";

const MAX_ITEMS = 5;

const OCRScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [originalData, setOriginalData] = useState({ name: "", idNumber: "", dob: "" });
  const [savedDataList, setSavedDataList] = useState([]);
  
  const { 
    imageUri, 
    ocrData, 
    confidenceData, 
    isProcessing, 
    captureImage, 
    selectImage, 
    resetOCR, 
    updateOCRData,
    updateConfidenceData,
    updateImageUri
  } = useOCR();





  // ====== Save, Delete, Edit ======
  const handleSave = () => {
    if (!ocrData.name && !ocrData.idNumber && !ocrData.dob) {
      Alert.alert("Nothing to save", "Please fill at least one field before saving.");
      return;
    }
    if (savedDataList.length >= MAX_ITEMS) {
      Alert.alert(
        "Limit reached",
        `Only ${MAX_ITEMS} saved IDs allowed. Please delete a previous entry to add a new one.`
      );
      return;
    }

    setSavedDataList(prev => [...prev, { ...ocrData, imageUri }]);
    setOriginalData({ ...ocrData });
    resetOCR();

    // Show save confirmation
    if (Platform.OS === "android") {
      ToastAndroid.show("Saved successfully!", ToastAndroid.SHORT);
    }
  };

  const handleDelete = (index) => {
    setSavedDataList(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (item, index) => {
    updateOCRData('name', item.name || '');
    updateOCRData('idNumber', item.idNumber || '');
    updateOCRData('dob', item.dob || '');
    
    // Set confidence data for edited items
    updateConfidenceData({
      name: item.name ? 85 : null,
      idNumber: item.idNumber ? 85 : null,
      dob: item.dob ? 85 : null
    });
    
    // Set image if available
    if (item.imageUri) {
      updateImageUri(item.imageUri);
    }
    
    // Remove from saved list only after data is loaded
    setSavedDataList(prev => prev.filter((_, i) => i !== index));
  };

  const isSaveEnabled =
    (ocrData.name || ocrData.idNumber || ocrData.dob) && (
      ocrData.name !== originalData.name ||
      ocrData.idNumber !== originalData.idNumber ||
      ocrData.dob !== originalData.dob
    );

  const renderInputWithConfidence = (label, value, confidence, onChangeText) => {
    const validConfidence = validateConfidence(confidence);
    const showConfidence = value && value.length > 0;
    
    return (
      <View style={{ marginBottom: 15 }}>
        <CustomInput label={label} value={value} onChangeText={onChangeText} />
        {showConfidence && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: validConfidence > 80 ? '#4CAF50' : validConfidence > 60 ? '#FF9800' : '#F44336',
              marginRight: 6
            }} />
            <Text style={{ 
              color: validConfidence > 80 ? '#4CAF50' : validConfidence > 60 ? '#FF9800' : '#F44336', 
              fontSize: 12, 
              fontWeight: '600'
            }}>
              Confidence: {validConfidence}% {validConfidence > 80 ? '✓ High' : validConfidence > 60 ? '⚠ Medium' : '✗ Low'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text style={{ color: themeStyles.text, fontStyle: "italic" }}>
        No saved IDs yet.
      </Text>
    </View>
  );

  return (
    <>
      <Header navigation={navigation} title="Task 1: OCR Capture" />
      <SafeAreaView style={{ flex: 1, backgroundColor: themeStyles.background }}>
        <FlatList
          data={savedDataList}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
            <>
              <Text style={{ color: themeStyles.text, marginBottom: 20, textAlign: "center" }}>
                {DEFAULT_TEXT.ocrHeading}
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                <CustomButton title={DEFAULT_TEXT.captureImage} onPress={captureImage} disabled={isProcessing} />
                <CustomButton title={DEFAULT_TEXT.uploadImage} onPress={selectImage} outline disabled={isProcessing} />
              </View>

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: 220,
                    resizeMode: "contain",
                    borderRadius: 12,
                    marginVertical: 15,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              )}

              {renderInputWithConfidence(DEFAULT_TEXT.nameLabel, ocrData.name, confidenceData.name,
                text => updateOCRData('name', text))}
              {renderInputWithConfidence(DEFAULT_TEXT.idNumberLabel, ocrData.idNumber, confidenceData.idNumber,
                text => updateOCRData('idNumber', text))}
              {renderInputWithConfidence(DEFAULT_TEXT.dobLabel, ocrData.dob, confidenceData.dob,
                text => updateOCRData('dob', text))}

              <CustomButton
                title={DEFAULT_TEXT.saveData}
                onPress={handleSave}
                disabled={!isSaveEnabled}
              />
            </>
          }
          renderItem={({ item, index }) => (
            <SavedListItem
              data={item}
              themeStyles={themeStyles}
              onDelete={() => handleDelete(index)}
              onEdit={() => handleEdit(item, index)}
            />
          )}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ padding: 20 }}
        />
      </SafeAreaView>
    </>

  );
};

export default OCRScreen;
