import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, device, gStyle } from '../constants';

// components
import BarLessonPlayer from './BarLessonPlayer';

// context
import Context from '../context';

// https://reactnavigation.org/docs/5.x/bottom-tab-navigator/#tabbar
const CustomTabBar = ({ descriptors, navigation, state }) => {
  // get main app state
  const { currentLessonData, showLessonBar } = React.useContext(Context);

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <React.Fragment>
      {showLessonBar && <BarLessonPlayer lesson={currentLessonData} />}

      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // default label
          const defaultLabl =
            options.title !== undefined ? options.title : route.name;
          // label set
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : defaultLabl;

          const isFocused = state.index === index;
          const color = isFocused ? colors.brandPrimary : colors.greyInactive;

          // custom icon
          const Icon = options.tabBarIcon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              activeOpacity={gStyle.activeOpacity}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.containerTab}
            >
              <Icon active={isFocused} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </React.Fragment>
  );
};

CustomTabBar.propTypes = {
  // required
  descriptors: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    ...gStyle.flexRowCenterAlign,
    backgroundColor: colors.white,
    paddingBottom: device.iPhoneNotch ? 24 : 16,
    paddingTop: 10,
    borderTopColor: colors.gre,
    // borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000000",
    shadowOpacity: 1.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 1
    }
  },
  containerTab: {
    ...gStyle.flex1,
    ...gStyle.flexCenter
  },
  label: {
    ...gStyle.textGroup512,
    paddingTop: 4
  }
});

export default CustomTabBar;
