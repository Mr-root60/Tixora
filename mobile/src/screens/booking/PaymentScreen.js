// mobile/src/screens/booking/PaymentScreen.js
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api, getErrorMessage } from '../../api/client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS, RADIUS } from '../../constants/theme';
import { formatPrice } from '../../utils/format';

const METHODS = [
  { id: 'mobile_money', label: '📱 Mobile Money' },
  { id: 'card', label: '💳 Carte bancaire' },
];

export default function PaymentScreen({ route, navigation }) {
  const { booking } = route.params;
  const [method, setMethod] = useState('mobile_money');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    if (method === 'mobile_money' && phone.trim().length < 8) {
      setError('Entrez un numéro Mobile Money valide');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/payments', {
        booking_id: booking.id,
        method,
        phone: method === 'mobile_money' ? phone.trim() : null,
      });
      Alert.alert('Paiement réussi ✅', 'Vos billets sont disponibles.', [
        {
          text: 'Voir mes billets',
          onPress: () => {
            navigation.popToTop();
            navigation.navigate('TicketsTab');
          },
        },
      ]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    try {
      await api.post(`/bookings/${booking.id}/cancel`);
    } catch (e) {
      Alert.alert('Erreur', getErrorMessage(e));
      return;
    }
    navigation.popToTop();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.eventTitle}>{booking.event.title}</Text>
        <Text style={styles.summaryLine}>{booking.quantity} billet(s)</Text>
        <Text style={styles.total}>{formatPrice(booking.total_amount)}</Text>
      </View>

      <Text style={styles.label}>Moyen de paiement</Text>
      {METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.method, method === m.id && styles.methodActive]}
          onPress={() => setMethod(m.id)}
        >
          <Text style={[styles.methodText, method === m.id && styles.methodTextActive]}>{m.label}</Text>
        </TouchableOpacity>
      ))}

      {method === 'mobile_money' ? (
        <View style={styles.phoneBox}>
          <Input
            label="Numéro Mobile Money"
            value={phone}
            onChangeText={setPhone}
            placeholder="6XXXXXXXX"
            keyboardType="phone-pad"
          />
        </View>
      ) : null}

      <Text style={styles.notice}>Paiement simulé : aucun argent réel n'est débité.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title={`Payer ${formatPrice(booking.total_amount)}`} onPress={handlePay} loading={loading} />
      <View style={styles.spacer} />
      <Button title="Annuler la réservation" variant="outline" onPress={handleCancel} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  summary: { backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, alignItems: 'center' },
  eventTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  summaryLine: { color: COLORS.muted, marginTop: 4 },
  total: { fontSize: 30, fontWeight: '800', color: COLORS.primary, marginTop: 8 },
  label: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 10 },
  method: { backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: COLORS.border },
  methodActive: { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' },
  methodText: { fontSize: 16, color: COLORS.text },
  methodTextActive: { color: COLORS.primary, fontWeight: '700' },
  phoneBox: { marginTop: 8 },
  notice: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginVertical: 14 },
  error: { color: COLORS.danger, textAlign: 'center', marginBottom: 12 },
  spacer: { height: 12 },
});
