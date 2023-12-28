import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Pressable,
  Animated,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle, images } from '../../constants';

// components
import LinearGradient from '../../components/LinearGradient';
import TouchIcon from '../../components/TouchIcon';
import { createAPIEndpoint, BASE_URL } from '../../api'
// context
import Context from '../../context';
import axios from 'axios';

const CateLesson = ({ navigation }) => {
  const [user, setUser] = React.useState([]);
  const [fullName, setFullName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');

  // get main app state
  const { user_id } =
    React.useContext(Context);
  console.log(user_id)

  React.useEffect(() => {
    createAPIEndpoint('get_user_by_id')
      .fetchById(user_id)
      .then(res => {
        // setUser(res.data);
        setFullName(res.data.fullName);
        setAddress(res.data.address);
        setPhone(res.data.phone);
      })
      .catch(err => { console.log(err); })
  }, [])

  console.log(user);

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const stickyArray = device.web ? [] : [0];
  const headingRange = device.web ? [140, 200] : [230, 280];
  const shuffleRange = device.web ? [40, 80] : [40, 80];

  const opacityHeading = scrollY.interpolate({
    inputRange: headingRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const opacityShuffle = scrollY.interpolate({
    inputRange: shuffleRange,
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setMessage("Email không hợp lệ");
      setEmail(text)
      return false;
    }
    else {
      setEmail(text)
      setMessage('');
    }
  }

  const onUpdateUser = () => {
    if (phone == '' || fullName == '' || address == '') {
      setMessage('Vui lòng điền đầy đủ thông tin');
    } else {
      const user = {
        fullName: fullName,
        phone: phone,
        address: address,
        id: user_id
      };
      axios.post(BASE_URL + `update_user_id`, { user })
        .then(res => {
          setMessage('Cập nhật thông tin thành công');
        })
    }
  }
  return (

    <View style={gStyle.container}>
      <View style={styles.containerHeader}>
        <Animated.View
          style={[styles.headerLinear, { opacity: opacityHeading }]}
        >
        </Animated.View>
        <View style={styles.header}>
          <TouchIcon
            icon={<Feather name="chevron-left" />}
            onPress={() => navigation.goBack(null)}
          />
          <Animated.View style={{ opacity: opacityShuffle }}>
            <Text style={styles.headerTitle}>Cập nhật thông tin</Text>
          </Animated.View>
          <TouchIcon
            icon={<Feather name="more-horizontal" />}
            onPress={() => {
            }}
          />
        </View>
      </View>

      <View style={styles.containerFixed}>
        <View style={styles.flexHeader}>
          <View style={styles.ViewRight}>
            <Image source={images["logo"]} style={styles.image} />
          </View>
          <View style={styles.ViewLeft}>
            <View style={styles.containerTitle}>
              <Text style={styles.title}>
                Cập nhật thông tin
              </Text>
            </View>
            <View style={styles.containerCateLesson}>
              <Text style={styles.title_content}>{user['full_name']}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.containerSticky}>
        <Animated.View
          style={[styles.containerStickyLinear, { opacity: opacityShuffle }]}
        >
          <LinearGradient fill={colors.black20} height={50} />
        </Animated.View>

      </View>
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
        <View style={styles.containerLessons}>
          <View style={gStyle.flexRow}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.container}>

            <View style={gStyle.flex1}>
              <Text style={styles.title_content}>Tên người dùng</Text>
              <TextInput style={styles.input} defaultValue={fullName} onChangeText={(value) => setFullName(value)}></TextInput>
            </View>
          </View>
          <View style={styles.container}>
            <View style={gStyle.flex1}>
              <Text style={styles.title_content}>Địa chỉ</Text>
              <TextInput style={styles.input} defaultValue={address} onChangeText={(value) => setEmail(value)}></TextInput>
            </View>
          </View>
          <View style={styles.container}>
            <View style={gStyle.flex1}>
              <Text style={styles.title_content}>Số điện thoại</Text>
              <TextInput style={styles.input} defaultValue={phone} onChangeText={(value) => setPhone(value)}></TextInput>
            </View>
          </View>
          <View style={styles.container}>
            <Pressable style={styles.btn} onPress={() => onUpdateUser()}>
              <Text style={styles.btnText}>Update</Text>
            </Pressable>
          </View>
        </View>
      </Animated.ScrollView>
      <View style={gStyle.spacer16} />
    </View>
  );
};

CateLesson.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  blurview: {
    ...StyleSheet.absoluteFill,
    zIndex: 101
  },
  containerHeader: {
    // height: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  flexHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLinear: {
    height: 10,
    width: '100%'
  },
  ViewRight: {
    flex: 1,
  },
  ViewLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerTitle: {
    ...gStyle.textGroup5Bold16,
    marginTop: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: device.width - 100
  },
  containerFixed: {
    // alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 75 : 20,
    position: 'absolute',
    width: '100%',
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    zIndex: device.web ? 20 : 0
  },
  image: {
    height: 150,
    width: 150
  },
  containerTitle: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0
  },
  title: {
    ...gStyle.textGroup5Bold20,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center',
    color: colors.black70,
  },
  containerCateLesson: {
    zIndex: device.web ? 20 : 0
  },
  cateLessonInfo: {
    ...gStyle.textGroup512,
    color: colors.black70,
    // marginBottom: 48
  },
  containerScroll: {
    paddingTop: 10
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 210 : 150
  },
  containerStickyLinear: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  btn: {
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 15,
    height: 50,
    width: '100%',
  },
  btnText: {
    ...gStyle.textGroup5Bold16,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  containerLessons: {
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  downloadText: {
    ...gStyle.textGroup5Bold18,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 25,
    paddingLeft: 25,
    paddingTop: 10,
    width: '100%'
  },
  title_label: {
    ...gStyle.textGroup516,
    fontWeight: "bold",
  },
  title_content: {
    ...gStyle.textGroup516,
  },
  input: {
    width: "100%",
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
  },
  message: {
    color: "green",
  }
});

export default CateLesson;
