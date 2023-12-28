import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

import ModalHeader from '../../components/ModalHeader';
import { createAPIEndpoint, BASE_URL } from '../../api'
import Context from '../../context';
// components
import CateSmallLessonsHorizontal from '../../components/CateSmallLessonsHorizontal';
import { Pressable } from 'react-native';

const DetailProduct = ({ route }) => {
    const { bookId } = route.params;
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeSlide, setActiveSlide] = React.useState(0);
    const [detailBook, setDetailBook] = React.useState({});
    const [bestSeller, setBestSeller] = React.useState([]);
    const { user_id } = React.useContext(Context);

    const scrollY = React.useRef(new Animated.Value(0)).current;

    // search start (24 horizontal padding )
    const searchStart = device.width - 48;
    const searchEnd = device.width - 88;

    const opacity = scrollY.interpolate({
        inputRange: [0, 48],
        outputRange: [searchStart, searchEnd],
        extrapolate: 'clamp'
    });

    const handleSlideChange = (event) => {
        const slideWidth = Dimensions.get('window').width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const activeSlide = Math.floor(contentOffset / slideWidth);
        setActiveSlide(activeSlide);
    };

    const handleAddBookToCart = (bookId) => {
        createAPIEndpoint('add_book_to_cart')
            .post({ bookId: bookId, quantity: 1, userId: user_id})
            .then(res => {
                if (res.data.status == 200) {
                    alert("Thêm vào giỏ hàng thành công");
                }
            })
    }

    const handleNavigation = () => {
        const totalPrice = detailBook["price"];
        const selectedItems = [{
            bookId: detailBook["id"],
            quantity: 1,
            price: detailBook["price"],
            name: detailBook["bookName"],
            image: detailBook["bookCoverImage"]
        }]
        navigation.navigate('SaleNow', {cartItems: selectedItems, totalPrice: totalPrice})
    }

    const navigation = useNavigation();

    React.useEffect(() => {
        createAPIEndpoint('get_book_by_id')
            .fetchById(bookId)
            .then(res => {
                setDetailBook(res.data[0]);
                console.log(res.data);
                setIsLoading(false);
            })

        createAPIEndpoint('get_best_favorite')
            .fetch()
            .then(res => {
                setBestSeller(res.data);
            })
    }, [])
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <View style={gStyle.container}>
            <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                right={<Feather color={colors.greyLight} name="more-horizontal" />}
            />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={gStyle.container}
            >
                <React.Fragment>
                    <View style={styles.productInfo}>
                        <View style={styles.imageSlideView}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={handleSlideChange}
                                scrollEventThrottle={16} // Add scrollEventThrottle prop
                            >
                                {detailBook["detailImages"].map((image, index) => (
                                    <View key={index} style={styles.slide}>
                                        <Image source={{ uri: image }} style={styles.image} />
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={styles.slideCount}>
                                <Text style={styles.slideCountText}>
                                    {activeSlide + 1}/{detailBook["detailImages"].length}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.flaskSale}>
                        <View style={styles.flaskOne}>
                            <Text style={styles.flaskSaleText}>Giảm giá {detailBook["discountPercentage"]}%</Text>
                            <View style={styles.daBanView}>
                                <Text style={styles.daBanText}>{detailBook["numberSold"]} đã bán</Text>
                            </View>
                        </View>
                        <Text style={styles.flaskSaleText}>Chỉ còn {detailBook["price"] * (detailBook["discountPercentage"] / 100)}đ</Text>
                    </View>
                    <View style={styles.prodictInfo}>
                        <Text style={styles.productName}>{detailBook["bookName"]}</Text>
                        <View style={styles.moreInfoView}>
                            <View style={styles.rateView}>
                                <View style={styles.rateStarView}>
                                    {detailBook["rate"] == 0 ? (
                                        <Text style={styles.rateText}>Chưa có đánh giá</Text>
                                    ) : (
                                        <View style={styles.rateStarView}>
                                            <Ionicons name="star" size={16} color="#a0a400" />
                                            <Ionicons name="star" size={16} color="#a0a400" />
                                            <Ionicons name="star" size={16} color="#a0a400" />
                                            <Ionicons name="star" size={16} color="#a0a400" />
                                            <Ionicons name="star" size={16} color="#a0a400" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.rateText}>{detailBook["rate"]}</Text>
                                <Text style={styles.rateText}>(100)</Text>
                                {/* Icon heart */}
                                <View style={styles.productIconView}>
                                    <Ionicons name="ios-heart-outline" size={20} color="black" />
                                    <Ionicons name="md-share-social-outline" size={20} color="black" />
                                </View>
                            </View>
                        </View>
                        <View style={styles.productDesView}>
                            <Text style={styles.label}>Mô tả sản phẩm</Text>
                            <Text style={styles.productDesText}>
                                {detailBook["description"]}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.moreProducts}>
                        <CateSmallLessonsHorizontal data={bestSeller} heading="Có thể bạn cũng thích" />
                    </View>
                    <View style={styles.moreProducts}>
                        <CateSmallLessonsHorizontal data={bestSeller} heading="Gợi ý thêm" />
                    </View>
                </React.Fragment></Animated.ScrollView>
            <View style={styles.cartFixView}>
                <View style={styles.cartFix}>
                    <View style={styles.ChatView}>
                        <Ionicons name="chatbox-ellipses-outline" size={20} color="white" />
                    </View>
                    <Pressable style={styles.cartView} onPress={() => handleAddBookToCart(detailBook["id"])}>
                        <Ionicons name="cart-outline" size={20} color="white" />
                    </Pressable>
                    <Pressable style={styles.MuaNgayView} onPress={() => handleNavigation()}>
                        <Text style={styles.MuaNgayText}>Mua ngay</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    searchPlaceholder: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 6,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingVertical: 16
    },
    containerFlatlist: {
        marginTop: 10
    },
    searchPlaceholderText: {
        ...gStyle.textGroup516,
        color: colors.blackBg
    },
    sectionHeading: {
        ...gStyle.textGroup5Bold18,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 16
    },
    productInfo: {
        flexDirection: 'row',
    },
    imageSlideView: {
        width: Dimensions.get('window').width,
        height: 300,
        justifyContent: 'center',
    },
    slide: {
        width: Dimensions.get('window').width,
        height: 300,
    },
    image: {
        alignSelf: 'center',
        width: 200,
        flex: 1,
        resizeMode: 'cover',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'black',
    },
    slideCount: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    slideCountText: {
        color: 'white',
        fontSize: 16,
    },
    prodictInfo: {
        marginLeft: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: colors.brandPrimary,
    },
    moreInfoView: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rateView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: 10,
    },
    rateStarView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rateText: {
        fontSize: 16,
        marginLeft: 5,
    },
    daBanView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flaskSale: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.brandPrimary,
    },
    flaskOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flaskSaleText: {
        fontSize: 16,
        color: colors.white,
    },
    daBanText: {
        fontSize: 16,
        color: colors.white,
    },
    moreProducts: {
        paddingTop: 10,
        marginTop: 10,
        backgroundColor: "#e4e4e4",
    },
    productIconView: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cartFixView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        backgroundColor: colors.white,
    },
    cartFix: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: colors.brandPrimary,
    },
    ChatView: {
        width: '20%',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.white,
    },
    cartView: {
        width: '20%',
        alignItems: 'center',
    },
    MuaNgayView: {
        width: '60%',
        alignItems: 'center',
        backgroundColor: "#cd4848",
        paddingVertical: 15,
    },
    MuaNgayText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
    },
});

export default DetailProduct;
