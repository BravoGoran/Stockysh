import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoadProductScreen from './screens/LoadProductScreen';
import EditProductScreen from "./screens/EditProductScreen";
import ViewProductScreen from './screens/ViewProductScreen';
import AdminApprovalScreen from './screens/AdminApprovalScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  const handleLogin = (rol) => {
    setIsAuthenticated(true);
    setUserRole(rol); // Establece el rol del usuario
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} rol={userRole} />}
            </Stack.Screen>
            <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
            <Stack.Screen name="LoadProduct" component={LoadProductScreen} />
            <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
            {userRole === 'admin' && (
              <Stack.Screen name="AdminApprovalScreen" component={AdminApprovalScreen} />
            )}
          </>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
