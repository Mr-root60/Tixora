// mobile/src/components/EventCard.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { formatDate, formatPrice } from '../utils/format';

export default function EventCard({ event, onPress }) {
  const soldOut = event.available_seats === 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.banner}>
        <Text style={styles.bannerLetter}>{event.title.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <Text style={styles.line}>📅 {formatDate(event.event_date)}</Text>
        <Text style={styles.line}>📍 {event.location}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(event.price)}</Text>
          <Text style={[styles.seats, soldOut && styles.soldOut]}>
            {soldOut ? 'Complet' : `${event.available_seats} places`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  banner: { height: 90, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  bannerLetter: { color: '#FFFFFF', fontSize: 42, fontWeight: '800', opacity: 0.9 },
  body: { padding: 14 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  line: { fontSize: 14, color: COLORS.muted, marginBottom: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  seats: { fontSize: 14, color: COLORS.success, fontWeight: '600' },
  soldOut: { color: COLORS.danger },
});
