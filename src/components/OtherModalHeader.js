import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { colors, device, gStyle } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// components
import TouchIcon from './TouchIcon';

const OtherModalHeader = ({ left, leftPress, right, rightPress, style, text }) => {
  const navigation = useNavigation(); 
  return (
    <View style={[styles.container, style]}>
      {left && <TouchIcon icon={left} onPress={leftPress} style={styles.left} />}
      {!left && <View style={styles.left} />}

      {text && (
        <View style={styles.containerText}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
      {right && <TouchIcon icon={right} onPress={rightPress} style={styles.right} />}
      {!right && <View style={styles.right} />}
    </View>
  )
};


OtherModalHeader.defaultProps = {
  left: null,
  leftPress: () => null,
  right: null,
  rightPress: () => null,
  style: {},
  text: null
};

OtherModalHeader.propTypes = {
  // optional
  left: PropTypes.element,
  leftPress: PropTypes.func,
  right: PropTypes.element,
  rightPress: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  text: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    // paddingBottom: 15,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    // borderBottomColor: colors.black20,
    // borderBottomWidth: StyleSheet.hairlineWidth
  },
  containerText: {
    alignItems: 'center',
    flex: 5,
    justifyContent: 'center'
  },
  text: {
    ...gStyle.textGroup5Bold16,
    textAlign: 'center'
  },
  left: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  }
});

export default OtherModalHeader;
