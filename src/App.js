import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LocationScreen from './screens/LocationScreen';
import ToursList from './screens/TutorlistScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Location"
          screenOptions={{
            // headerShown: false,
            gestureEnabled: false,
          }}>
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Tours" component={ToursList} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
