// mobile/src/screens/tickets/TicketDetailScreen.js
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, RADIUS } from '../../constants/theme';
import { formatDate } from '../../utils/format';

export default function TicketDetailScreen({ route }) {
  const { ticket } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.ticket}>
        <Text style={styles.title}>{ticket.event.title}</Text>
        <Text style={styles.line}>📅 {formatDate(ticket.event.event_date)}</Text>
        <Text style={styles.line}>📍 {ticket.event.location}</Text>

        <View style={styles.divider} />

        <View style={styles.qrBox}>
          <QRCode value={ticket.code} size={220} />
        </View>

        <Text style={styles.code}>{ticket.code}</Text>

        <View style={[styles.badge, ticket.is_used ? styles.badgeUsed : styles.badgeValid]}>
          <Text style={styles.badgeText}>
            {ticket.is_used ? 'Billet déjà utilisé' : 'Billet valide'}
          </Text>
        </View>
      </View>

      <Text style={styles.help}>Présentez ce QR code à l'entrée de l'événement.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  ticket: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  line: { fontSize: 15, color: COLORS.muted, marginBottom: 2 },
  divider: { height: 1, alignSelf: 'stretch', backgroundColor: COLORS.border, marginVertical: 20 },
  qrBox: { padding: 12, backgroundColor: '#FFFFFF', borderRadius: RADIUS, borderWidth: 1, borderColor: COLORS.border },
  code: { marginTop: 14, fontSize: 11, color: COLORS.muted, letterSpacing: 1, textAlign: 'center' },
  badge: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  badgeValid: { backgroundColor: '#DCFCE7' },
  badgeUsed: { backgroundColor: '#F3F4F6' },
  badgeText: { fontWeight: '700', color: COLORS.text },
  help: { textAlign: 'center', color: COLORS.muted, marginTop: 20, fontSize: 14 },
});
