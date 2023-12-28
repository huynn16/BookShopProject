import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants';

// navigation stacks
// import StackHome from './StackHome';
// import StackSearch from './StackSearch';
// import StackPerson from './StackPerson';
// import StackNews from './StackNews';
// import StackPost from './StackPost';

//new
import StackHome from './StackHome';
import StackMall from './StackMall';
import StackPost from './StackPost';
import StackPerson from './StackPerson';

// components
import CustomTabBar from '../components/CustomTabBar';

// icons
import CustomerIcons from '../icons/CustomerIcons';


const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ active }) => {
        let icon = <CustomerIcons iconName={"home"} active={active} />;

        if (route.name === 'StackMall') {
          icon = <CustomerIcons iconName={"library"} active={active} />;
        } else if (route.name === 'StackPost') {
          icon = <CustomerIcons iconName={"newspaper"} active={active} />;
        } else if (route.name === 'StackPerson') {
          icon = <CustomerIcons iconName={"ios-person-outline"} active={active} />;
        }

        return icon;
      },
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.greyInactive
    })}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="StackHome"
      component={StackHome}
      options={{
        tabBarLabel: 'Home'
      }}
    />

    <Tab.Screen
      name="StackMall"
      component={StackMall}
      options={{
        tabBarLabel: 'Đầu sách'
      }}
    />

    <Tab.Screen
      name="StackPost"
      component={StackPost}
      options={{
        tabBarLabel: 'Review sách'
      }}
    />

    <Tab.Screen
      name="StackPerson"
      component={StackPerson}
      options={{
        tabBarLabel: 'Tôi'
      }}
    />
  </Tab.Navigator>
);