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
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import OtherModalHeader from '../../components/OtherModalHeader';
import * as FileSystem from 'expo-file-system';
import { createAPIEndpoint, BASE_URL } from '../../api'
// context
import Context from '../../context';
import axios from 'axios';

const EditPostScreen = (route) => {
    const [bottomOffset, setBottomOffset] = React.useState(0);
    const [dataContent, setDataContent] = React.useState("");
    const [isPublic, setIsPublic] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const labelCate = route.route.params.labelCate;

    const { user_id } = React.useContext(Context);

    const navigation = useNavigation();

    const handleBlur = () => {
        setBottomOffset(0);
    };

    const handleFoucus = () => {
        setBottomOffset(320);
    };
    const uploadImageAsync = async (result) => {
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append('image', { uri: localUri, name: filename, type });
        console.log(formData);

        return await fetch(BASE_URL + "uploadImage", {
            method: 'POST',
            body: formData,
            headers: {
            'content-type': 'multipart/form-data',
            },
        });
    };

    const handleEnter = () => {
        var imageUri = image.uri.split('/').pop();
        uploadImageAsync(image);
        var dataPost = {
            content: dataContent,
            isPublic: isPublic,
            imageUrl: imageUri,
            labelCate: labelCate,
            user_id: user_id
        }
        axios.post(BASE_URL + `add_post`,  {dataPost} )
        .then(res => {
            console.log("OK");
            navigation.goBack(null);
        })
    };

    const handleChangePublic = () => {
        console.log(FileSystem.documentDirectory)
        setIsPublic(!isPublic);
    };

    const handleChangeCate = () => {
        navigation.navigate("ChangeCateScreen");
    };
    const handleUploadImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        // console.log(result);
        
        if (!result.canceled) {
            setImage(result);
        }
    };

    return (
        <View style={gStyle.container}>
            <View style={styles.containerHeader}>
            <OtherModalHeader
                left={<Feather color={colors.greyLight} name="x" />}
                leftPress={() => navigation.goBack(null)}
                right={
                    <View style={styles.btnEnter}>
                        <Text style={styles.textHeader}>Đăng</Text>
                    </View>
                }
                rightPress={() => handleEnter()}
                text={"Tạo review sách"}
            />
            </View>
            <React.Fragment>
                <Animated.ScrollView>
                    <View style={gStyle.spacer1}></View>
                    <View style={styles.headerInformation}>
                        <View style={styles.avt}></View>
                        <View style={styles.nameView}><Text style={styles.nameText}>Hoàng Đình Nhật</Text></View>   
                    </View>
                    <View>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        style={{ fontSize:20, height:100, textAlignVertical: 'top', paddingLeft: 10}}
                        placeholderStyle={{ fontSize: 130 }}
                        placeholder="Bạn đang nghĩ gì?"
                        placeholderTextColor={colors.greyLight}
                        onBlur={() => handleBlur()}
                        onFocus={() => handleFoucus()}
                        onChangeText={(text) => setDataContent(text)}
                        // set font size in placeholder
                    />
                    </View>
                    <View style={styles.imageContainer}>
                        {image && <Image source={{ uri: image.uri }} style={{ width: "100%", height: 300 }} />}
                    </View>
                </Animated.ScrollView>
                <View style={[styles.footer, {position: 'absolute', bottom: bottomOffset}]}>
                    <View>
                        <Ionicons name="images-outline" size="30" style={styles.iconFooter} onPress={() => handleUploadImage()}></Ionicons>
                    </View>
                    <View>
                        <Ionicons name={isPublic ? "lock-open-outline" : "lock-closed-outline"} size="30" style={styles.iconFooter} onPress={() => handleChangePublic()}></Ionicons>
                    </View>
                    <View>
                        {labelCate === "" ? 
                        <Ionicons name="folder-open-outline" size="30" style={styles.iconFooter} onPress={() => handleChangeCate()}></Ionicons>
                         : 
                         <Text style={styles.textCate} onPress={() => handleChangeCate()}>{labelCate}</Text>
                        }
                        
                    </View>
                </View>
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
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 16
    },
    headerInformation: {
        flexDirection: "row",
        padding: "2%",
        alignItems: "center",
    },
    btnEnter: {
        backgroundColor: colors.brandPrimary,
        borderRadius: 10,
        width: 60,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },  
    textHeader: {
        fontWeight: "bold"
    },  
    avt: {
        height: 50,
        width: 50,
        backgroundColor: colors.brandPrimary,
        borderRadius: 50,
        // marginLeft: 10,
    },
    nameText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: colors.brandPrimary,
        height: 85,
        borderRadius: 15,
        width: '100%',
    },
    textCate: {
        fontSize: 20,
        fontWeight: "bold"

    }

    

});
export default EditPostScreen;