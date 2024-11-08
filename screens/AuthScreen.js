import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

export default function AuthScreen({ onLogin }) {
  const [nombre, setNombre] = useState(''); // Nombre del usuario
  const [dni, setDni] = useState(''); // DNI del usuario
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Email del usuario
  const [isLogin, setIsLogin] = useState(true);

  const navigation = useNavigation(); // Usa useNavigation para acceder al objeto de navegación

  const handleAuth = async () => {
    const endpoint = isLogin ? 'http://back-stockysh.vercel.app/user/login' : 'http://back-stockysh.vercel.app/user/usersp';

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

      if (data.success) {
        console.log("Token:", data.token); // Verifica el token recibido
        console.log("DNI:", dni); // Verifica el DNI antes de guardarlo

        // Guardar los otros datos en AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('dni', dni); // Guarda el DNI correctamente
        await AsyncStorage.setItem('userRole', data.rol);
        await AsyncStorage.setItem('nombre', data.nombre); // Guardamos el nombre
        await AsyncStorage.setItem('email', data.email); // Guardamos el email

        console.log("DNI guardado en AsyncStorage:", dni); // Verifica que el DNI se guarda
        console.log("Nombre:", data.nombre); // Verifica el nombre recibido
        console.log("Email:", data.email); // Verifica el email recibido

        // Llamada a onLogin pasando el rol para gestionar la pantalla
        onLogin(data.rol); // Cambia a la pantalla principal

        // Navegar a la pantalla Home después de un login exitoso
        navigation.navigate('Home');
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

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Text style={styles.linkText}>{isLogin ? "Regístrate" : "Inicia sesión"}</Text>
        </Text>
      </TouchableOpacity>
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
  switchText: {
    textAlign: 'center',
    marginTop: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});
