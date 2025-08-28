import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { BASE_COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from "../constants/colors";
import Header from "../components/Header/Header";
import MessageBubble from "../components/MessageBubble";
import LeadCard from "../components/LeadCard"; // keep your existing LeadCard component

const ChatScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const fetchLeads = async (query = "") => {
    try {
      // Mock API response with better lead data
      const mockLeads = [
        { id: '1', name: 'Rajesh Kumar', location: 'T. Nagar, Chennai, Tamil Nadu', matchScore: 95 },
        { id: '2', name: 'Priya Sharma', location: 'Anna Nagar, Chennai, Tamil Nadu', matchScore: 87 },
        { id: '3', name: 'Arjun Krishnan', location: 'Velachery, Chennai, Tamil Nadu', matchScore: 78 },
        { id: '4', name: 'Meera Devi', location: 'Adyar, Chennai, Tamil Nadu', matchScore: 92 },
        { id: '5', name: 'Suresh Babu', location: 'Tambaram, Chennai, Tamil Nadu', matchScore: 65 },
        { id: '6', name: 'Lakshmi Narayanan', location: 'Mylapore, Chennai, Tamil Nadu', matchScore: 83 },
      ];

      let filtered;
      const queryLower = query.toLowerCase();

      // Simulate AI understanding for different queries
      if (queryLower.includes('nearby') || queryLower.includes('near')) {
        filtered = mockLeads.slice(0, 3); // first 3 as nearby
      } else if (queryLower.includes('high') || queryLower.includes('best')) {
        filtered = mockLeads.filter(lead => lead.matchScore > 85);
      } else if (queryLower.includes('all') || queryLower.includes('show')) {
        filtered = mockLeads;
      } else {
        filtered = mockLeads.filter(lead => 
          lead.name.toLowerCase().includes(queryLower) ||
          lead.location.toLowerCase().includes(queryLower)
        );
      }

      // Add matchScorePercent for display
      return filtered.map(lead => ({
        ...lead,
        matchScorePercent: lead.matchScore
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const leads = await fetchLeads(input);

    const systemMsg = {
      id: (Date.now() + 1).toString(),
      type: "system",
      text: leads.length > 0
        ? `Here are the results for "${input}":`
        : `No results found for "${input}".`,
      leads,
    };

    setMessages((prev) => [...prev, systemMsg]);
    setInput("");
  };

  const renderItem = ({ item }) => {
    if (item.type === "user") return <MessageBubble text={item.text} isUser />;
    if (item.type === "system" && item.leads) {
      return (
        <View>
          <MessageBubble text={item.text} />
          {item.leads.map((lead, idx) => (
            <LeadCard key={lead.id || idx} lead={lead} />
          ))}
        </View>
      );
    }
    return <MessageBubble text={item.text} />;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeStyles.background }]}
      behavior="padding"
    >
      <Header title="Task 2: AI Result Display" navigation={navigation} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={[styles.inputContainer, { backgroundColor: themeStyles.card }]}>
        <TextInput
          style={[styles.input, { color: themeStyles.text }]}
          placeholder="Type your query..."
          placeholderTextColor={themeStyles.textSecondary}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { padding: SPACING.md },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm,
  },
  input: {
    flex: 1,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  sendButton: {
    backgroundColor: BASE_COLORS.blue,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  sendText: { color: "#fff", fontWeight: "600" },
});

export default ChatScreen;
