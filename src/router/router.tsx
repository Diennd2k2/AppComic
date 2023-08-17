import auth from '@react-native-firebase/auth';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addUser, userSelector} from '../redux/reducers/userReducer';
import {LoginAndRegisterScreen} from '../screens';
import AppNavigator from '../navigations/AppNavigator';

const Router = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      dispatch(
        addUser({
          uid: user.uid,
          fcmtoken: '',
        }),
      );
    }
  }, []);

  const userData = useSelector(userSelector);
  return userData.uid ? <AppNavigator /> : <LoginAndRegisterScreen />;
};

export default Router;
