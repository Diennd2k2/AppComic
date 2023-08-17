import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {InputComponent} from '../components';
import {useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useDispatch} from 'react-redux';
import {addUser} from '../redux/reducers/userReducer';

const LoginAndRegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isForGetPassword, setIsForGetPassword] = useState(false);

  const dispatch = useDispatch();

  const handleLoginWithEmail = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential: FirebaseAuthTypes.UserCredential) => {
        if (userCredential) {
          const user = userCredential.user;
          dispatch(
            addUser({
              uid: user.uid,
              fcmtoken: '',
            }),
          );
        }
      })
      .catch(error => {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          Alert.alert('Lỗi', 'Tài khoản hoặc mật khẩu không chính xác!');
        } else {
          Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập!');
        }
      });
  };
  const handleRegisterWithEmail = async () => {
    if (password !== rePassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      const userRef = database().ref(`users/${user.uid}`);
      await userRef.set({
        nickname: nickname,
        email: email,
        avatar: '',
      });
      setNickName('');
      setEmail('');
      setPassword('');
      setRePassword('');
      Alert.alert('Thành công', 'Đăng ký thành công.');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
      console.log(error.message);
    }
  };
  const handleForGetPassword = () => {
    console.log(email);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.rowCenter}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{width: 300, height: 300}}
          />
        </View>
      </View>

      <View>
        <View style={styles.section}>
          {isRegister && (
            <InputComponent
              value={nickname}
              type="default"
              placeholder="Tên hiển thị"
              onChange={val => setNickName(val)}
            />
          )}
          <InputComponent
            value={email}
            placeholder="Email"
            type="email-address"
            onChange={val => setEmail(val)}
          />
          {!isForGetPassword && (
            <InputComponent
              value={password}
              placeholder="Mật khẩu"
              type="default"
              onChange={val => setPassword(val)}
              secureTextEntry
            />
          )}

          {isRegister && (
            <InputComponent
              value={rePassword}
              placeholder="Nhập lại mật khẩu"
              type="default"
              onChange={val => setRePassword(val)}
              secureTextEntry
            />
          )}
          {!isRegister && !isForGetPassword && (
            <TouchableOpacity
              style={[styles.rowCenter, {justifyContent: 'flex-end'}]}
              onPress={() => setIsForGetPassword(true)}>
              <Text style={styles.text}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.rowCenter, styles.button]}
            onPress={
              isRegister
                ? handleRegisterWithEmail
                : isForGetPassword
                ? handleForGetPassword
                : handleLoginWithEmail
            }>
            <Text style={styles.textButton}>
              {isRegister ? 'Đăng ký' : isForGetPassword ? 'Gửi' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
          {!isRegister && !isForGetPassword && (
            <View style={styles.rowCenter}>
              <Text style={[styles.text, {padding: 5}]}>
                Bạn chưa có tài khoản?
              </Text>
              <TouchableOpacity onPress={() => setIsRegister(true)}>
                <Text
                  style={[styles.text, {color: '#FF0000', fontWeight: 'bold'}]}>
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isRegister && !isForGetPassword && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.rowCenter,
                {backgroundColor: '#D9D9D9', marginTop: 15},
              ]}
              onPress={() => setIsRegister(false)}>
              <Text style={[styles.textButton, {color: '#000000'}]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          )}
          {isForGetPassword && !isRegister && (
            <View style={styles.rowCenter}>
              <TouchableOpacity onPress={() => setIsForGetPassword(false)}>
                <Text
                  style={[styles.text, {color: '#FF0000', fontWeight: 'bold'}]}>
                  Đăng Nhập
                </Text>
              </TouchableOpacity>
              <Text style={[styles.text, {padding: 5}]}>hoặc</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsRegister(true);
                  setIsForGetPassword(false);
                }}>
                <Text
                  style={[styles.text, {color: '#FF0000', fontWeight: 'bold'}]}>
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    color: '#212121',
  },
  textButton: {
    fontSize: 20,
    color: '#fafafa',
    fontWeight: 'bold',
  },
  section: {
    paddingBottom: 16,
  },
  rowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    height: 40,
    backgroundColor: '#FF0000',
    borderRadius: 100,
  },
});
export default LoginAndRegisterScreen;
