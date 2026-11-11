// mobile/src/components/TicketCard.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { formatDate } from '../utils/format';

export default function TicketCard({ ticket, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{ticket.event.title}</Text>
        <Text style={styles.line}>📅 {formatDate(ticket.event.event_date)}</Text>
        <Text style={styles.line}>📍 {ticket.event.location}</Text>
        <Text style={styles.code}>N° {ticket.code.slice(0, 8)}</Text>
      </View>
      <View style={[styles.badge, ticket.is_used ? styles.badgeUsed : styles.badgeValid]}>
        <Text style={styles.badgeText}>{ticket.is_used ? 'Utilisé' : 'Valide'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  info: { flex: 1, marginRight: 8 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  line: { fontSize: 13, color: COLORS.muted, marginBottom: 2 },
  code: { fontSize: 12, color: COLORS.muted, marginTop: 4, fontFamily: undefined },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeValid: { backgroundColor: '#DCFCE7' },
  badgeUsed: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 12, fontWeight: '700', color: COLORS.text },
});
