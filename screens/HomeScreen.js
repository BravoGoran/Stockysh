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
    navigation.navigate("AuthScreen"); // Asegura la navegación a la pantalla de autenticación
  };
  
  

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>STOCKYSH</Text>

      <View style={styles.buttonContainer}>
        <Button 
          title="Cargar Productos" 
          onPress={() => navigation.navigate("LoadProduct")} 
          color="#4a90e2" 
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Visualizar Productos" 
          onPress={() => navigation.navigate("ViewProduct")} 
          color="#4a90e2" 
        />
        <View style={styles.buttonSpacer} />
        {rol === "admin" && (
          <Button 
            title="Solicitudes" 
            onPress={() => navigation.navigate("AdminApprovalScreen")} 
            color="#4a90e2" 
          />
        )}
      </View>

      <Ionicons
        name="log-out-outline"
        size={30}
        color="black"
        style={styles.logoutIcon}
        onPress={handleLogout}
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

            <View style={styles.modalButtonContainer}>
              <Button title="Guardar Cambios" onPress={handleSaveChanges} color="#4a90e2" />
              <View style={styles.buttonSpacer} />
              <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#f00" />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <Button title="Buscar" onPress={handleSearch} color="#4a90e2" />
      </View>

      <View style={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productText}>Nombre: {product.nombre_producto}</Text>
              <Text style={styles.productText}>Precio: {product.precio}</Text>
              <Text style={styles.productText}>Stock: {product.stock}</Text>
              <Button
                title="Editar Producto"
                onPress={() => navigation.navigate("EditProductScreen", { product })}
                color="#4a90e2"
              />
            </View>
          ))
        ) : (
          <Text style={styles.noProductsText}>No se encontraron productos.</Text>
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
    backgroundColor: "#f2f2f2",
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4a90e2",
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonSpacer: {
    height: 10,
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 15,
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
    borderRadius: 5,
    marginRight: 10,
  },
  productList: {
    marginTop: 20,
    width: "90%",
  },
  productItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productText: {
    fontSize: 16,
    color: "#333",
  },
  noProductsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

