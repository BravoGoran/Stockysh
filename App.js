import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoadProductScreen from './screens/LoadProductScreen';
import ViewProductScreen from './screens/ViewProductScreen';
import AuthScreen from './screens/AuthScreen';
import AdminApprovalScreen from './screens/AdminApprovalScreen'; // Asegúrate de importar la pantalla de aprobación

const Stack = createNativeStackNavigator();



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role); // Establece el rol del usuario
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
           <Stack.Screen name="Home">
  {(props) => <HomeScreen {...props} role={userRole} />}
</Stack.Screen>
            <Stack.Screen name="LoadProduct" component={LoadProductScreen} />
            <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
            {userRole === 'admin' && (
              <Stack.Screen name="AdminApproval" component={AdminApprovalScreen} />
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

