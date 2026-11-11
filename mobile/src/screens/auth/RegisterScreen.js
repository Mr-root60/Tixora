// mobile/src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getErrorMessage } from '../../api/client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS } from '../../constants/theme';
import useAuth from '../../hooks/useAuth';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!fullName || !email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(fullName.trim(), email.trim(), password);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>

        <Input label="Nom complet" value={fullName} onChangeText={setFullName} placeholder="Jean Dupont" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="vous@exemple.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Mot de passe (6 caractères minimum)"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="S'inscrire" onPress={handleRegister} loading={loading} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={styles.linkText}>Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 24 },
  error: { color: COLORS.danger, marginBottom: 12, textAlign: 'center' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.muted, fontSize: 15 },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});
