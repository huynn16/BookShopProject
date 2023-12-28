import * as React from 'react';
import PropTypes from 'prop-types';
// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../constants';

const IconsSearch = ({ fill, size }) => (
  <Ionicons name={"search"} size={size} color={fill} />
);

IconsSearch.defaultProps = {
  fill: colors.blackBg,
  size: 24
};

IconsSearch.propTypes = {
  // optional
  fill: PropTypes.string,
  size: PropTypes.number
};

export default IconsSearch;
