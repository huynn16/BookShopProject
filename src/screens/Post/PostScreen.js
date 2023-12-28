import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    TextInput,
    RefreshControl,
    Image
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

import ScreenHeader from '../../components/ScreenHeader';
import { Pressable } from 'react-native';
import Context from '../../context';

import { LinearGradient } from 'expo-linear-gradient';

import { createAPIEndpoint, BASE_URL } from '../../api'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const PostScreen = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = React.useState([]);
    const { user_id } = React.useContext(Context);
    const [isReLoading, setIsReloading] = React.useState(false);
    const [bookCate, setBookCate] = React.useState([]);

    React.useEffect(() => {
        createAPIEndpoint('get_all_post')
            .fetch()
            .then(res => {
                setData(res.data);
            })
        createAPIEndpoint('get_all_cate_book')
            .fetch()
            .then(res => {
                setBookCate(res.data);
                console.log("BookCate: ", res.data);
            })
    }, [isReLoading])
    // React.useEffect(() => {
    //     setData(data);
    // }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setIsReloading(!isReLoading);
        wait(2000).then(() => {
            createAPIEndpoint('get_all_post')
                .fetch()
                .then(res => {
                    setData(res.data);
                })
            setRefreshing(false)
        });
    }, []);

    const [textShown, setTextShow] = React.useState(-1);

    const [isLikes, setIsLikes] = React.useState([]);

    const navigation = useNavigation();

    const toggleNumberofLines = (index) => {
        setTextShow(textShown === index ? -1 : index);
    };

    const handleEditPost = () => {
        var labelCate = "";
        navigation.navigate("EditPostScreen", { labelCate })
    };

    const handleLike = (index) => {
        setIsReloading(!isReLoading);
        if (!isLikes.includes(index)) {
            setIsLikes([...isLikes, index]);
            createAPIEndpoint('update_like/')
                .put(index, { 'datalike': { 'user_id': user_id } })
                .then(res => {
                    console.log(res.data);
                })

        } else {
            setIsLikes(isLikes.filter((item) => item !== index));

        }
    };

    const handleSave = (index) => {
        console.log("Save: ", index);
    };

    const changeDataPost = (label) => {
        createAPIEndpoint('get_post_with_cate')
            .fetchById(label)
            .then(res => {
                setData(res.data);
            })
    };
    return (
        <View style={gStyle.container}>
            <View style={styles.containerHeader}>
                <ScreenHeader title="Review sách" />
            </View>
            <React.Fragment>
                <Animated.ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {refreshing ? <View style={styles.loading}><Text>{refreshing ? "Loading ..." : ""}</Text></View> : null}
                    <View style={styles.headerInput}>
                        <View style={styles.avt}></View>
                        <TextInput onFocus={() => handleEditPost()} style={styles.input} placeholder="What's on your mind?"></TextInput>
                    </View>
                    <View style={styles.storyView}>

                        <Animated.ScrollView horizontal={true}>
                            {bookCate.map((item) => (
                                <Pressable style={styles.cateBookItem} onPress={() => changeDataPost(item.image)}>
                                    <View style={styles.story}>
                                        <Image style={styles.imageBook} source={images[item.image]}></Image>
                                    </View>
                                    <Text style={styles.itemCateText}>{item.name}</Text>
                                </Pressable>
                            ))}
                        </Animated.ScrollView>
                    </View>
                    {
                        data.map((item) => (
                            <View style={styles.contentView} key={item.post_id}>
                                <View style={styles.headerAvt}>
                                    <View style={styles.avt}></View>
                                    <View style={styles.headerRight}>
                                        <Text style={styles.nameText}>{item.userName}</Text>
                                        <View style={styles.timeView}>
                                            <Text style={styles.timeText}>1m . </Text>
                                            <Ionicons name={"earth-outline"} size={15} color={colors.white} style={styles.iconGlobal}></Ionicons>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.content}>
                                    <Text
                                        numberOfLines={textShown === item.post_id ? undefined : 3}
                                        style={styles.contentText}>
                                        {item.content}
                                    </Text>
                                    <Text
                                        onPress={() => toggleNumberofLines(item.post_id)}
                                        style={{ color: colors.greyLight }}>
                                        {textShown === item.post_id ? 'Read less...' : 'Read more'}
                                    </Text>
                                </View>
                                <View style={styles.imageView}>
                                    <Image source={{ uri: BASE_URL + "get_image/" + item.imageUrl }} style={styles.imagePost} />
                                </View>
                                <View style={styles.likeView}>
                                    <Pressable style={styles.iconEmotion} onPress={() => handleLike(item.post_id)}>
                                        <Ionicons name={isLikes.includes(item.post_id) ? "heart-sharp" : "heart-outline"} size={23} color={colors.greyLight}></Ionicons>
                                        <Text style={{ color: colors.greyLight, marginLeft: 5 }}>Like</Text>
                                    </Pressable>
                                    <Pressable style={styles.iconEmotion} onPress={() => handleSave(item.post_id)}>
                                        <Ionicons name={"arrow-redo-outline"} size={23} color={colors.greyLight}></Ionicons>
                                        <Text style={{ color: colors.greyLight, marginLeft: 5 }}>Save</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.lineBottom}>
                                    <Text style={{ color: colors.greyLight }}>{item.post_like.length} likes, {item.post_save.length} saves</Text>
                                </View>
                                <View style={styles.commentView}>
                                    {item.post_comment.map((itemComment) => (
                                        <View style={styles.comment} key={itemComment.name}>
                                            <View style={styles.avtComment}></View>
                                            <View style={styles.commentRight}>
                                                <View style={styles.commentRightTop}>
                                                    <Text style={styles.nameText}>{itemComment.name}</Text>
                                                    <Text style={styles.contentText}>{itemComment.comment}</Text>
                                                </View>
                                                <View style={styles.commentRightBottom}>
                                                    <Text style={{ color: colors.greyLight, marginRight: 15 }}>1h</Text>
                                                    <Text>Like</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}

                </Animated.ScrollView>
            </React.Fragment>
        </View>
    );
};

const styles = StyleSheet.create({
    searchPlaceholder: {
        alignItems: 'center',
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
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 16
    },
    headerInput: {
        flexDirection: "row",
        width: '100%',
        padding: "2%",
        alignItems: "center",
        height: 70,
    },
    loading: {
        width: "100%",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
    },
    avt: {
        width: "14%",
        height: 50,
        backgroundColor: colors.brandPrimary,
        borderRadius: 50,
        marginLeft: 10,
    },
    input: {
        width: '70%',
        padding: 10,
        height: 50,
    },
    search: {
        width: "14%",
        // height: 0,
        paddingTop: 10
    },
    iconImageUpload: {
        width: "100%",
        height: 50,
    },
    storyView: {
        marginTop: 5,
        width: "100%",
        // height: 150,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    itemCateText: {
        textAlign: "center",
    },
    story: {
        width: 52,
        height: 52,
        borderRadius: 50,
        backgroundColor: colors.greyLight,
        borderColor: "green",
        borderWidth: 2,
        marginRight: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBook: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    contentView: {
        marginTop: 5,
        width: "100%",
        padding: 10,
    },
    cateBookItem: {
        justifyContent: "center",
        alignItems: "center",
        width: 75
    },
    headerAvt: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        alignItems: "center",
    },
    headerRight: {
        marginLeft: 10,
    },
    timeView: {
        flexDirection: "row",
    },
    nameText: {
        color: colors.black,
        fontSize: 15,
        fontWeight: "bold",
    },
    timeText: {
        color: colors.black,
        fontSize: 12,

    },
    iconGlobal: {
        marginLeft: 5,
    },
    content: {
        marginTop: 10,
    },
    contentText: {
        color: colors.black,
        fontSize: 15,
    },
    imageView: {
        width: "100%",
        height: 300,
    },
    imagePost: {
        width: "100%",
        height: "100%",
    },
    likeView: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: "space-around",
        // borderBottomColor: colors.greyLight,
        // borderBottomWidth: 1,
    },
    iconEmotion: {
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    lineBottom: {
        borderBottomColor: colors.greyLight,
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingLeft: 5,
    },
    commentView: {
        marginTop: 10,
    },
    comment: {
        flexDirection: "row",
        marginTop: 10,
    },
    avtComment: {
        width: 40,
        height: 40,
        backgroundColor: "red",
        borderRadius: 50,
        marginRight: 10,
    },
    commentRight: {
        width: "80%",
    },
    commentRightTop: {
        borderRadius: 10,
        padding: 8,
        backgroundColor: colors.greySwitchBorder,
    },
    commentRightBottom: {
        flexDirection: "row",
        marginTop: 5
    }

});
export default PostScreen;