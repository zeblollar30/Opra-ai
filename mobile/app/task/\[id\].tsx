import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import client from '../../api/client';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { CheckCircle2, Clock, AlertCircle, Calendar, Trash2, ChevronLeft } from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const fetchTask = async () => {
    try {
      const response = await client.get(`/tasks/${id}`);
      setTask(response.data.task);
    } catch (e) {
      console.error('Failed to fetch task', e);
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTask();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await client.patch(`/tasks/${id}`, { status: newStatus });
      fetchTask();
      Alert.alert('Success', `Task marked as ${newStatus}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await client.delete(`/tasks/${id}`);
              router.back();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#0D8A8A';
      case 'pending': return '#F4A261';
      case 'failed': return '#E07A5F';
      default: return theme.tabIconDefault;
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Stack.Screen options={{ 
        title: 'Task Details',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
        ),
      }} />

      <View style={styles.content}>
        <View style={[styles.statusHeader, { backgroundColor: getStatusColor(task.status) + '15' }]}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.tabIconDefault }]}>Description</Text>
          <Text style={[styles.description, { color: theme.text }]}>
            {task.description || 'No description provided.'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Calendar size={18} color={theme.tabIconDefault} />
          <Text style={[styles.infoText, { color: theme.tabIconDefault }]}>
            Created on {new Date(task.created_at).toLocaleDateString()}
          </Text>
        </View>

        {task.result && (
          <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.resultTitle, { color: theme.text }]}>Result</Text>
            <Text style={[styles.resultText, { color: theme.text }]}>{task.result}</Text>
          </View>
        )}

        {task.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary, marginBottom: 12 }]} 
            onPress={() => handleUpdateStatus('completed')}
          >
            <CheckCircle2 size={20} color="white" />
            <Text style={styles.actionButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#E07A5F" />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  statusHeader: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0DDD8',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E07A5F',
  },
  deleteButtonText: {
    color: '#E07A5F',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
