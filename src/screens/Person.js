import * as React from 'react';
import { FlatList, StyleSheet, View, Linking, Text, ActivityIndicator, Image } from 'react-native';
import { colors, device, gStyle, images } from '../constants';
// components
import LineItemCategory from '../components/LineItemCategory';
import ScreenHeader from '../components/ScreenHeader';

// mock data
import yourPerson from '../mockdata/menuYourPerson.json';

import { useNavigation } from '@react-navigation/native';
// context
import Context from '../context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createAPIEndpoint, BASE_URL } from '../api'

const Person = () => {
  const navigation = useNavigation();
  // get main app state
  const [user, setUser] = React.useState({});
  const { user_id } = React.useContext(Context);
  const [isLoading, setIsLoading] = React.useState(true);
  const handleShowOrder = (status) => () => {
    navigation.navigate("StatusOrder", {statusOrder: status});
  }
  React.useEffect(() => {
      createAPIEndpoint('get_user_by_id')
          .fetchById(user_id)
          .then((res) => {
              setUser(res.data);
              setIsLoading(false);
          });
  }, []);
  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
    );
}
  return (
    <View style={gStyle.container}>
      <View style={styles.containerHeader}>
        <ScreenHeader title="Group5 Ielts" />
      </View>
      <View style={styles.fullHeader}>
      <View style={styles.header}>
        <View style={styles.avt}>
          <Text style={styles.headerText}>{user["fullName"].split(" ").pop()[0]}</Text>
        </View>
        {/* <Image style={styles.avt} source={images["avt"]} /> */}
        <View style={styles.info}>
          <Text style={styles.headerTextLarge}>{user["fullName"]}</Text>
          <Text style={styles.headerSmall}>{user["role"]}</Text>
        </View>
      </View>
      <View style={gStyle.flexRow} horizontal>
        <View style={styles.boxs}>
          <Ionicons name="md-receipt-outline" size={25} color={colors.brandPrimary} onPress={handleShowOrder("Chờ xác nhận")} />
          <Text style={styles.textSmall}>Chờ xác nhận</Text>
        </View>
        <View style={styles.boxs}>
          <Ionicons name="md-file-tray-full" size={25} color={colors.brandPrimary} onPress={handleShowOrder("Chờ lấy hàng")}/>
          <Text style={styles.textSmall}>Chờ lấy hàng</Text>
        </View>
        <View style={styles.boxs}>
          <Ionicons name="md-car-outline" size={25} color={colors.brandPrimary} onPress={handleShowOrder("Đang giao")}/>
          <Text style={styles.textSmall}>Đang giao</Text>
        </View>
        <View style={styles.boxs}>
          <Ionicons name="bar-chart-outline" size={25} color={colors.brandPrimary} onPress={handleShowOrder("Đánh giá")}/>
          <Text style={styles.textSmall}>Đánh giá</Text>
        </View>
        </View>
      </View>
      {/* <Pressable style={styles.vip} onPress={() => {navigation.navigate("BuyVip")}}><Text style={styles.headerText}>MUA VIP</Text></Pressable> */}
      {/* <View style={styles.line}></View> */}
      
      <FlatList
        contentContainerStyle={styles.containerFlatlist}
        data={yourPerson}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => {
          if (item.title === "Liên hệ hỗ trợ") {
            return (
              <LineItemCategory
                iconLibrary={item.iconLibrary}
                icon={item.icon}
                onPress={() => Linking.openURL(`tel:012344553`)}
                title={item.title}
              />
            )
          } else if (item.title === "Đánh giá") {
            return (
              <LineItemCategory
                iconLibrary={item.iconLibrary}
                icon={item.icon}
                onPress={() => Linking.openURL('https://apps.apple.com/au/app/lazada-online-shopping-app/id785385147')}
                title={item.title}
              />
            )
          } else {
            return (
              <LineItemCategory
                iconLibrary={item.iconLibrary}
                icon={item.icon}
                iconColor={item.iconColor}
                onPress={() => navigation.navigate(item.slug, { id: 1 })}
                title={item.title}
              />
            )
          }
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  fullHeader: {
    // marginBottom: 5,
    paddingBottom: 10,
    paddingTop: device.iPhoneNotch ? 80 : 60,
    backgroundColor: colors.brandPrimary,
    height: 230,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 10,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  boxs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 80,
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  textSmall: {
    marginTop: 5,
    fontSize: 10,
  },
  vip: {
    marginLeft: '38%',
    marginBottom: 10,
    justifyContent: 'center',
    // alignItems: 'center',
    height: 40,
    width: 95,
    backgroundColor: colors.brandPrimary,
    borderRadius: 10,
  },
  line: {
    // borderBottomColor: colors.greyOff,
    // borderBottomWidth: 1,
  },
  avt: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderColor: colors.white,
    borderWidth: 3,
  },
  headerTextLarge: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSmall: {
    color: colors.white,
    fontSize: 14,
  },
  headerText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },

  containerHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  containerFlatlist: {
    // color: colors.black,
    // marginTop: device.iPhoneNotch ? 88 : 64
  }
});

export default Person;
