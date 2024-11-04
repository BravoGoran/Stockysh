import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:3000"; // Usar variable de entorno en producción

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
      const response = await fetch(`${API_URL}/user/getSolicitudes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
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

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : solicitudes.length > 0 ? (
        solicitudes.map(solicitud => (
          <View key={solicitud.id_p}>
            <Text>{`Producto: ${solicitud.nombre_producto}, Precio: ${solicitud.precio}`}</Text>
            <Button title="Aprobar" onPress={() => handleAction(solicitud.id_p, 'approve')} />
            <Button title="Rechazar" onPress={() => handleAction(solicitud.id_p, 'reject')} />
          </View>
        ))
      ) : (
        <Text>No hay solicitudes pendientes.</Text>
      )}
    </View>
  );
}


