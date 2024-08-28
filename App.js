import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import LoadProductScreen from "./screens/LoadProductScreen";
import ViewProductScreen from "./screens/ViewProductScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LoadProduct" component={LoadProductScreen} />
        <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
