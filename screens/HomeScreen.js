import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image, Modal, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [rol, setRole] = useState(null);
  const [dni, setDni] = useState(null);  // Cambié a null para mayor claridad
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contra, setContra] = useState('');
  const [nuevoDni, setNuevoDni] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolData = await AsyncStorage.getItem('userRole');
        if (rolData !== null) {
          setRole(rolData);
        } else {
          console.log("No se encontró el rol en AsyncStorage.");
        }

        // Verifica si el DNI está en AsyncStorage
        let dniData = await AsyncStorage.getItem('dni');
        if (dniData !== null) {
          setDni(dniData);  // Guardamos el DNI directamente
          
          // Obtener el nombre y email desde AsyncStorage directamente, si están disponibles
          const storedNombre = await AsyncStorage.getItem('nombre');
          const storedEmail = await AsyncStorage.getItem('email');

          if (storedNombre && storedEmail) {
            setNombre(storedNombre); // Asumiendo que el nombre está guardado en AsyncStorage
            setEmail(storedEmail);   // Asumiendo que el email está guardado en AsyncStorage
          } else {
            console.log("Nombre o Email no encontrados en AsyncStorage.");
          }
        } else {
          console.log("No se encontró el DNI en AsyncStorage.");
        }
      } catch (error) {
        console.error("Error al obtener datos desde AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  const handleSaveChanges = async () => {
    // Crear un objeto para los campos actualizados
    const updatedData = {};
  
    // Solo agregar los campos que han sido modificados
    if (nombre && nombre !== dni.nombre) {
      updatedData.nombre = nombre;
    }
  
    if (email && email !== dni.email) {
      updatedData.email = email;
    }
  
    if (contra && contra !== dni.contra) {
      updatedData.contra = contra;
    }
  
    if (nuevoDni && nuevoDni !== dni) {  // Verifica contra 'dni'
      updatedData.dni = nuevoDni;
    }
  
    // Si no hay cambios, no enviar nada
    if (Object.keys(updatedData).length === 0) {
      console.log("No se han realizado cambios.");
      return; // Termina la función si no hay cambios
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
  
      // Realizar la solicitud PUT con los datos actualizados
      const response = await fetch(`http://localhost:3000/user/modificarUsuario/${dni}`, {  
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth': token, // Enviar el token en los encabezados
        },
        body: JSON.stringify(updatedData), // Enviar solo los datos modificados
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
            <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Contraseña"
              value={contra}
              onChangeText={setContra}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder="Nuevo DNI"
              value={nuevoDni}
              onChangeText={setNuevoDni}
              style={styles.input}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <Button title="Guardar Cambios" onPress={handleSaveChanges} />
              <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#f00" />
            </View>
          </View>
        </View>
      </Modal>
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
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
