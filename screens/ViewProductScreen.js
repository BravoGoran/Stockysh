import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function ViewProductScreen() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Buscar producto..." />
      <View style={styles.productsContainer}>
        <View style={styles.product}>
          <Text style={styles.productText}>Producto 1</Text>
        </View>
        <View style={styles.product}>
          <Text style={styles.productText}>Producto 2</Text>
        </View>
        <View style={styles.product}>
          <Text style={styles.productText}>Producto 3</Text>
        </View>
      </View>
      <View style={styles.modifications}>
        <Text style={styles.modificationsText}>Últimas Modificaciones</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#d3d3d3",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  productsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  product: {
    width: 100,
    height: 100,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  productText: {
    color: "white",
  },
  modifications: {
    marginTop: 20,
    alignItems: "center",
  },
  modificationsText: {
    color: "#aaa",
  },
});
