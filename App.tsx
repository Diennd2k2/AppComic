import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import Router from './src/router/router';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

function App(): JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <SafeAreaView style={{flex: 1}}>
        <Provider store={store}>
          <Router />
        </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
export default App;
