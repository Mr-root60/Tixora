// mobile/src/screens/events/EventListScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, getErrorMessage } from '../../api/client';
import EventCard from '../../components/EventCard';
import { COLORS, RADIUS } from '../../constants/theme';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError('');
    try {
      const res = await api.get('/events', { params: { search: search || undefined } });
      setEvents(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  // Recharge 400 ms après la dernière frappe (évite une requête par lettre)
  useEffect(() => {
    const timer = setTimeout(() => loadEvents(), 400);
    return () => clearTimeout(timer);
  }, [loadEvents]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="🔍 Rechercher un événement"
        placeholderTextColor={COLORS.muted}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadEvents(true)} />}
        ListEmptyComponent={!error ? <Text style={styles.empty}>Aucun événement trouvé</Text> : null}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  search: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  list: { padding: 16 },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 40, fontSize: 16 },
  error: { color: COLORS.danger, textAlign: 'center', marginTop: 12, paddingHorizontal: 16 },
});
