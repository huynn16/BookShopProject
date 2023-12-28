import React from 'react';
import { Animated, Image, StyleSheet, View, ScrollView, Linking, Text, Pressable } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { colors, device, gStyle, images } from '../constants';
import PropTypes from 'prop-types';
// components
import ScreenHeader from '../components/ScreenHeader';
import { createAPIEndpoint, BASE_URL } from '../api'
import TouchIcon from '../components/TouchIcon';
import ModalHeader from '../components/ModalHeader';
// context
import Context from '../context';

const ListBook = ({ navigation, route }) => {
    const { id } = route.params;
    console.log(id)
    const [datas, setDatas] = React.useState([]);
    const { showLessonBar, updateState } = React.useContext(Context);

    React.useEffect(() => {
        createAPIEndpoint('get_book_with_cateId')
            .fetchById(id)
            .then(res => {
                setDatas(res.data);
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

    const onPressJoinBook = (title) => {
        updateState('showLessonBar', !showLessonBar);
        const bookUser = {
            user_id: 1,
            book_title: title,
        };
        axios.post(BASE_URL + `add_book_with_user`,  {bookUser} )
            .then(res => {
                console.log(res.data.status);
            })
        navigation.navigate('CateLesson', { title: title })
    };
    return (
        <View style={gStyle.container}>
            <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                right={<Feather color={colors.greyLight} name="more-horizontal" />}
                text={"IELTS ACADEMY"}
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
                    {/* <View style={styles.pass}></View> */}
                    <ScrollView>
                        {
                            datas.map(data => {
                                const { image_url, title, author, released } = data;
                                return (
                                    <View style={styles.box}>
                                        <Pressable onPress={() => onPressJoinBook(title)}>
                                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                                <View style={{ flex: 1 / 3, margin: 10 }}>
                                                    <Image style={{ width: 110, height: 150 }} source={images[image_url]} />
                                                </View>
                                                <View style={{ justifyContent: 'space-around', flex: 2 / 3, margin: 10 }}>
                                                    <Text style={styles.title}>Tên sách: {title} </Text>
                                                    <Text style={styles.author}>Tác giả: {author}</Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                        <View style={{ flexDirection: 'row', padding: 5 }}>
                                            <View style={{ justifyContent: 'space-around', flex: 2 / 3, margin: 10 }}>
                                                <Text style={styles.date}>Ngày đăng: {released}</Text>
                                            </View>
                                            <View style={{ flex: 1 / 3, margin: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                    <TouchIcon
                                                        icon={<FontAwesome color={colors.white} name={"heart-o"} />}
                                                    />
                                                    <Pressable onPress={() => { Linking.openURL('https:facebook.com') }}>
                                                        <TouchIcon
                                                            icon={<FontAwesome color={colors.white} name={"share"} />}
                                                        />
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </ScrollView>
                </Animated.ScrollView>
            </React.Fragment>
        </View>

    )
}

const styles = StyleSheet.create({
    containerHeader: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 10
    },
    containerFlatlist: {
        marginTop: device.iPhoneNotch ? 88 : 64
    },
    box: {
        borderBottomColor: colors.greyLight,
        borderBottomWidth: 1,
        borderRadius: 5
    },
    pass: {
        marginTop: 88
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        height: 100
    },
    description: {
        color: "#cccccc",
        height: 15
    },
    date: {
        color: "#cccccc",
    },
    author: {
        color: "#cccccc",
    },
});

ListBook.defaultProps = {
    route: 1
};

ListBook.propTypes = {
    // required
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

export default ListBook;
