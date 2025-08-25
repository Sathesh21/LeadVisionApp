import React, { useContext, useState } from "react";
import { SafeAreaView, View, Text, Image, FlatList, Platform, Alert, ToastAndroid } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import Header from "../components/Header/Header";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomButton from "../components/CustomButton/CustomButton";
import SavedListItem from "../components/SavedList/SavedList";
import { ThemeContext } from "../theme/ThemeContext";
import DEFAULT_TEXT from "../constants/defaultText";
import { requestPermissions } from "../utils/permissions";

const MAX_ITEMS = 5;

const OCRScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  const [imageUri, setImageUri] = useState(null);
  const [ocrData, setOcrData] = useState({ name: "", idNumber: "", dob: "" });
  const [confidenceData, setConfidenceData] = useState({ name: null, idNumber: null, dob: null });
  const [originalData, setOriginalData] = useState({ name: "", idNumber: "", dob: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedDataList, setSavedDataList] = useState([]);

  // ====== Permissions & Image Handling ======
  const handleCamera = async () => {
    const granted = await requestPermissions(true, false);
    if (!granted) return;
    pickImage(true);
  };

  const handleGallery = async () => {
    const needsStorage = Platform.OS === "android" && Platform.Version < 33;
    const granted = await requestPermissions(false, needsStorage);
    if (!granted) return;
    pickImage(false);
  };

  const pickImage = async (fromCamera) => {
    try {
      setIsProcessing(true);
      const result = fromCamera
        ? await launchCamera({ mediaType: "photo" })
        : await launchImageLibrary({ mediaType: "photo" });

      if (result.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        extractText(uri);
      } else {
        setIsProcessing(false);
        Alert.alert("No image selected", "Please select or capture an image.");
      }
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // ====== OCR Extraction ======
  const extractText = async (uri) => {
    try {
      const result = await TextRecognition.recognize(uri);
      const allLines = result.blocks.flatMap(block =>
        block.lines.map(line => ({ text: line.text, confidence: Math.round(line.confidence * 100) }))
      );

      let name = "", idNumber = "", dob = "";
      let nameConfidence = null, idConfidence = null, dobConfidence = null;

      const getValueAfterKey = (line, key) => {
        const regex = new RegExp(`${key}\\s*[:\\-]?\\s*(.*)`, "i");
        const match = line.text.match(regex);
        return match ? match[1].trim() : "";
      };

      allLines.forEach(line => {
        const textLower = line.text.toLowerCase();
        if (!name && textLower.includes("name")) {
          name = getValueAfterKey(line, "name");
          nameConfidence = name ? line.confidence : null;
        } else if (!idNumber && textLower.includes("id")) {
          idNumber = getValueAfterKey(line, "id");
          idConfidence = idNumber ? line.confidence : null;
        } else if (!dob && (textLower.includes("dob") || textLower.includes("date of birth"))) {
          dob = getValueAfterKey(line, "dob") || getValueAfterKey(line, "date of birth");
          dobConfidence = dob ? line.confidence : null;
        }
      });

      setOcrData({ name, idNumber, dob });
      setOriginalData({ name, idNumber, dob });
      setConfidenceData({ name: nameConfidence, idNumber: idConfidence, dob: dobConfidence });
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      Alert.alert("Error", "Failed to recognize text");
    }
  };

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
    setOcrData({ name: "", idNumber: "", dob: "" });
    setImageUri(null);

    // Show save confirmation
    if (Platform.OS === "android") {
      ToastAndroid.show("Saved successfully!", ToastAndroid.SHORT);
    }
  };

  const handleDelete = (index) => {
    setSavedDataList(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (item, index) => {
    setOcrData({ name: item.name, idNumber: item.idNumber, dob: item.dob });
    setImageUri(item.imageUri);
    setSavedDataList(prev => prev.filter((_, i) => i !== index)); // remove temporarily
  };

  const isSaveEnabled =
    (ocrData.name || ocrData.idNumber || ocrData.dob) && (
      ocrData.name !== originalData.name ||
      ocrData.idNumber !== originalData.idNumber ||
      ocrData.dob !== originalData.dob
    );

  const renderInputWithConfidence = (label, value, confidence, onChangeText) => (
    <View style={{ marginBottom: 15 }}>
      <CustomInput label={label} value={value} onChangeText={onChangeText} />
      {value && confidence !== null && (
        <Text style={{ color: themeStyles.text, fontSize: 12, marginTop: 2 }}>
          Confidence: {confidence}%
        </Text>
      )}
    </View>
  );

  const renderEmptyList = () => (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text style={{ color: themeStyles.text, fontStyle: "italic" }}>
        No saved IDs yet.
      </Text>
    </View>
  );

  return (
    <>
      <Header navigation={navigation} title="OCR Scanner" onSettingsPress={() => navigation.navigate("Settings")} />
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
                <CustomButton title={DEFAULT_TEXT.captureImage} onPress={handleCamera} disabled={isProcessing} />
                <CustomButton title={DEFAULT_TEXT.uploadImage} onPress={handleGallery} outline disabled={isProcessing} />
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
                text => setOcrData({ ...ocrData, name: text }))}
              {renderInputWithConfidence(DEFAULT_TEXT.idNumberLabel, ocrData.idNumber, confidenceData.idNumber,
                text => setOcrData({ ...ocrData, idNumber: text }))}
              {renderInputWithConfidence(DEFAULT_TEXT.dobLabel, ocrData.dob, confidenceData.dob,
                text => setOcrData({ ...ocrData, dob: text }))}

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
