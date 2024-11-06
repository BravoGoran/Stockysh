import React, { useEffect, useState } from 'react';
import { Alert, View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewProductScreen() {
  const [productos, setProductos] = useState([]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token obtenido:", token); // Verificar que se obtiene el token
      return token;
    } catch (error) {
      console.error("Error al obtener el token", error);
      return null;
    }
  };

  const fetchProductos = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se encontró el token');
        return;
      }

      const response = await fetch('http://back-stockysh.vercel.app/user/getProductos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Verifica si data.productos es un arreglo
        if (Array.isArray(data.productos)) {
          // Filtrar productos para excluir aquellos con estado "pendiente"
          const productosFiltrados = data.productos.filter(producto => producto.estado !== 'pendiente');
          setProductos(productosFiltrados);
        } else {
          console.error("La respuesta no contiene productos válidos", data);
          Alert.alert('Error', 'No se encontraron productos válidos');
        }
      } else {
        Alert.alert('Error', `Error: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      {productos.length > 0 ? (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id_p.toString()} // Asumiendo que id_p es la clave única
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text>Nombre: {item.nombre_producto}</Text>
              <Text>Precio: {item.precio}</Text>
              <Text>Stock: {item.stock}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No hay productos disponibles.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
