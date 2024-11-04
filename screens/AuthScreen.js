import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ onLogin }) {
  const [username, setUsername] = useState(''); // Aquí se capturará el DNI
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    const endpoint = isLogin ? 'http://localhost:3000/user/login' : 'http://localhost:3000/user/usersp';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni: username, contra: password }),
      });
  
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem('token', data.token); // Guarda el token
        await AsyncStorage.setItem('dni', username); // Guarda el DNI actual
        await AsyncStorage.setItem('role', data.role); // Guarda el rol del usuario
        console.log("Token guardado:", data.token);
        onLogin(data.role); // Cambia a la pantalla principal y pasa el rol
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isLogin ? 'Iniciar Sesión' : 'Registrarse'} onPress={handleAuth} />
      <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  toggleText: { marginTop: 20, color: 'blue', textAlign: 'center', textDecorationLine: 'underline' },
});
