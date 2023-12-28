import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Feather,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, gStyle } from '../constants';

const LineItemCategory = ({
  icon,
  onPress,
  title,
  disableRightSide,
  iconLibrary,
  iconColor,
}) => {
  let iconDisplay;

  switch (iconLibrary) {
    default:
    case 'Ionicons':
      iconDisplay = (
        <Ionicons color={iconColor} name={icon} size={24} />
      );
    // case 'Feather':
    //   iconDisplay = (
    //     <Feather color={iconColor} name={icon} size={24} />
    //   );
    //   break;
    // case 'Entypo':
    //   iconDisplay = (
    //     <Entypo color={iconColor} name={icon} size={24} />
    //   );
    //   break;
    // case 'MaterialIcons':
    //   iconDisplay = (
    //     <MaterialIcons color={iconColor} name={icon} size={24} />
    //   );
    //   break;
    // case 'MaterialCommunityIcons':
    //   iconDisplay = (
    //     <MaterialCommunityIcons
    //       color={iconColor}
    //       name={icon}
    //       size={24}
    //     />
    //   );
    //   break;
    // case 'FontAwesome':
    //   iconDisplay = (
    //     <FontAwesome color={iconColor} name={icon} size={24} />
    //   );
    //   break;
  }

  return (
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      onPress={onPress}
      style={styles.container}
    >
      <View style={gStyle.flexRowCenterAlign}>
        {iconDisplay}
        <Text style={styles.title}>{title}</Text>
      </View>

      {disableRightSide ? null : (
        <View style={styles.containerRight}>
          <Feather color={iconColor} name="chevron-right" size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
};

LineItemCategory.defaultProps = {
  disableRightSide: null,
  iconLibrary: 'Feather'
};

LineItemCategory.propTypes = {
  // required
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,

  // optional
  disableRightSide: PropTypes.bool,
  iconLibrary: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    width: '100%'
  },
  title: {
    ...gStyle.textGroup514,
    color: colors.black,
    marginLeft: 16
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  }
});

export default LineItemCategory;
