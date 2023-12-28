import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

import ModalHeader from '../../components/ModalHeader';
import { createAPIEndpoint, BASE_URL } from '../../api'
import Context from '../../context';
import { Pressable } from 'react-native';

const CartView = () => {
    const { user_id } = React.useContext(Context);
    console.log(user_id);
    const [cartItems, setCartItems] = React.useState([
    ]);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const scrollY = React.useRef(new Animated.Value(0)).current;

    // search start (24 horizontal padding )
    const searchStart = device.width - 48;
    const searchEnd = device.width - 88;

    const opacity = scrollY.interpolate({
        inputRange: [0, 48],
        outputRange: [searchStart, searchEnd],
        extrapolate: 'clamp'
    });

    const toggleSelection = (itemId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, selected: !item.selected };
                }
                return item;
            })
        );
    };

    const increaseQuantity = (itemId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    };

    const decreaseQuantity = (itemId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            })
        );
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => (item.selected ? total + item.price * item.quantity : total), 0);
    };

    const navigation = useNavigation();

    const handleNavigation = () => {
        const totalPrice = calculateTotalPrice();
        const selectedItems = cartItems.filter((item) => item.selected);
        navigation.navigate('SaleNow', {cartItems: selectedItems, totalPrice: totalPrice})
    }

    const handleDeleteOrder = (itemId) => {
        createAPIEndpoint('delete_book_in_cart')
            .delete(itemId)
            .then(res => {
                console.log(res.data);
                setCartItems((prevItems) =>
                    prevItems.filter((item) => item.id !== itemId)
                );
            })
    };

    React.useEffect(() => {
        createAPIEndpoint('get_cart_by_id')
            .fetchById(user_id)
            .then(res => {
                setCartItems(res.data);
                setIsLoading(false);
            })
    }, [])

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
                text="Giỏ hàng"
            />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={styles.container}
            >
                {cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => toggleSelection(item.id)}
                        >
                            {item.selected ? <Text style={styles.checkboxText}>✓</Text> : null}
                        </TouchableOpacity>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.itemDetails}>
                            <Pressable style={styles.deleteView} onPress={() => handleDeleteOrder(item.id)}>
                                <Text style={styles.deleteText}>Xoá</Text>
                            </Pressable>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => decreaseQuantity(item.id)}
                                >
                                    <Text>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => increaseQuantity(item.id)}
                                >
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </Animated.ScrollView>
            <View style={styles.cartFixView}>
                <View style={styles.cartFix}>
                    <View style={styles.cartView}>
                        <Text style={styles.cartText}>Tổng thanh toán ${calculateTotalPrice()}đ</Text>
                    </View>
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
    container: {
        backgroundColor: "#e4e4e4",
        marginBottom: 70
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: 'white',
        padding: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    deleteView: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    deleteText: {
        fontSize: 16,
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
    quantityButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 4,
        padding: 4,
        marginHorizontal: 8,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
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
});

export default CartView;
