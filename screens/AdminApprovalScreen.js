import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:3000"; // Usa una variable de entorno en producción

export default function AdminApprovalScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error("Error al obtener el token", error);
      return null;
    }
  };

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const dni = await AsyncStorage.getItem('dni');

      const response = await fetch(`${API_URL}/user/getSolicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
        body: JSON.stringify({ dni })
      });

      const data = await response.json();
      if (data.success) {
        setSolicitudes(data.solicitudes);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (solicitudId, action) => {
    try {
      const token = await getToken();
      const endpoint = action === 'approve' ? 'aceptarSolicitud' : 'rechazarSolicitud';
      const response = await fetch(`${API_URL}/user/${endpoint}/${solicitudId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Éxito', `Solicitud ${action === 'approve' ? 'aceptada' : 'rechazada'}`);
        fetchSolicitudes(); // Actualizar solicitudes tras la acción
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const renderSolicitud = ({ item }) => (
    <View style={{ marginBottom: 20 }}>
      <Text>Producto: {item.nombre_producto}</Text>
      <Text>Precio: {item.precio}</Text>
      <Text>Stock: {item.stock}</Text>
      <Button title="Aprobar" onPress={() => handleAction(item.id_p, 'approve')} />
      <Button title="Rechazar" onPress={() => handleAction(item.id_p, 'reject')} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={solicitudes}
          renderItem={renderSolicitud}
          keyExtractor={(item) => item.id_p.toString()}
          ListEmptyComponent={<Text>No hay solicitudes pendientes</Text>}
        />
      )}
    </View>
  );
}
