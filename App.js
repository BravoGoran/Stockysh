import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoadProductScreen from './screens/LoadProductScreen';
import EditProductScreen from './screens/EditProductScreen';
import ViewProductScreen from './screens/ViewProductScreen';
import AdminApprovalScreen from './screens/AdminApprovalScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  // Aquí ya no es necesario usar navigation.navigate directamente
  const handleLogin = (rol) => {
    setIsAuthenticated(true);
    setUserRole(rol); // Establece el rol del usuario
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pantalla de Autenticación siempre visible */}
        <Stack.Screen name="AuthScreen">
          {(props) => <AuthScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>

        {/* Si está autenticado, muestra las otras pantallas */}
        {isAuthenticated && (
          <>
            <Stack.Screen name="HomeScreen">
              {(props) => <HomeScreen {...props} rol={userRole} />}
            </Stack.Screen>
            <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
            <Stack.Screen name="LoadProduct" component={LoadProductScreen} />
            <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
            {userRole === 'admin' && (
              <Stack.Screen name="AdminApprovalScreen" component={AdminApprovalScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
