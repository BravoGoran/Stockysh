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
        if (Array.isArray(data.productos)) {
          // Filtrar productos para excluir aquellos con estado "pendiente"
          const productosFiltrados = data.productos
            .filter(producto => producto.estado !== 'pendiente')
            // Ordenar los productos por la fecha de actualización (updated_at) de forma descendente
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            // Tomar solo los primeros 10 productos después de ordenar
            .slice(0, 10);
  
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
              <Text style={styles.productText}>Nombre: {item.nombre_producto}</Text>
              <Text style={styles.productText}>Precio: ${item.precio}</Text>
              <Text style={styles.productText}>Stock: {item.stock}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noProductsText}>No hay productos disponibles.</Text>
      )}
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f2f2f2', // Fondo claro para hacer contraste
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#4a90e2',
      marginBottom: 20,
      textAlign: 'center',
    },
    productItem: {
      padding: 15,
      marginBottom: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      width: '100%',
    },
    productText: {
      fontSize: 16,
      color: "#333",
      marginBottom: 5,
    },
    noProductsText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginTop: 20,
    },
  });
