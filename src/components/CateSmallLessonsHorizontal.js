import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle, images } from '../constants';
import axios from 'axios';
import { createAPIEndpoint, BASE_URL } from '../api'

// context
import Context from '../context';



const CateLessonsHorizontal = ({ data, heading, tagline }) => {
  const navigation = useNavigation();
  // get main app state
  const { showLessonBar, updateState, user_id } = React.useContext(Context);

  const onPressJoinBook = (id) => {
    updateState('showLessonBar', !showLessonBar);
    updateState('bookId', id);
    createAPIEndpoint('add_book_to_history_books')
      .post({bookId: id, userId: user_id})
      .then(res => {
        console.log(res.data);
      })
    navigation.navigate('DetailProduct', {bookId: id})
  };

  return (
    <View style={styles.container}>
      {heading && <Text style={styles.heading}>----------{heading}----------</Text>}
      {tagline && <Text style={styles.tagline}>{tagline}</Text>}

      <FlatList
        contentContainerStyle={styles.containerContent}
        data={data}
        horizontal
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            onPress={() => onPressJoinBook(item.id)}
            style={styles.item}
          >
            <View style={styles.image}>
              {item.bookCoverImage && (
                  // <Image source={} style={styles.image} />
                  <Image source={{uri: item.bookCoverImage}} style={styles.image} />
                )}
            </View>
            <Text style={styles.title}>{item.bookName}</Text>
            <View style={styles.footer}>
              <Text style={styles.GiaText}>đ{item.price}</Text>
              <Text style={styles.DaBanText}>Bán {item.numberSold}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

CateLessonsHorizontal.defaultProps = {
  heading: null,
  tagline: null
};

CateLessonsHorizontal.propTypes = {
  // required
  data: PropTypes.array.isRequired,

  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  },
  heading: {
    ...gStyle.textGroup5Bold18,
    color: colors.brandPrimary,
    paddingBottom: 6,
    paddingLeft: 5,
    textAlign: 'center'
  },
  tagline: {
    ...gStyle.textGroup512,
    paddingBottom: 6,
    textAlign: 'center'
  },
  item: {
    marginRight: 16,
    width: 110,
    backgroundColor: colors.white,
    paddingBottom: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: colors.greyLight,
    height: 108,
    width: 108,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: colors.greyLight,
  },
  title: {
    paddingLeft: 5,
    marginTop: 5,
    height: 40,
  },
  footer: {
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  GiaText: {
    color: colors.brandPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  DaBanText: {
    fontSize: 12,
    paddingRight: 5,
  }
});

export default CateLessonsHorizontal;
