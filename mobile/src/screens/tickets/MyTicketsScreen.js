// mobile/src/screens/tickets/MyTicketsScreen.js
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api, getErrorMessage } from '../../api/client';
import TicketCard from '../../components/TicketCard';
import { COLORS } from '../../constants/theme';

export default function MyTicketsScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError('');
    try {
      const res = await api.get('/tickets/me');
      setTickets(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recharge la liste à chaque fois que l'onglet « Billets » devient visible
  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [loadTickets])
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => navigation.navigate('TicketDetail', { ticket: item })} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadTickets(true)} />}
        ListEmptyComponent={
          !error ? <Text style={styles.empty}>Vous n'avez pas encore de billet.{'\n'}Réservez un événement !</Text> : null
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 60, fontSize: 16, lineHeight: 24 },
  error: { color: COLORS.danger, textAlign: 'center', marginTop: 12, paddingHorizontal: 16 },
});
