// mobile/src/screens/events/EventDetailScreen.js
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api, getErrorMessage } from '../../api/client';
import Button from '../../components/Button';
import { COLORS } from '../../constants/theme';
import { formatDate, formatPrice } from '../../utils/format';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  // useFocusEffect : s'exécute à chaque fois que l'écran redevient visible,
  // ce qui rafraîchit le nombre de places après une réservation.
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const res = await api.get(`/events/${eventId}`);
          setEvent(res.data);
        } catch (e) {
          setError(getErrorMessage(e));
        }
      }
      load();
    }, [eventId])
  );

  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!event) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const soldOut = event.available_seats === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerLetter}>{event.title.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>📅 {formatDate(event.event_date)}</Text>
        <Text style={styles.info}>📍 {event.location}</Text>
        <Text style={styles.info}>
          🎫 {soldOut ? 'Complet' : `${event.available_seats} places sur ${event.total_seats}`}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>À propos</Text>
      <Text style={styles.description}>{event.description || 'Aucune description.'}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(event.price)}</Text>
        <Text style={styles.perTicket}>par billet</Text>
      </View>

      <Button
        title={soldOut ? 'Complet' : 'Réserver'}
        disabled={soldOut}
        onPress={() => navigation.navigate('Booking', { event })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: COLORS.danger, textAlign: 'center' },
  banner: { height: 160, backgroundColor: COLORS.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bannerLetter: { color: '#FFFFFF', fontSize: 72, fontWeight: '800', opacity: 0.9 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginTop: 16 },
  infoBox: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginTop: 14 },
  info: { fontSize: 15, color: COLORS.text, marginVertical: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 6 },
  description: { fontSize: 15, color: COLORS.muted, lineHeight: 22 },
  footer: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 20 },
  price: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  perTicket: { fontSize: 14, color: COLORS.muted, marginLeft: 6 },
});
