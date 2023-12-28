import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';
import { Audio } from "expo-av";
// context
import Context from '../context';

const BarLessonPlayer = ({ lesson }) => {
  const navigation = useNavigation();
  const { showLessonBar, updateState, bookId } = React.useContext(Context);

  // local state
  const [favorited, setFavorited] = React.useState(false);

  const favoriteColor = favorited ? colors.brandPrimary : colors.white;
  // const favoriteIcon = favorited ? 'star' : 'star-o';
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('DetailProduct', { bookId: 1 })} // onPress={() => updateState('showLessonBar', !showLessonBar
      style={styles.container}
    >
      {lesson && (
        <View style={styles.productInfoView}>
          <View>
            <Text style={styles.device}>Đơn hàng đang xem</Text>
          </View>
          <View style={styles.containerLesson}>
            <Text style={styles.title}>{`${lesson.title}`}</Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        hitSlop={{ bottom: 10, left: 10, right: 0, top: 0 }}
        onPress={() => { setFavorited(!favorited); updateState('showLessonBar', !showLessonBar) }}
        style={styles.containerIcon}
      >
        <FontAwesome color={favoriteColor} name={"angle-down"} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

BarLessonPlayer.defaultProps = {
  lesson: null
};

BarLessonPlayer.propTypes = {
  // optional
  lesson: PropTypes.shape({
    author: PropTypes.string,
    title: PropTypes.string
  })
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.grey,
    borderBottomColor: colors.blackBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    width: '100%'
  },
  productInfoView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20
  },
  containerIcon: {
    width: 50
  },
  containerLesson: {
    overflow: 'hidden',
    width: device.width - 100
  },
  title: {
    color: colors.white
  },
  device: {
    fontSize: 12,
    color: colors.brandPrimary,
    textTransform: 'uppercase'
  }
});

export default BarLessonPlayer;
