import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params;

  // Estado para los campos editables
  const [nombre, setNombre] = useState(product.nombre_producto);
  const [precio, setPrecio] = useState(product.precio.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [dni, setDni] = useState(""); // Para almacenar el DNI

  // Función para obtener el DNI desde AsyncStorage
  const getDniFromAsyncStorage = async () => {
    try {
      const storedDni = await AsyncStorage.getItem("dni");
      if (storedDni) {
        setDni(storedDni); // Actualizamos el estado con el DNI
      }
    } catch (error) {
      console.error("Error al obtener el DNI desde AsyncStorage:", error);
    }
  };

  // Cargar el DNI cuando el componente se monta
  useEffect(() => {
    getDniFromAsyncStorage();
  }, []);

  // Función para manejar la actualización del producto
  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
  
      const response = await fetch(`http://back-stockysh.vercel.app/user/updateProducto/${product.id_p}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth": token,
        },
        body: JSON.stringify({
          dni: dni,
          nombre_producto: nombre,
          precio: parseInt(precio),
          stock: parseInt(stock),
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        Alert.alert("Éxito", data.message);
        // Pasa un parámetro 'refresh' para forzar el refresco en la pantalla de inicio
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else {
        Alert.alert("Aviso", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Alert.alert("Error", "Hubo un error al actualizar el producto.");
    }
  };

  // Función para manejar la eliminación del producto
  const handleDeleteProduct = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const dni = await AsyncStorage.getItem("dni"); // Obtener el DNI del usuario

      const id_p = product.id_p; // El ID del producto a eliminar

      console.log("DNI:", dni);

      console.log("ID del producto:", id_p);
  
      const response = await fetch(`http://back-stockysh.vercel.app/user/deleteProducto/${id_p}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth": token,  // Aquí asumimos que el token está correctamente configurado
        },
        body: JSON.stringify({
          dni: dni,
          id_p: id_p, // Enviamos también el id_p en el cuerpo
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        Alert.alert("Éxito", data.message);
        // Redirigir o refrescar la pantalla después de eliminar el producto
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Alert.alert("Error", "Hubo un error al eliminar el producto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del producto"
      />
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="Precio"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        placeholder="Stock"
        keyboardType="numeric"
      />
      <Button title="Guardar Cambios" onPress={handleSaveChanges} />
      <Button title="Eliminar Producto" onPress={handleDeleteProduct} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 15,
  },
});
