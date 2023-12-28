import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import MallScreen from '../screens/Mall';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Mall"
      component={MallScreen}
      options={{
        headerShown: false
      }}
    />
  </Stack.Navigator>
);