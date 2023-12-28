import * as React from 'react';
import { Animated, StyleSheet, View, Text, Pressable, Image ,RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle, images } from '../constants';
import { createAPIEndpoint, BASE_URL } from '../api'
import { useNavigation } from '@react-navigation/native';
import Context from '../context';
import { LinearGradient } from 'expo-linear-gradient';

// components
import CateLessonsHorizontal from '../components/CateLessonsHorizontal';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Home = () => {
  const [cateBook, setCateBook] = React.useState([]); // [{}
  const [bestSeller, setBestSeller] = React.useState([]);
  const [recentlyLesson, setrecentlyLesson] = React.useState([]);
  const [jumpBackIn, setJumpBackIn] = React.useState([]);
  const [vocabs, setVocabs] = React.useState([]);
  const { user_id } = React.useContext(Context);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isReLoading, setIsReloading] = React.useState(false);
  // // console.log(typeof bestSeller);
  React.useEffect(() => {
    createAPIEndpoint('get_all_cate_book')
      .fetch()
      .then(res => {
        setCateBook(res.data);
      })
    createAPIEndpoint('get_best_favorite')
      .fetch()
      .then(res => {
        setBestSeller(res.data);
      })
    createAPIEndpoint('get_all_history_books')
      .fetchById(user_id)
      .then(res => {
        setrecentlyLesson(res.data);
        console.log(res.data);
      })
    createAPIEndpoint('get_jump_BackIn')
      .fetch()
      .then(res => {
        setJumpBackIn(res.data);
      })
    // createAPIEndpoint('get_all_vocabs_of_user')
    //   .fetchById(user_id)
    //   .then(res => {
    //     setVocabs(res.data);
    //   })
  }, [isReLoading])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsReloading(!isReLoading);
    wait(2000).then(() => {
      createAPIEndpoint('get_all_history_books')
        .fetchById(user_id)
        .then(res => {
          setrecentlyLesson(res.data);
        })
      setRefreshing(false)
    });
  }, []);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const opacityIn = scrollY.interpolate({
    inputRange: [0, 128],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const opacityOut = scrollY.interpolate({
    inputRange: [0, 88],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (

    <React.Fragment>
      {device.iPhoneNotch && (
        <Animated.View style={[styles.iPhoneNotch, { opacity: opacityIn }]} />
      )}

      {/* <Animated.View style={[styles.containerHeader, { opacity: opacityOut }]}>
        <FontAwesome color={colors.white} name="cog" size={28} />
      </Animated.View> */}

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={gStyle.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Pressable style={styles.bannerView}>
          <Image style={styles.bannerImage} source={images.Banner}></Image>
        </Pressable>
        {/* <View style={gStyle.spacer} /> */}
        <View style={styles.cateView}>
          <LinearGradient colors={['#b780db', '#cd4848', '#e8b164']} start={[0, 0]}
            end={[1, 1]}
            location={[0.25, 0.4, 1]}
            style={styles.listItem}>
            {cateBook.map((item, index) => {
              return (
                <Pressable key={index} style={styles.itemCateView} onPress={() => navigation.navigate('ListProduct', {cateId: item.id})}>
                  <View style={styles.imageView}>
                    <Image style={styles.itemCateImage} source={images[item.image]}></Image>
                  </View>
                  <Text style={styles.itemCateText}>{item.name}</Text>
                </Pressable>
              )
            })}
          </LinearGradient>
        </View>

        <CateLessonsHorizontal data={recentlyLesson} heading="Sách xem gần đây" />

        <CateLessonsHorizontal
          data={bestSeller}
          heading="Sách phổ biến"
          tagline="Những cuốn sách mà được tìm kiếm nhiều nhất trên trang web"
        />

        <CateLessonsHorizontal
          data={jumpBackIn}
          heading="Sách Mới cập nhật"
          tagline="Những cuốn sách mới cập nhật trên trang web"
        />
        {/* <View style={gStyle.spacer16} /> */}
        {/* <Pressable style={styles.bannerView} onPress={() => navigation.navigate('HomeLearnVocab')}>
          <View>
            <Text style={styles.textLarge}>Từ vựng của tôi</Text>
            <Text style={styles.textSmall}>0/{vocabs.length} Từ vựng đã học</Text>
            <View style={styles.line}></View>
          </View>
        </Pressable>
        <View style={gStyle.spacer6} />
        <CateLessonsHorizontal data={recentlyLesson} heading="Các bài học gần đây" />

        <CateLessonsHorizontal
          data={bestSeller}
          heading="Sách phổ biến"
          tagline="Những cuốn sách mà được tìm kiếm nhiều nhất trên trang web"
        />

        <CateLessonsHorizontal
          data={jumpBackIn}
          heading="Các bài Mới cập nhật"
          tagline="Những cuốn sách mới cập nhật trên trang web"
        /> */}
      </Animated.ScrollView>
      <View style={styles.cartView}>
        <Pressable style={styles.cartButton} onPress={() => navigation.navigate('CartView')}>
          <FontAwesome color={colors.brandPrimary} name="shopping-cart" size={28} />
        </Pressable>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  iPhoneNotch: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  cateView: {
    // paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    // backgroundColor: colors.brandPrimary
    // height: 230,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cateScondView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
    height: 105,
  },
  itemCateView: {
    width: '20%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  listItem: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  imageView: {
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemCateImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain'
  },
  itemCateText: {
    fontSize: 12,
    color: colors.white,
    marginTop: 5,
    textAlign: 'center',
    width: 60
  },
  containerHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneNotch ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  bannerImage: {
    width: '100%',
    marginTop: 50,
    height: 190,
    resizeMode: 'contain',
  },
  textLarge: {
    fontSize: 20,
    color: colors.white,
  },
  textSmall: {
    fontSize: 15,
    marginTop: 30,
    color: colors.greyLight,
  },
  line: {
    height: 10,
    width: '92%',
    backgroundColor: colors.greyLight,
    borderRadius: 10,
    marginTop: 10,
  },
  cartView: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10
  },
  cartButton: {
    backgroundColor: '#e6e4e4',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Home;
