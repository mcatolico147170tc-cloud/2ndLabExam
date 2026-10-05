import { API_BASE_URL } from '@/constants/api';
import { type User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { token, user: ctxUser, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        // GET /profile using fetch() and Bearer token
        const response = await fetch(`${API_BASE_URL}/users/1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) { logout(); return; }
          throw new Error(`Failed to load profile. (${response.status})`);
        }
        const data = await response.json();
        setProfile({
          id: data.id,
          name: ctxUser?.name ?? data.name,
          email: ctxUser?.email ?? data.email,
          role: 'student',
        });
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const display = profile ?? ctxUser;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      {loading ? <ActivityIndicator color="#245bb2" />
        : error ? <Text style={styles.error}>{error}</Text>
        : (
          <View style={styles.card}>
            <Text style={styles.text}>Name: {display?.name || '—'}</Text>
            <Text style={styles.text}>Email: {display?.email || '—'}</Text>
            <Text style={styles.text}>Role: {display?.role || 'student'}</Text>
          </View>
        )}
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});