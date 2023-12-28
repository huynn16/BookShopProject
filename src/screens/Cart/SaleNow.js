import * as React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    Image,
    View,
    Pressable,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Context from '../../context';

import ModalHeader from '../../components/ModalHeader';
import { createAPIEndpoint } from '../../api';
import { Alert } from 'react-native';

const SaleNow = ({route}) => {
    const {cartItems, totalPrice} = route.params;
    const [user, setUser] = React.useState({});
    const { user_id } = React.useContext(Context);
    const [isLoading, setIsLoading] = React.useState(true);
    const [note, setNote] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('Thẻ ngân hàng');
    const [deliveryMethod, setDeliveryMethod] = React.useState('Giao hàng nhanh');
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const currentDate = new Date();

    const handlePayDone = () => {
        const order = {
            "user_id": user_id,
            "total_price": totalPrice,
            "date": currentDate.toLocaleDateString('en-GB'),
            "note": note,
            "payment_method": paymentMethod,
            "delivery_method": deliveryMethod,
            "status": "Chờ xác nhận",
            "order_details": cartItems
        }
        createAPIEndpoint('add_order')
            .post(order)
            .then((res) => {
                Alert.alert(
                    "Thông báo",
                    "Đặt hàng thành công",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('Home')
                        }
                    ]
                )
            }
        )
    };

    React.useEffect(() => {
        createAPIEndpoint('get_user_by_id')
            .fetchById(user_id)
            .then((res) => {
                setUser(res.data);
                setIsLoading(false);
            });
    }, []);
        
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.brandPrimary} />
            </View>
        );
    }
    return (
        <View style={gStyle.container}>
            <ModalHeader
                left={<Feather color={colors.brandPrimary} name="chevron-left" />}
                leftPress={() => navigation.goBack(null)}
                right={<Feather color={colors.brandPrimary} name="more-horizontal" />}
                text={"Thanh toán"}
            />
            <React.Fragment>
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
                    {/* <View style={gStyle.spacer1} /> */}
                    <View style={styles.contentFull}>
                        <View style={styles.userInfo}>
                            <View style={styles.headerUserInfo}>
                                <View style={styles.iconLeft}>
                                    <Feather color={colors.brandPrimary} size={20} name="map-pin" />
                                </View>
                                <View style={styles.textHeader}>
                                    <Text style={styles.textHeaderTitle}>Địa chỉ nhận hàng</Text>
                                </View>
                                <View style={styles.iconRight}>
                                    <Text style={styles.textEdit}>Chỉnh sửa</Text>
                                </View>
                            </View>
                            <View style={styles.bodyUserInfo}>
                                <View style={styles.bodyUserInfoLeft}>
                                    <Text style={styles.textBodyUserInfo}>{user["fullName"]}</Text>
                                    <Text style={styles.textBodyUserInfo}>{user["address"]}</Text>
                                    <Text style={styles.textBodyUserInfo}>{user["phone"]}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.productInfo}>
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.cartItem}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>Price: ${item.price}</Text>
                                        <View style={styles.quantityContainer}>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Pressable style={styles.deliveryMethod}>
                            <View style={styles.deliveryMethodHeader}>
                                <Ionicons style={{marginRight: 5}} color={colors.brandPrimary} size={20} name="car-sport-outline" />
                                <Text style={styles.deliveryMethodHeaderText}>Phương thức vận chuyển (Nhấn để chọn)</Text>
                            </View>
                            <View style={styles.deliveryMethodBody}>
                                <View style={styles.deliveryMethodBodyLeft}>
                                    <Text style={styles.deliveryMethodBodyText}>Nhanh</Text>
                                    <Text style={styles.deliveryMethodBodySmallText}>Nhận hàng vào 23 Th05-25 Th05</Text>
                                </View>
                                <View style={styles.deliveryMethodBodyRight}>
                                    <Text style={styles.deliveryMethodBodyText}>đ18.300</Text>
                                    <Feather color={colors.brandPrimary} size={20} name="chevron-right" />
                                </View>
                            </View>
                        </Pressable>
                        <View style={styles.note}>
                            <View style={styles.noteLabel}>
                                <Ionicons style={{marginRight: 5}} color={colors.brandPrimary} size={20} name="chatbox-ellipses-outline" />
                                <Text style={styles.noteLabelText}>Tin nhắn:</Text>
                            </View>
                            <View style={styles.noteInput}>
                                <TextInput
                                    style={styles.noteInputText}
                                    placeholder='Lưu ý cho người bán'
                                    placeholderTextColor={colors.greyInactive}
                                    multiline={true}
                                />
                            </View>
                        </View>
                        <View style={styles.payMethod}>
                                <View style={styles.payMethodiewLeft}>
                                    <Ionicons style={{marginRight: 5}} color={colors.brandPrimary} size={20} name="card-outline" />
                                    <Text>Phương thức thanh toán</Text>
                                </View>
                                <View style={styles.payMethodiewRight}>
                                    <Text style={styles.payMethodiewRightText}>Thay đổi</Text>
                                </View>
                        </View>
                        <View style={styles.totalPriceView}>
                            <View style={styles.totalPriceLabel}>
                                <Ionicons style={{marginRight: 5}} color={colors.brandPrimary} size={20} name="cash-outline" />
                                <Text style={styles.totalPriceLabelText}>Tổng thanh toán:</Text>
                            </View>
                            <View style={styles.totalPriceGiaView}>
                                <Text style={styles.totalPriceGiaText}>{totalPrice}đ</Text>
                            </View>
                        </View>
                    </View>
                </Animated.ScrollView>
            </React.Fragment>
            <View style={styles.cartFixView}>
                <View style={styles.cartFix}>
                    <View style={styles.cartView}>
                        <Text style={styles.cartText}>Tổng thanh toán {totalPrice}đ</Text>
                    </View>
                    <Pressable style={styles.MuaNgayView} onPress={() => handlePayDone()}>
                        <Text style={styles.MuaNgayText}>Đặt hàng</Text>
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
    contentFull: {
        backgroundColor: colors.white,
        marginBottom: 100,
    },  
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfo: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderBottomColor: colors.brandPrimary,
        borderBottomWidth: 3,
    },
    stripedBorder: {
        height: 2,
        width: '100%',
        // backgroundColor: 'transparent',
        backgroundColor: 'black',
        backgroundImage: 'linear-gradient(to right, white 50%, orange 50%)',
        backgroundPosition: 'top',
        backgroundSize: '8px 2px',
        backgroundRepeat: 'repeat-x',
    },
    headerUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5
    },
    iconLeft: {
        width: '10%',
        alignItems: 'center'
    },
    textHeader: {
        width: '70%',
    },
    iconRight: {
        width: '20%',
        alignItems: 'center'
    },
    textEdit: {
        color: colors.brandPrimary,
        fontSize: 14
    },
    bodyUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10%',
    },
    productInfo: {
        backgroundColor: "#f9f9f9",
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
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 14,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    cartView: {
        width: '60%',
        paddingLeft: 10,
    },
    MuaNgayView: {
        width: '40%',
        alignItems: 'center',  
        backgroundColor: "#cd4848",
        paddingVertical: 15,
    },
    MuaNgayText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
    },
    deliveryMethod: {
        backgroundColor: "#fff5e0",
        padding: 10,
        borderBottomColor: colors.brandPrimary,
        borderBottomWidth: 2,
        borderTopColor: colors.brandPrimary,
        borderTopWidth: 2,
    },
    deliveryMethodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomColor: colors.greyInactive,
        borderBottomWidth: 1,
    },
    deliveryMethodHeaderText: {
        color: colors.brandPrimary,
    },
    deliveryMethodBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    deliveryMethodBodyLeft: {
        width: '70%',
    },
    deliveryMethodBodyRight: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    deliveryMethodBodyText: {
    },
    deliveryMethodBodySmallText: {
        fontSize: 12,
        color: colors.greyInactive,
    },
    note: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: colors.greyInactive,
        borderBottomWidth: 1,
    },
    noteLabel: {
        width: '50%',
        flexDirection: 'row',
    },
    noteInput: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    noteInputText: {
    },
    totalPriceView: {
        flexDirection: 'row',
        padding: 10,
    },
    totalPriceLabel: {
        width: '50%',
        flexDirection: 'row',
    },
    totalPriceGiaView: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    payMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    payMethodiewLeft: {
        width: '50%',
        flexDirection: 'row',
    },
    payMethodiewRight: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    payMethodiewRightText: {
        color: colors.brandPrimary,
    },
});

export default SaleNow;
