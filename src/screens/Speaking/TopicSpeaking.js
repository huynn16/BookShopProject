import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Button,
    Pressable
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing'


import * as Speech from 'expo-speech';
// import Voice from '@react-native-voice/voice';
import {
    Collapse,
    CollapseHeader,
    CollapseBody,
} from 'accordion-collapse-react-native';


import ModalHeader from '../../components/ModalHeader';
// mock data
import speakings from '../../mockdata/speakings';


// import Voice from '@react-native-voice/voice';


const TopicSpeaking = ({ route }) => {
    // Refs for the audio
    const AudioRecorder = React.useRef(new Audio.Recording());
    const AudioPlayer = React.useRef(new Audio.Sound());


    // States for UI
    const [RecordedURI, SetRecordedURI] = React.useState("");
    const [AudioPermission, SetAudioPermission] = React.useState(false);
    const [IsRecording, SetIsRecording] = React.useState(false);
    const [IsPLaying, SetIsPLaying] = React.useState(false);
    const { title } = route.params;




    const topicContent = speakings["fullSpeaking"][title];


    const scripts = topicContent["script"];
    let currIndex = Object.keys(speakings["fullSpeaking"]).indexOf(title);
    let nextItem = Object.keys(speakings["fullSpeaking"])[currIndex - 1];
    let prevItem = Object.keys(speakings["fullSpeaking"])[currIndex + 1];
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


    const handleAudio = async (vocab) => {
        // console.log('Loading Sound');
        // const { sound } = await Audio.Sound.createAsync(audios[vocab]);
        // // setSound(sound);
        // console.log('Playing Sound');
        // await sound.playAsync();
        Speech.speak(vocab, { language: 'en' });
    };


    const topicAudio = scripts.map(value => value.question).sort(() => .5 - Math.random());


    const randomAudio = async () => {
        var name;
        console.log(topicAudio.length)
        if (topicAudio.length === 0) {
            name = "next Topic";
            handleAudio(name);
            navigation.navigate('TopicSpeaking', { title: nextItem });
        } else {
            name = topicAudio.pop();
            handleAudio(name);
        }
    }




    React.useEffect(() => {
        // Location.requestForegroundPermissionsAsync();
        GetPermission();
        // Permissions.askAsync(Permissions.AUDIO_RECORDING);
    }, []);


    // Function to get the audio permission
    const GetPermission = async () => {
        const getAudioPerm = await Audio.requestPermissionsAsync();
        SetAudioPermission(getAudioPerm.granted);
    };




    // Function to start recording
    const StartRecording = async () => {
        try {
            // Check if user has given the permission to record
            if (AudioPermission === true) {
                try {
                    console.log('Requesting permissions..');
                    await Audio.setAudioModeAsync({
                        allowsRecordingIOS: true,
                        playsInSilentModeIOS: true,
                    });
                    // Prepare the Audio Recorder
                    await AudioRecorder.current.prepareToRecordAsync(
                        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                    );


                    // Start recording
                    await AudioRecorder.current.startAsync();
                    SetIsRecording(true);
                    console.log('Recording started');
                } catch (error) {
                    console.log(error);
                }
            } else {
                // If user has not given the permission to record, then ask for permission
                GetPermission();
            }
        } catch (error) { }
    };


    // Function to stop recording
    const StopRecording = async () => {
        try {
            // Stop recording
            console.log('Stopping recording..');
            SetIsRecording(false);
            await AudioRecorder.current.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            // Get the recorded URI here
            const result = AudioRecorder.current.getURI();


            if (result) SetRecordedURI(result);
            // Reset the Audio Recorder
            AudioRecorder.current = new Audio.Recording();


        } catch (error) { }
    };


    // Function to play the recorded audio
    const PlayRecordedAudio = async () => {
        try {
            // Load the Recorded URI
            await AudioPlayer.current.loadAsync({ uri: RecordedURI }, {}, true);


            // Get Player Status
            const playerStatus = await AudioPlayer.current.getStatusAsync();


            // Play if song is loaded successfully
            if (playerStatus.isLoaded) {
                if (playerStatus.isPlaying === false) {
                    console.log("Playing");
                    await AudioPlayer.current.playAsync();
                    // AudioPlayer.current.playAsync();
                    SetIsPLaying(true);
                }
            }


        } catch (error) { }
    };


    // Function to stop the playing audio
    const StopPlaying = async () => {
        try {
            //Get Player Status
            const playerStatus = await AudioPlayer.current.getStatusAsync();


            // If song is playing then stop it
            if (playerStatus.isLoaded === true)
                await AudioPlayer.current.unloadAsync();


            SetIsPLaying(false);
        } catch (error) { }
    };


    const handleShare = () => {
        Sharing.shareAsync(RecordedURI);
    };


    const moveToTopic = (topic) => {
        var title = Object.values(topic)[0];
        if (title !== undefined){
            navigation.navigate('TopicSpeaking', { title });
        }
        console.log(title);
    };




    return (
        <View style={gStyle.container}>
            <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                right={<Feather color={colors.greyLight} name="more-horizontal" />}
                text={title + " topic"}
            />
            <React.Fragment>
                <Animated.ScrollView>
                    {/* <View style={gStyle.spacer4} /> */}
                    <View style={styles.containerVocab}>
                        {scripts.map(item => {
                            return (
                                <Collapse key={item.question}>
                                    <CollapseHeader>
                                        <View style={styles.question} >
                                            <Text style={styles.textQuestion}>Question: {item.question}</Text>
                                            <View style={styles.icon}>
                                                <Ionicons
                                                    name="volume-high-outline"
                                                    size={40}
                                                    color="#4F8EF7"
                                                    style={styles.flexCenter}
                                                    onPress={() => { handleAudio(item.question) }}
                                                />
                                            </View>
                                        </View>
                                    </CollapseHeader>
                                    <CollapseBody>
                                        <View style={styles.answer}>
                                            <View style={styles.iconSmall}>
                                                <Ionicons
                                                    name="volume-high-outline"
                                                    size={30}
                                                    color="black"
                                                    style={styles.flexCenter}
                                                    onPress={() => { handleAudio(item.answer) }}
                                                />
                                            </View>
                                            <Text style={styles.textAnswer}>{item.answer}</Text>
                                        </View>
                                    </CollapseBody>
                                </Collapse>
                            )
                        })}
                    </View>
                </Animated.ScrollView>
            </React.Fragment>
            <View style={styles.footerComponent}>
                <Pressable style={styles.footer} onPress={() => randomAudio()}>
                    <Text style={styles.textLarge}>Random Question</Text>
                </Pressable>
            </View>
            <View style={styles.voiceComopent}>
                <View style={styles.iconStyle}>
                    <Ionicons
                        name={IsRecording ? "md-mic-off-outline" : "md-mic-outline"}
                        size={35}
                        color={IsRecording ? "red" : "#4F8EF7"}

                        onPress={() => { IsRecording ? StopRecording() : StartRecording() }}
                    />
                </View>
                <View style={styles.iconStyle}>
                    <Ionicons
                        name={IsPLaying ? "ios-volume-mute-outline" : "ios-volume-high-outline"}
                        size={35}
                        color={IsPLaying ? "red" : "#4F8EF7"}
                        onPress={() => { IsPLaying  ? StopPlaying() : PlayRecordedAudio() }}
                    />
                </View>
                <View style={styles.iconStyle}>
                    <Ionicons
                        name={"md-share-outline"}
                        size={35}
                        color={"#4F8EF7"}
                        onPress={() => { handleShare() }}
                    />
                </View>
            </View>
            <View style={styles.header}>
                <View style={styles.iconStyle}>
                    <Ionicons
                        name={"arrow-back-outline"}
                        size={35}
                        color={"#4F8EF7"}
                        onPress={() => { moveToTopic({prevItem}) }}
                    />
                </View>
                <View style={styles.iconStyle}>
                    <Ionicons
                        name={"arrow-forward-outline"}
                        size={35}
                        color={"#4F8EF7"}
                        onPress={() => { moveToTopic({nextItem}) }}
                    />
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
    containerVocab: {
        padding: 20,
        marginTop: 20
    },
    header: {
        position: 'absolute',
        left: 20,
        bottom: 40,
    },
    voiceComopent: {
        position: 'absolute',
        right: 20,
        bottom: 40,
    },
    iconStyle: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 50/2,
        paddingLeft: 3,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',


    },
    footerComponent: {
        position: 'absolute',
        width: '90%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
        left: '6%'
    },
    footer: {
        height: 50,
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    icon: {
        alignItems: 'center',
    },
    iconSmall: {
        width: 50,
    },
    question: {
        width: '100%',
        backgroundColor: colors.greyOff,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.white,
        padding: 10,
        paddingLeft: 20,
        marginBottom: 8
    },
    answer: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.white,
        padding: 10,
        paddingLeft: 20,
        marginBottom: 32
    },
    textAnswer: {
        fontSize: 14,
        color: colors.greyDark,
    },
    textQuestion: {
        fontSize: 17,
        color: colors.white,
        fontWeight: 'bold'
    },
    textLarge: {
        fontSize: 20,
        color: colors.white,
    },
});


export default TopicSpeaking;