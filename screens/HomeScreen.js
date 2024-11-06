import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image, Modal, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [rol, setRole] = useState(null);
  const [dni, setDni] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contra, setContra] = useState('');
  const [nuevoDni, setNuevoDni] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolData = await AsyncStorage.getItem('userRole');
        if (rolData !== null) {
          setRole(rolData);
        }

        let dniData = await AsyncStorage.getItem('dni');
        if (dniData !== null) {
          setDni(dniData);
          
          const storedNombre = await AsyncStorage.getItem('nombre');
          const storedEmail = await AsyncStorage.getItem('email');

          if (storedNombre && storedEmail) {
            setNombre(storedNombre);
            setEmail(storedEmail);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos desde AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      if (!searchQuery) {
        alert('Por favor, ingrese un ID de producto para buscar.');
        return;
      }

      const response = await fetch(`http://back-stockysh.vercel.app/user/getProductoById/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth': await AsyncStorage.getItem('token'),
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Producto encontrado:', data.producto);
        setFilteredProducts([data.producto]);
      } else {
        alert(data.message || 'Producto no encontrado.');
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      alert('Hubo un error al buscar el producto.');
      setFilteredProducts([]);
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = {};

    if (nombre && nombre !== dni.nombre) {
      updatedData.nombre = nombre;
    }

    if (email && email !== dni.email) {
      updatedData.email = email;
    }

    if (contra && contra !== dni.contra) {
      updatedData.contra = contra;
    }

    if (nuevoDni && nuevoDni !== dni) {
      updatedData.dni = nuevoDni;
    }

    if (Object.keys(updatedData).length === 0) {
      console.log("No se han realizado cambios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await fetch(`http://back-stockysh.vercel.app/user/modificarUsuario/${dni}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos actualizados:", data);
      } else {
        const errorData = await response.json();
        throw new Error(`Error al actualizar los datos: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate("Auth"); // Asegura la navegación a la pantalla de autenticación
  };
  
  

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>STOCKYSH</Text>

      <View style={styles.buttonContainer}>
        <Button title="Cargar Productos" onPress={() => navigation.navigate("LoadProduct")} color="#555" />
        <Button title="Visualizar Productos" onPress={() => navigation.navigate("ViewProduct")} color="#555" />
        
        {rol === "admin" && (
          <Button title="Solicitudes" onPress={() => navigation.navigate("AdminApprovalScreen")} color="#555" />
        )}
        <Button title="Información" onPress={() => {}} color="#555" />
      </View>

      <Ionicons
        name="log-out-outline"
        size={30}
        color="black"
        style={styles.logoutIcon}
        onPress={handleLogout} // Añadir el evento de logout
      />

      <Ionicons
        name="person"
        size={30}
        color="black"
        style={styles.userIcon}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Modificar Datos del Usuario</Text>
            <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Contraseña" value={contra} onChangeText={setContra} style={styles.input} secureTextEntry />
            <TextInput placeholder="Nuevo DNI" value={nuevoDni} onChangeText={setNuevoDni} style={styles.input} keyboardType="numeric" />

            <View style={styles.buttonContainer}>
              <Button title="Guardar Cambios" onPress={handleSaveChanges} />
              <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#f00" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>

      {/* Lista de productos filtrados */}
      <View style={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Text>Nombre: {product.nombre_producto}</Text>
              <Text>Precio: {product.precio}</Text>
              <Text>Stock: {product.stock}</Text>
              <Button
                title="Editar Producto"
                onPress={() => navigation.navigate("EditProductScreen", { product })}
              />
            </View>
          ))
        ) : (
          <Text>No se encontraron productos.</Text>
        )}
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
  logoutIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  userIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  searchContainer: {
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  productList: {
    marginTop: 20,
    width: "80%",
  },
  productItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
