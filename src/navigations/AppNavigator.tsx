import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';
import {AppStackParamList} from './navigation';
import {CategoryScreen, DetailScreen, ReadComicScreen} from '../screens';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={HomeNavigator} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="ReadComicScreen" component={ReadComicScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
