import * as React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    Pressable,
    Image,
    View
} from 'react-native';
import { createAPIEndpoint, BASE_URL } from '../api'
import { colors, device, gStyle, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import ModalHeader from '../components/ModalHeader';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const Mall = () => {
    const [cateBooks, setCateBooks] = React.useState([]);
    React.useEffect(() => {
        createAPIEndpoint('get_all_cate_book')
            .fetch()
            .then(res => {
                setCateBooks(res.data);
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

                        {cateBooks.map((item, index) => {
                            return (
                                <Pressable style={styles.itemCateView} onPress={() => navigation.navigate('ListProduct', {cateId: item.id})}>
                                    <View key={index} style={styles.imageView}>
                                        <Image style={styles.itemCateImage} source={images[item.image]}></Image>
                                    </View>
                                    <Text>{item.name}</Text>
                                </Pressable>
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
        marginTop: 16
    },
    itemCateView: {
        width: '40%',
        alignItems: 'center',
        margin: 16,
    },
    imageView: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.greyLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    itemCateImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
});

export default Mall;
