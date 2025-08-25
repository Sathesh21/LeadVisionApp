import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const SavedListItem = ({ data, themeStyles, onDelete, onEdit }) => {
  return (
    <View
      style={{
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: themeStyles.cardBackground || '#222', // dark theme support
      }}
    >
      {data.imageUri && (
        <Image
          source={{ uri: data.imageUri }}
          style={{ width: '100%', height: 150, resizeMode: 'contain', marginBottom: 5 }}
        />
      )}
      <Text style={{ color: themeStyles.text }}>Name: {data.name || "-"}</Text>
      <Text style={{ color: themeStyles.text }}>ID Number: {data.idNumber || "-"}</Text>
      <Text style={{ color: themeStyles.text }}>DOB: {data.dob || "-"}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity onPress={onEdit} style={{ marginRight: 15 }}>
          <Text style={{ color: 'orange' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SavedListItem;
