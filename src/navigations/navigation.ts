import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type AppStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  HistoryScreen: undefined;
  TrackScreen: undefined;
  ProfileScreen: undefined;
  DetailScreen: {id: string};
  ReadComicScreen: {id: string};
  CategoryScreen: {id: string};
};

export type DetailScreenRouteProp = NativeStackNavigationProp<
  AppStackParamList,
  'DetailScreen'
> & {
  navigate: (screen: string, params?: any) => void;
};

export type ReadComicScreenRouteProp = NativeStackNavigationProp<
  AppStackParamList,
  'ReadComicScreen'
> & {
  navigate: (screen: string, params?: any) => void;
};

export type CategoryScreenRouteProp = NativeStackNavigationProp<
  AppStackParamList,
  'CategoryScreen'
> & {
  navigate: (screen: string, params?: any) => void;
};
