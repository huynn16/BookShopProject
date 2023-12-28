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
import { Feather } from '@expo/vector-icons';
import Context from '../../context';

const HistoryOrder = () => {
    const [orders, setOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { user_id } = React.useContext(Context);
    React.useEffect(() => {
        createAPIEndpoint('get_all_history_orders')
            .fetchById(user_id)
            .then(res => {
                setOrders(res.data);
                console.log(res.data);
                setIsLoading(false);
                // console.log(res.data);
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
                    text={"Lịch sử mua hàng"}
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
                    <View style={styles.container}>
                        {orders.map((order) => {
                            return (
                                <View key={order.order_id} style={styles.cateView}>
                                    <View style={styles.cateTitle}>
                                        <Text style={styles.cateTitleText}>Mã đơn hàng: {order["order_id"]}</Text>
                                        <Text style={styles.cateTitleText}>Trạng thái: {order["status"]}</Text>
                                    </View>
                                    {order["order_details"].map((item) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={gStyle.activeOpacity}
                                                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                                // onPress={() => onPressJoinBook(item.id)}
                                                style={styles.item}
                                            >
                                                <View key={item.id} style={styles.cartItem}>
                                                    <Image source={{ uri: item.image }} style={styles.image} />
                                                    <View style={styles.itemDetails}>
                                                        <Text style={styles.itemName}>{item.name}</Text>
                                                    </View>
                                                    <View styles={styles.rightView}>
                                                        <Text style={styles.itemPrice}>{item.price}đ</Text>
                                                        <View style={styles.quantityContainer}>
                                                            <Text style={styles.quantityText}>x{item.quantity}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                    <View style={styles.cateTitle}>
                                        <Text style={styles.cateTitleText}>Ngày đặt hàng: {order["date"]}</Text>
                                        <Text style={styles.cateTitleText}>Tổng tiền: {order["total_price"]}đ</Text>
                                    </View>
                                </View>
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
        backgroundColor: colors.white,
        borderRadius: 6,
        marginBottom: 16,
        padding: 16,
        borderBottomColor: colors.greyLight,
        borderBottomWidth: 1,
    },
    cateTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cateTitleText: {
    },
    item: {
        marginBottom: 16,
    },

    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: 10,
        padding: 10,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    itemDetails: {
        color: colors.blackBg,
        flex: 1,
    },
    rightView: {
        alignItems: 'flex-end',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HistoryOrder;
