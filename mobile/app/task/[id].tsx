import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import client from '../../api/client';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { CheckCircle2, Clock, AlertCircle, Calendar, FileText, Share2, ChevronLeft } from 'lucide-react-native';

export default function TaskDetailsScreen() {
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
      console.error('Failed to fetch task details', e);
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed': return { icon: <CheckCircle2 size={20} color="#0D8A8A" />, color: "#0D8A8A", text: 'Completed' };
      case 'pending': return { icon: <Clock size={20} color="#F4A261" />, color: "#F4A261", text: 'Pending' };
      case 'failed': return { icon: <AlertCircle size={20} color="#E07A5F" />, color: "#E07A5F", text: 'Failed' };
      default: return { icon: null, color: theme.tabIconDefault, text: status };
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Task: ${task.title}\nStatus: ${task.status}\nResult: ${task.result || 'No result yet'}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Loading task details...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Task not found.</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary, marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(task.status);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Stack.Screen options={{ 
        title: 'Task Details',
        headerRight: () => (
          <TouchableOpacity onPress={handleShare}>
            <Share2 size={20} color={theme.primary} />
          </TouchableOpacity>
        )
      }} />

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.header}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}15` }]}>
              {statusInfo.icon}
              <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
            </View>
            <Text style={[styles.date, { color: theme.tabIconDefault }]}>
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
          <Text style={[styles.description, { color: theme.tabIconDefault }]}>{task.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Result</Text>
          </View>
          <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.resultText, { color: task.result ? theme.text : theme.tabIconDefault }]}>
              {task.result || 'Opra is still working on this task. You will be notified when it is complete.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Timeline</Text>
          </View>
          <View style={styles.timeline}>
            <TimelineItem 
              title="Task Created" 
              time={new Date(task.createdAt).toLocaleTimeString()} 
              isLast={task.status === 'pending'}
              theme={theme}
            />
            {task.status !== 'pending' && (
              <TimelineItem 
                title={task.status === 'completed' ? 'Task Completed' : 'Task Failed'} 
                time={new Date(task.updatedAt || task.createdAt).toLocaleTimeString()} 
                isLast={true}
                theme={theme}
                color={statusInfo.color}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function TimelineItem({ title, time, isLast, theme, color }: any) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLineContainer}>
        <View style={[styles.timelineDot, { backgroundColor: color || theme.primary }]} />
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.timelineTime, { color: theme.tabIconDefault }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeline: {
    marginLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLineContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
  },
  timelineContent: {
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
