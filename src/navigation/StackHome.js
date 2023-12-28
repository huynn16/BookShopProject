import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import HomeScreen from '../screens/Home';
// import CateLessonScreen from '../screens/CateLesson';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false
      }}
    />
    {/* <Stack.Screen
      name="CateLesson"
      component={CateLessonScreen}
      options={{
        headerShown: false
      }}
      initialParams={{ title: 'Extraordinary Machine' }}
    /> */}
  </Stack.Navigator>
);