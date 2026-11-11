// mobile/src/screens/profile/ProfileScreen.js
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import { COLORS, RADIUS } from '../../constants/theme';
import useAuth from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function confirmLogout() {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.full_name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>{user.is_admin ? 'Administrateur' : 'Utilisateur'}</Text>
      </View>

      <Button title="Se déconnecter" variant="danger" onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS, padding: 24, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 12 },
  email: { fontSize: 15, color: COLORS.muted, marginTop: 4 },
  role: { marginTop: 10, fontSize: 13, color: COLORS.primary, fontWeight: '700' },
});
