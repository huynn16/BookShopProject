import * as React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View,
    ActivityIndicator,
} from 'react-native';
import { createAPIEndpoint, BASE_URL } from '../../api'
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import ModalHeader from '../../components/ModalHeader';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Context from '../../context';

const ListProduct = ({ route }) => {
    const [books, setBooks] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { cateId } = route.params;
    const { showLessonBar, updateState, user_id } = React.useContext(Context);
    React.useEffect(() => {
        createAPIEndpoint('get_book_by_cateId')
            .fetchById(cateId)
            .then(res => {
                setBooks(res.data);
                setIsLoading(false);
            })
    }, [])


    const scrollY = React.useRef(new Animated.Value(0)).current;

    // search start (24 horizontal padding )
    const searchStart = device.width - 48;
    const searchEnd = device.width - 88;

    const opacity = scrollY.interpolate({
        inputRange: [0, 48],
        outputRange: [searchStart, searchEnd],
        extrapolate: 'clamp'
    });

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

    const navigation = useNavigation();
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <React.Fragment>
            <View style={gStyle.container}>
                <ModalHeader
                    left={<Feather color={colors.greyLight} name="chevron-down" />}
                    leftPress={() => navigation.goBack(null)}
                    right={<Feather color={colors.greyLight} name="more-horizontal" />}
                    text={"Danh mục sách"}
                />
                <Animated.ScrollView
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[1]}
                    style={gStyle.container}
                >
                    <View style={styles.cateView}>
                        {books.map((item, index) => {
                            return (
                                <TouchableOpacity
                                activeOpacity={gStyle.activeOpacity}
                                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                onPress={() => onPressJoinBook(item.id)}
                                style={styles.item}
                              >
                                <View style={styles.image}>
                                  {item.bookCoverImage && (
                                    <Image source={{uri: item.bookCoverImage}} style={styles.image} />
                                  )}
                                </View>
                                <Text style={styles.title}>{item.bookName}</Text>
                                <View style={styles.footer}>
                                  <Text style={styles.GiaText}>{item.price}đ</Text>
                                  <Text style={styles.DaBanText}>Bán {item.numberSold}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                        })}

                    </View>
                </Animated.ScrollView>
            </View>

            {/* <View style={styles.iconRight}>
        <TouchIcon
          icon={<FontAwesome color={colors.white} name="microphone" />}
          onPress={() => null}
        />
      </View> */}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    containerSearchBar: {
        ...gStyle.pH3,
        backgroundColor: colors.blackBg,
        paddingBottom: 16,
        paddingTop: device.iPhoneNotch ? 64 : 24
    },
    searchPlaceholder: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 6,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingVertical: 16
    },
    searchPlaceholderText: {
        ...gStyle.textGroup516,
        color: colors.blackBg
    },
    sectionHeading: {
        ...gStyle.textGroup5Bold18,
        color: colors.white,
        marginBottom: 24,
        marginLeft: 24,
        marginTop: 16
    },
    cateView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        marginTop: 16,
        justifyContent: 'space-between',
    },
    item: {
        width: "45%",
        borderColor: colors.greyLight,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
      },
      image: {
        backgroundColor: colors.greyLight,
        height: 150,
        width: "100%",
        borderColor: colors.greyLight,
      },
      title: {
        paddingLeft: 5,
        marginTop: 5,
        height: 40,
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      GiaText: {
        width: '60%',
        color: colors.brandPrimary,
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 5,
      },
      DaBanText: {
        width: '40%',
        fontSize: 12,
        paddingRight: 5,
      }
});

export default ListProduct;
