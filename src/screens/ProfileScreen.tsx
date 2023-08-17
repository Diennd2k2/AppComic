import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {addUser, userSelector} from '../redux/reducers/userReducer';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const userData = useSelector(userSelector);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            fcmtoken: '',
          }),
        );
        try {
          const userRef = database().ref(`users/${user.uid}`);
          userRef.on('value', snapshot => {
            const data = snapshot.val();
            setUser(data);
          });
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (!user) {
    return <Text>Đang lấy thông tin người dùng...</Text>;
  }

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(
          addUser({
            uid: '',
            fcmtoken: '',
          }),
        );
      });
  };
  return (
    <View style={styles.container}>
      {/* <Text style={{color: 'black'}}>{userData.uid}</Text> */}

      {/* <Text style={{color: 'black'}}>{user.avatar}</Text> */}
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {user.avatar ? (
          <FastImage
            source={{uri: user.avatar}}
            style={{width: 100, height: 100, backgroundColor: '#FF0000'}}
          />
        ) : (
          <FastImage
            source={require('../assets/images/avatar.jpg')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: '#FF0000',
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <View style={{flexDirection: 'column', padding: 15}}>
          <Text style={{color: '#212121', fontSize: 15, fontWeight: 'bold'}}>
            {user.nickname}
          </Text>
          <Text style={{color: '#212121', fontSize: 15, fontWeight: 'bold'}}>
            {user.email}
          </Text>
        </View>
      </View>
      {/* <FastImage source={require(img)} style={{width: 100, height: 100}} /> */}
      <View
        style={{
          width: '100%',
          borderColor: '#dbdbdb',
          borderWidth: 1,
          borderRadius: 20,
        }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
          <Ionicons name={'log-out-outline'} size={25} color={'#212121'} />
          <Text
            style={{
              color: '#212121',
              fontSize: 15,
              fontWeight: 'bold',
              margin: 5,
            }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileScreen;
