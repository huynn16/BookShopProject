import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import PostScreen from '../screens/Post/PostScreen';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={PostScreen}
      options={{
        headerShown: false
      }}
    />
  </Stack.Navigator>
);