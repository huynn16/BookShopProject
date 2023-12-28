import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable,
    Image
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { createAPIEndpoint, BASE_URL } from '../../api'

import ModalHeader from '../../components/ModalHeader';
  
const ChangeCateScreen = () => {

    const [cateBooks, setCateBooks] = React.useState([]);
    React.useEffect(() => {
        createAPIEndpoint('get_all_cate_book')
            .fetch()
            .then(res => {
                setCateBooks(res.data);
            })
    }, [])

    const navigation = useNavigation();
    const handleOk = (labelCate) => {
        navigation.navigate("EditPostScreen", { labelCate })
    };
    return (
        <View style={gStyle.container}>
            <View style={styles.containerHeader}>
            <ModalHeader
                left={<Feather color={colors.greyLight} name="x" />}
                leftPress={() => navigation.goBack(null)}
                text={"Chọn thể loại bài review"}
            />
            </View>
            <React.Fragment>
                <Animated.ScrollView>
                    <View style={gStyle.spacer1}></View>
                    {cateBooks.map((item, index) => {
                        return (
                            <Pressable key={index} style={styles.btnOk} onPress={() => handleOk(item.image)}><Text>{item.name}</Text></Pressable>
                        )
                    })}
                    {/* <Pressable style={styles.btnOk} onPress={() => handleOk("IELTS")}><Text>IELTS</Text></Pressable>
                    <Pressable style={styles.btnOk} onPress={() => handleOk("TOEIC")}><Text>TOEIC</Text></Pressable>
                    <Pressable style={styles.btnOk} onPress={() => handleOk("THPTQG")}><Text>THPTQG</Text></Pressable> */}
                </Animated.ScrollView>
                
            </React.Fragment>
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
        color: colors.black,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 16
    },
    headerInformation: {
        flexDirection: "row",
        padding: "2%",
        alignItems: "center",
    },
    btnOk: {
        width: "90%",
        height: 50,
        backgroundColor: "#f2f2f2",
        borderRadius: 6,
        padding: 10,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
    }
});
export default ChangeCateScreen;