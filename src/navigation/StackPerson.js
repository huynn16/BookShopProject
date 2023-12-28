import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import PersonScreen from '../screens/Person';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Person"
      component={PersonScreen}
      options={{
        headerShown: false
      }}
    />
  </Stack.Navigator>
);