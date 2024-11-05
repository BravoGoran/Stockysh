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
        await AsyncStorage.setItem('userRole', data.rol); // Guarda el rol del usuario
        console.log("Token guardado:", data.token);
        console.log("Rol guardado:", data.rol);
        onLogin(data.rol); // Cambia a la pantalla principal y pasa el rol
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="DNI"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={isLogin ? "Iniciar sesión" : "Registrarse"} onPress={handleAuth} />
      <Button
        title={`Cambiar a ${isLogin ? "Registro" : "Inicio de sesión"}`}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
