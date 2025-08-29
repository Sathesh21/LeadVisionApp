import React, { useContext, useState, useRef } from "react";
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import MessageBubble from "../components/MessageBubble";
import LeadCard from "../components/LeadCard";
import ApiService from "../utils/apiService";
import { validateMatchScore } from "../utils/validation";

const ChatScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: 'Hello! I\'m your AI assistant. Ask me about leads using queries like:\n\n• "Show me nearby leads"\n• "Find hot leads"\n• "High score leads"\n• "All leads"', 
      isUser: false, 
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const query = inputText.trim();
    setInputText('');
    setIsLoading(true);
    scrollToBottom();
    
    try {
      const response = await ApiService.apiCall('/leads/search', { query });
      
      let aiResponseText = '';
      let leads = [];
      
      if (response.success && response.data.length > 0) {
        leads = response.data
          .filter(lead => lead && lead.name) // Filter out empty/invalid leads
          .map(lead => ({
            ...lead,
            matchScore: validateMatchScore(lead.matchScore || lead.matchScorePercent)
          }));
        const highScoreLeads = leads.filter(lead => lead.matchScore > 80);
        
        aiResponseText = `Found ${leads.length} lead${leads.length > 1 ? 's' : ''} for "${query}".`;
        
        if (highScoreLeads.length > 0) {
          aiResponseText += ` ${highScoreLeads.length} have high match scores (>80%).`;
        }
      } else {
        aiResponseText = `No leads found for "${query}". Try:\n\n• "nearby leads"\n• "hot leads"\n• "all leads"`;
      }
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        leads: leads,
        query: query
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while searching for leads. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const renderTypingIndicator = () => {
    if (!isLoading) return null;
    
    return (
      <View style={[styles.typingContainer, { backgroundColor: themeStyles.card }]}>
        <ActivityIndicator size="small" color={themeStyles.primary} />
        <Text style={[styles.typingText, { color: themeStyles.textSecondary }]}>AI is thinking...</Text>
      </View>
    );
  };

  const renderMessage = ({ item }) => (
    <View>
      <MessageBubble message={item} themeStyles={themeStyles} />
      {item.leads && item.leads.length > 0 && (
        <View style={styles.leadsContainer}>
          <Text style={[styles.leadsHeader, { color: themeStyles.text }]}>
            {item.leads.length} Lead{item.leads.length > 1 ? 's' : ''} Found
          </Text>
          {item.leads
            .filter(lead => lead && lead.name) // Filter out empty leads
            .map(lead => (
              <LeadCard 
                key={lead.id || Math.random().toString()} 
                lead={lead} 
                themeStyles={themeStyles}
                onPress={() => navigation.navigate('LeadDetails', { lead })}
                showHighlight={lead.matchScore > 80}
              />
            ))}
        </View>
      )}
    </View>
  );

  const suggestedQueries = [
    'Show me nearby leads',
    'Find hot leads', 
    'High score leads',
    'All leads'
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 2: AI Chat" navigation={navigation} />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      />
      
      {renderTypingIndicator()}
      
      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: themeStyles.textSecondary }]}>Try asking:</Text>
          {suggestedQueries.map((query, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionChip, { backgroundColor: themeStyles.card, borderColor: themeStyles.primary }]}
              onPress={() => setInputText(query)}
            >
              <Text style={[styles.suggestionText, { color: themeStyles.primary }]}>{query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={[styles.inputContainer, { backgroundColor: themeStyles.card }]}>
        <TextInput
          style={[styles.textInput, { color: themeStyles.text, borderColor: themeStyles.primary }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about leads... (e.g., 'show me nearby leads')"
          placeholderTextColor="#999"
          multiline
          maxLength={200}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, { 
            backgroundColor: inputText.trim() && !isLoading ? themeStyles.primary : themeStyles.textSecondary,
            opacity: inputText.trim() && !isLoading ? 1 : 0.5
          }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  leadsContainer: { 
    marginTop: 12,
    marginHorizontal: 8,
  },
  leadsHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },

  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionsTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ChatScreen;