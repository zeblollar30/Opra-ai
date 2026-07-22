import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        client.get('/tasks/stats/summary'),
        client.get('/tasks?limit=3')
      ]);
      setStats(statsRes.data.stats);
      setRecentTasks(tasksRes.data.tasks);
    } catch (e) {
      console.error('Failed to fetch dashboard data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    updateUser();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} color="#0D8A8A" />;
      case 'pending': return <Clock size={16} color="#F4A261" />;
      case 'failed': return <AlertCircle size={16} color="#E07A5F" />;
      default: return null;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>Hello, {user?.name}!</Text>
          <Text style={[styles.planText, { color: theme.tabIconDefault }]}>
            Plan: <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{user?.plan}</Text>
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Tasks" 
            value={stats?.total || 0} 
            icon={<TrendingUp size={20} color={theme.primary} />}
            theme={theme}
          />
          <StatCard 
            title="Completed" 
            value={stats?.completed || 0} 
            icon={<CheckCircle2 size={20} color="#0D8A8A" />}
            theme={theme}
          />
          <StatCard 
            title="Pending" 
            value={stats?.pending || 0} 
            icon={<Clock size={20} color="#F4A261" />}
            theme={theme}
          />
          <StatCard 
            title="Failed" 
            value={stats?.failed || 0} 
            icon={<AlertCircle size={20} color="#E07A5F" />}
            theme={theme}
          />
        </View>

        <View style={[styles.usageCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.usageTitle, { color: theme.text }]}>Monthly Usage</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(((user?.tasksUsed || 0) / (user?.tasksLimit || 1)) * 100, 100)}%`,
                  backgroundColor: theme.primary 
                }
              ]} 
            />
          </View>
          <View style={styles.usageLabels}>
            <Text style={[styles.usageLabel, { color: theme.tabIconDefault }]}>
              {user?.tasksUsed} tasks used
            </Text>
            <Text style={[styles.usageLabel, { color: theme.tabIconDefault }]}>
              {user?.tasksLimit} limit
            </Text>
          </View>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={[styles.taskItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push(`/task/${task.id}`)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskItemTitle, { color: theme.text }]} numberOfLines={1}>{task.title}</Text>
                  <View style={styles.taskItemStatus}>
                    {getStatusIcon(task.status)}
                    <Text style={[styles.taskItemStatusText, { color: theme.tabIconDefault }]}>{task.status}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={theme.tabIconDefault} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyRecent}>
              <Text style={{ color: theme.tabIconDefault, fontSize: 14 }}>No tasks yet.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.ctaButton, { backgroundColor: theme.primary, marginTop: 24 }]}
          onPress={() => router.push('/create')}
        >
          <Text style={styles.ctaButtonText}>Create New Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, icon, theme }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.statHeader}>
        {icon}
        <Text style={[styles.statTitle, { color: theme.tabIconDefault }]}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
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
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planText: {
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  usageCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0DDD8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  usageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageLabel: {
    fontSize: 12,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  taskItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItemStatusText: {
    fontSize: 12,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  emptyRecent: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0DDD8',
  },
  ctaButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
