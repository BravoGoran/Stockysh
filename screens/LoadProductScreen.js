import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function LoadProductScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargar Producto</Text>
      <TextInput style={styles.input} placeholder="ID" />
      <TextInput style={styles.input} placeholder="Nombre" />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
      />
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>Imagen del Producto</Text>
      </View>
      <Button title="ENVIAR" onPress={() => {}} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageText: {
    color: "#666",
  },
});
