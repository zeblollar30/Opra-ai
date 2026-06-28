import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import client from '../../api/client';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const fetchTasks = async () => {
    try {
      const response = await client.get('/tasks');
      setTasks(response.data.tasks);
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#0D8A8A';
      case 'pending': return '#F4A261';
      case 'failed': return '#E07A5F';
      default: return theme.tabIconDefault;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} color="#0D8A8A" />;
      case 'pending': return <Clock size={16} color="#F4A261" />;
      case 'failed': return <AlertCircle size={16} color="#E07A5F" />;
      default: return null;
    }
  };

  const renderTask = ({ item }: any) => (
    <TouchableOpacity style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.taskDescription, { color: theme.tabIconDefault }]} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        <View style={styles.statusBadge}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color={theme.border} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>
              {loading ? 'Loading tasks...' : 'No tasks found. Create one to get started!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
