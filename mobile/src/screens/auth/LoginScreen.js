// mobile/src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getErrorMessage } from '../../api/client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/theme';
import useAuth from '../../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      // Pas de navigation ici : dès que `user` est rempli, AppNavigator
      // affiche automatiquement l'application principale.
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🎟️ EventBooking</Text>
        <Text style={styles.subtitle}>Connectez-vous pour réserver vos billets</Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="vous@exemple.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Se connecter" onPress={handleLogin} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
          <Text style={styles.linkText}>Pas encore de compte ? <Text style={styles.linkBold}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.muted, textAlign: 'center', marginTop: 6, marginBottom: 32 },
  error: { color: COLORS.danger, marginBottom: 12, textAlign: 'center' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.muted, fontSize: 15 },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});
