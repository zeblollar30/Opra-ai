import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import client from '../../api/client';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleCreateTask = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title for the task');
      return;
    }

    setLoading(true);

    try {
      await client.post('/tasks', {
        title,
        description,
        type: 'general',
      });
      
      Alert.alert('Success', 'Task created successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            updateUser();
            router.push('/tasks');
            setTitle('');
            setDescription('');
          } 
        }
      ]);
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.response?.data?.error || 'Failed to create task';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Text style={[styles.heading, { color: theme.text }]}>What can Opra do for you?</Text>
          <Text style={[styles.subheading, { color: theme.tabIconDefault }]}>
            Describe the task in detail. We'll handle the rest.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Task Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., Book a dentist appointment"
                placeholderTextColor={theme.tabIconDefault}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Details (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g., I'm looking for a cleaning next Tuesday morning at Dr. Smith's office."
                placeholderTextColor={theme.tabIconDefault}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}
              onPress={handleCreateTask}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Task'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  button: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
