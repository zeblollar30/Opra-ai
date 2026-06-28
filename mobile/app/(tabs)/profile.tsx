import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { LogOut, User, Mail, CreditCard, ShieldCheck } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.tabIconDefault }]}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>Subscription</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ProfileItem 
            icon={<CreditCard size={20} color={theme.primary} />} 
            label="Current Plan" 
            value={user?.plan} 
            theme={theme}
          />
          <View style={styles.divider} />
          <ProfileItem 
            icon={<ShieldCheck size={20} color={theme.primary} />} 
            label="Tasks Remaining" 
            value={`${(user?.tasksLimit || 0) - (user?.tasksUsed || 0)}`} 
            theme={theme}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>Account Settings</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.menuItem}>
            <User size={20} color={theme.tabIconDefault} />
            <Text style={[styles.menuText, { color: theme.text }]}>Edit Profile</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Mail size={20} color={theme.tabIconDefault} />
            <Text style={[styles.menuText, { color: theme.text }]}>Notification Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { borderColor: '#E07A5F' }]} 
        onPress={handleLogout}
      >
        <LogOut size={20} color="#E07A5F" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Opra Mobile v1.0.0</Text>
    </ScrollView>
  );
}

function ProfileItem({ icon, label, value, theme }: any) {
  return (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        {icon}
        <Text style={[styles.profileLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <Text style={[styles.profileValue, { color: theme.primary, fontWeight: 'bold' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD8',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  profileValue: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0DDD8',
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    color: '#E07A5F',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#8A8276',
    fontSize: 12,
    marginTop: 32,
    marginBottom: 40,
  },
});
