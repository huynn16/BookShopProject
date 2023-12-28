import * as React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// navigation
import TabNavigation from './TabNavigation';

// screens
import ModalLogIn from '../screens/Admin/ModalLogIn';
import ModalSignUp from '../screens/Admin/ModalSignUp';
import EditAdmin from '../screens/Admin/EditAdmin';
import ListBook from '../screens/ListBook';
import ListProduct from '../screens/Product/ListProduct';
import EditPostScreen from '../screens/Post/EditPostScreen';
import ChangeCateScreen from '../screens/Post/ChangeCateScreen';
import CartView from '../screens/Cart/CartView';
import SaleNow from '../screens/Cart/SaleNow';
import DetailProduct from '../screens/Product/DetailProduct';
import HistoryBooks from '../screens/Product/HistoryBooks';
import HistoryOrder from '../screens/Cart/HistoryOrder';
import StatusOrder from '../screens/Cart/StatusOrder';


const Stack = createNativeStackNavigator();

export default () => (
  <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator
      screenOptions={{
        presentation: 'fullScreenModal'
      }}
    >
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ModalLogIn"
        component={ModalLogIn}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ModalSignUp"
        component={ModalSignUp}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="EditAdmin"
        component={EditAdmin}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ListBook"
        component={ListBook}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ListProduct"
        component={ListProduct}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="EditPostScreen"
        component={EditPostScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ChangeCateScreen"
        component={ChangeCateScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="CartView"
        component={CartView}
        options={{
          headerShown: false
        }}
      />
      
      <Stack.Screen
        name="HistoryOrder"
        component={HistoryOrder}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="DetailProduct"
        component={DetailProduct}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="HistoryBooks"
        component={HistoryBooks}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="SaleNow"
        component={SaleNow}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="StatusOrder"
        component={StatusOrder}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);