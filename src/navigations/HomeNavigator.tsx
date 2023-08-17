import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HistoryScreen,
  HomeScreen,
  ProfileScreen,
  SearchScreen,
  TrackScreen,
} from '../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BottomTabParamList = {
  'Trang chủ': undefined;
  'Tìm kiếm': undefined;
  'Lịch sử': undefined;
  'Yêu thích': undefined;
  'Tài khoản': undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const HomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          let iconName: any;
          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tìm kiếm') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Lịch sử') {
            iconName = focused ? 'md-time' : 'md-time-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Tài khoản') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF0000',
        tabBarInactiveTintColor: '#8F96A5',
        headerShown: false,
      })}>
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Tìm kiếm" component={SearchScreen} />
      <Tab.Screen name="Lịch sử" component={HistoryScreen} />
      <Tab.Screen name="Yêu thích" component={TrackScreen} />
      <Tab.Screen name="Tài khoản" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
