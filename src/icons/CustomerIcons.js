import * as React from 'react';
import PropTypes from 'prop-types';
// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../constants';

const CustomerIcons = ({ active, size, iconName }) => {
  const fill = active ? colors.brandPrimary : colors.greyInactive;

  return (
    <Ionicons name={iconName} size={size} color={fill} />
  );
};
CustomerIcons.defaultProps = {
  active: false,
  size: 24
};

CustomerIcons.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default CustomerIcons;
