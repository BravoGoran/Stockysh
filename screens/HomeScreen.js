import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [rol, setRole] = useState(null);

  // Obtén el rol del usuario desde AsyncStorage
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const rolData = await AsyncStorage.getItem('userRole');
        if (rolData) {
          setRole(rolData);
        } else {
          console.log("No se encontró el rol en AsyncStorage.");
        }
      } catch (error) {
        console.error("Error al obtener el rol desde AsyncStorage:", error);
      }
    };

    fetchRole();
  }, []);

  // Para depuración, verifica el rol
  useEffect(() => {
    console.log("Rol del usuario:", rol);
  }, [rol]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>STOCKYSH</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Cargar Productos"
          onPress={() => navigation.navigate("LoadProduct")}
          color="#555"
        />
        <Button
          title="Visualizar Productos"
          onPress={() => navigation.navigate("ViewProduct")}
          color="#555"
        />
        {rol === "admin" && (
          <Button
            title="Solicitudes"
            onPress={() => navigation.navigate("AdminApprovalScreen")}
            color="#555"
          />
        )}
        <Button title="Información" onPress={() => {}} color="#555" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 48,
    marginTop: 10,
    fontFamily: "serif",
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
  },
});