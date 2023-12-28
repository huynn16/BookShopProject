import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';


import ModalHeader from '../../components/ModalHeader';


import Context from '../../context';


// mock data
import speakings from '../../mockdata/speakings';


const LearnSpeaking = () => {
    const [titles, setTitles] = React.useState([]);
    const [query, setQuery] = React.useState('');
    const [filterTopic, setFilterTopic] = React.useState([]);
    const [isSearch, setIsSearch] = React.useState(false);
    const fullSpeakings = speakings["fullSpeaking"];
    const datas = Object.keys(fullSpeakings).reverse();
    // console.log()
    // setFilterTopic(data);
    // console.log(titles);
    // setFilterTopic(titles);


    const scrollY = React.useRef(new Animated.Value(0)).current;


    React.useEffect(() => {
        setTitles(datas);
        setFilterTopic(datas);
        setIsSearch(true);
    },[]);


    React.useEffect(() => {
        const filterPosts = titles.filter((title) => {
            return title.toLowerCase().includes(query.toLowerCase());
        })
        setIsSearch(true);
        console.log(isSearch);
        setFilterTopic(filterPosts);

    }, [query]);


    // search start (24 horizontal padding )
    const searchStart = device.width - 48;
    const searchEnd = device.width - 88;


    const opacity = scrollY.interpolate({
        inputRange: [0, 48],
        outputRange: [searchStart, searchEnd],
        extrapolate: 'clamp'
    });


    const navigation = useNavigation();
    const { topicSpeakingCurrent, updateState } = React.useContext(Context);


    const moveToTopic = (title) => {
        if (!topicSpeakingCurrent.includes(title)) {
            var newTopicSpeakingCurrent = topicSpeakingCurrent.push(title)
            updateState({ "topicSpeakingCurrent": newTopicSpeakingCurrent} );
        }
        console.log(title);
        navigation.navigate('TopicSpeaking', { title })
    };


    return (
        <View style={gStyle.container}>
            <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                right={<Feather color={colors.greyLight} name="more-horizontal" />}
                text={"Speaking Topics"}
            />
            <View style={styles.searchView}>
                <TextInput style={styles.input} placeholder="Search" placeholderTextColor="#FFF" onChangeText={(text) => setQuery(text)}></TextInput>
            </View>
            <React.Fragment>
                <Animated.ScrollView>
                    <View style={styles.containerVocab}>
                        <View style={gStyle.spacer1} />
                        { filterTopic.map(title => {
                            if (!topicSpeakingCurrent.includes(title)) {
                                return (
                                    <Pressable key={title} style={styles.vocabViewCurrent} onPress={() => moveToTopic(title)}>
                                        <View>
                                            <Text style={styles.textLarge}>{title} topic</Text>
                                            <Text style={styles.textSmall}>Create date: {fullSpeakings[title]["date"]}</Text>
                                        </View>
                                    </Pressable>
                                )
                            }
                            return (
                                <Pressable key={title} style={styles.vocabView} onPress={() => moveToTopic(title)}>
                                    <View>
                                        <Text style={styles.textLarge}>{title} topic</Text>
                                        <Text style={styles.textSmall}>Create date: {fullSpeakings[title]["date"]}</Text>
                                    </View>
                                </Pressable>
                            )
                        })}
                    </View>
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
        color: colors.white,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 16
    },
    searchView: {
        paddingLeft: 20
    },
    input: {
        width: "90%",
        borderRadius: 40,
        borderColor: "white",
        color: "white",
        borderWidth: 1,
        marginTop: 10,
        padding: 12,
    },
    containerVocab: {
        padding: 20
    },
    footer: {
        height: 50,
        width: '90%',
        position: 'absolute',
        bottom: 70,
        backgroundColor: 'green',
        left: "5%",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'


    },
    vocabViewCurrent: {
        width: '100%',
        backgroundColor: colors.blackBlur,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.white,
        padding: 30,
        paddingLeft: 20,
        marginBottom: 20
    },
    vocabView: {
        width: '100%',
        backgroundColor: colors.greyOff,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.white,
        padding: 30,
        paddingLeft: 20,
        marginBottom: 20
    },
    textLarge: {
        fontSize: 20,
        color: colors.white,
    },
    textSmall: {
        fontSize: 15,
        marginTop: 10,
        color: colors.greyLight,


    },
});


export default LearnSpeaking;