import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import { colors, device, gStyle, images } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// context
import Context from '../../context';
import { createAPIEndpoint, BASE_URL } from '../../api'

const ModalLogIn = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(null);
  const [message, setMessage] = React.useState(null);

   // get main app state
  const { updateState } = React.useContext(Context);
   
  
  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setError("Email không hợp lệ");
      setEmail(text)
      return false;
    }
    else {
      setEmail(text)
      setError('');
    }
  }

  const navigation = useNavigation();
  
  const onProcessLogIn = () => {
    const user = {
      username: email,
      password: password,
    };
    createAPIEndpoint('login')
        .post(user)
        .then(res => {
            setMessage(res.data.message);
            if (res.status == 200) {
              navigation.navigate('Home');
            }
        })
        .catch(err => console.log(err))
  }
  // search start (24 horizontal padding )
  const searchStart = device.width - 48;
  const searchEnd = device.width - 88;

  const opacity = scrollY.interpolate({
    inputRange: [0, 48],
    outputRange: [searchStart, searchEnd],
    extrapolate: 'clamp'
  });

  return (
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
        <View style={gStyle.spacer11} />
        <View style={styles.containerSearchBar}>
        </View>

        <Text style={styles.sectionHeading}>Đăng nhập</Text>
        <View style={styles.containerRow}>
          <Image source={images['logo']} style={styles.image} />
          <TextInput name="email" style={styles.input} placeholder="Email"onChangeText={(text) => validateEmail(text)} value={email}></TextInput>
          <Text style={styles.error}>{error}</Text> 
          <TextInput secureTextEntry={true} name="password" style={styles.input} placeholder="Password"value={password} onChangeText={(value) => setPassword(value)}></TextInput>
          <Text style={styles.message}>{message}</Text> 
          <View>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </View>
          <View style={styles.loginButton}>
            <Pressable style={styles.loginText} onPress={() => onProcessLogIn()}>
              <Text style={styles.textLogin}>LOGIN</Text>
            </Pressable>
          </View>
          <View style={styles.footer}>
              <Text style={styles.textNotAcc}>Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate('ModalSignUp')}>
                <Text style={styles.signUpText}>Sign up</Text>
              </Pressable>
          </View>
        </View>
      </Animated.ScrollView>

    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  searchPlaceholder: {
    alignItems: 'center',
    // backgroundColor: colors.white,
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
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  containerColumn: {
    width: '50%'
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 35
  },
  input: {
    width: "80%",
    height: 50,
    borderRadius: 5,
    // borderColor: "white",
    color: colors.black,
    borderWidth: 1,
    padding: 12,
    marginTop: 15,
    marginRight: '10%',
    marginLeft: '10%'
  },
  textLogin: {
    color: colors.white,
    fontWeight: "600"
  },
  forgotText: {
    marginTop: 10,
    marginLeft: 160,
    // color: colors.white,
  },
  loginButton: {
      backgroundColor: colors.brandPrimary,
      height: 50,
      width: '80%',
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7,
  },
  loginText: {
      // color: colors.white,
      fontWeight: "600"
  },
  footer: {
      marginTop: 10,
      flexDirection: 'row',
  },
  textNotAcc: {
      // color: colors.white,
      marginRight: 5
  },
  signUpText: {
      color: colors.brandPrimary,
      fontWeight: "600",
  },
  error: {
    color: 'red',
    marginTop: 10
  },
  message: {
    color: 'red',
    marginTop: 10
  }
});

export default ModalLogIn;
