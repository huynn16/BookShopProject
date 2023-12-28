import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import TouchIcon from './TouchIcon';

const ScreenHeader = ({ showBack, title }) => {
  const navigation = useNavigation();

  return (
    <BlurView tint="default" intensity={50} style={styles.container}>

      <View style={styles.containerText}>
        <Text style={styles.text}>{title}</Text>
      </View>

      {showBack && <View style={gStyle.flex1} />}
    </BlurView>
  );
};

ScreenHeader.defaultProps = {
  showBack: false
};

ScreenHeader.propTypes = {
  // required
  title: PropTypes.string.isRequired,

  // optional
  showBack: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: device.iPhoneNotch ? 40 : 20
  },
  containerText: {
    ...gStyle.flex5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    ...gStyle.textGroup5Bold16,
    textAlign: 'center'
  },
  left: {
    ...gStyle.flex1,
    alignItems: 'flex-start'
  }
});

export default ScreenHeader;
