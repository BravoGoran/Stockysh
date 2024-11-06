import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ onLogin }) {
  const [nombre, setNombre] = useState(''); // Nombre del usuario
  const [dni, setDni] = useState(''); // DNI del usuario
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Email del usuario
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    const endpoint = isLogin ? 'http://localhost:3000/user/login' : 'http://localhost:3000/user/usersp';
  
    try {
      const body = isLogin
        ? { dni, contra: password }
        : { nombre, dni, contra: password, email }; // En el registro, incluimos todos los campos
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      console.log("Respuesta del backend:", data); // Verifica la respuesta completa
  
      if (data.success) {
        console.log("Token:", data.token); // Verifica el token recibido
        console.log("DNI:", dni); // Verifica el DNI antes de guardarlo
  
        // Verificar los campos 'nombre' y 'email' antes de guardarlos
        console.log("Nombre recibido:", data.nombre);
        console.log("Email recibido:", data.email);
  
        // Guardamos los datos directamente desde la respuesta del login
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('dni', dni); // Guarda el DNI correctamente
        await AsyncStorage.setItem('userRole', data.rol); // Guarda el rol
        await AsyncStorage.setItem('nombre', data.nombre || ''); // Aseguramos que se guarda un valor
        await AsyncStorage.setItem('email', data.email || ''); // Aseguramos que se guarda un valor
  
        console.log("DNI guardado en AsyncStorage:", dni); // Verifica que el DNI se guarda
        console.log("Nombre:", data.nombre); // Verifica el nombre recibido
        console.log("Email:", data.email); // Verifica el email recibido
  
        // Llamada a onLogin pasando el rol para gestionar la pantalla
        onLogin(data.rol); // Cambia a la pantalla principal
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <TextInput
            placeholder="DNI"
            value={dni}
            onChangeText={setDni}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="DNI"
            value={dni}
            onChangeText={setDni}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </>
      )}
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
