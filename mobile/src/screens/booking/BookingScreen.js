// mobile/src/screens/booking/BookingScreen.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api, getErrorMessage } from '../../api/client';
import Button from '../../components/Button';
import { COLORS, RADIUS } from '../../constants/theme';
import { formatDate, formatPrice } from '../../utils/format';

export default function BookingScreen({ route, navigation }) {
  const { event } = route.params;
  const maxQuantity = Math.min(10, event.available_seats);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = event.price * quantity; // affichage seulement : le serveur recalcule

  async function handleBooking() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/bookings', { event_id: event.id, quantity });
      // replace : on remplace cet écran, pour que « retour » ne ramène pas ici
      navigation.replace('Payment', { booking: res.data });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.line}>📅 {formatDate(event.event_date)}</Text>
      <Text style={styles.line}>📍 {event.location}</Text>

      <Text style={styles.label}>Nombre de billets</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]}
          onPress={() => setQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Text style={styles.stepText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          style={[styles.stepBtn, quantity >= maxQuantity && styles.stepBtnDisabled]}
          onPress={() => setQuantity(quantity + 1)}
          disabled={quantity >= maxQuantity}
        >
          <Text style={styles.stepText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Maximum {maxQuantity} billet(s) par réservation</Text>

      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{quantity} × {formatPrice(event.price)}</Text>
          <Text style={styles.rowValue}>{formatPrice(total)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Continuer vers le paiement" onPress={handleBooking} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  line: { fontSize: 15, color: COLORS.muted, marginBottom: 2 },
  label: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 28, marginBottom: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  stepBtnDisabled: { opacity: 0.35 },
  stepText: { color: '#FFFFFF', fontSize: 28, fontWeight: '600', marginTop: -2 },
  quantity: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginHorizontal: 32, minWidth: 40, textAlign: 'center' },
  hint: { textAlign: 'center', color: COLORS.muted, fontSize: 13, marginTop: 10 },
  summary: { backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, marginVertical: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { color: COLORS.muted, fontSize: 15 },
  rowValue: { color: COLORS.text, fontSize: 15 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 8, paddingTop: 12 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  error: { color: COLORS.danger, textAlign: 'center', marginBottom: 12 },
});
