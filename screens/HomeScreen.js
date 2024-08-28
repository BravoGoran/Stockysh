import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";

export default function HomeScreen({ navigation }) {
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
