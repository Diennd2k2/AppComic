import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParamList} from '../navigations/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ContentComponent, ListChapter} from '../components';

const DetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<AppStackParamList, 'DetailScreen'>) => {
  const {id} = route.params;
  const [comic, setComic] = useState<any>(null);
  const [category, setCategory] = useState<any[]>([]);
  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    const fetchComic = () => {
      try {
        const comicRef = database().ref(`comics/${id}`);
        const onComicChange = (snapshot: any) => {
          const data = snapshot.val();
          if (data) {
            const fetchCategoriesData = async () => {
              const categoriesData = [];
              const categoryIds = data.category;

              for (const categoryId of categoryIds) {
                const categoryRef = database().ref(`category/${categoryId}`);
                const snapshot = await categoryRef.once('value');
                const categoryData = snapshot.val();
                categoriesData.push(categoryData);
              }
              setCategory(categoriesData);
            };

            fetchCategoriesData();
          }
          setComic(data);
        };
        comicRef.on('value', onComicChange);
        // Hủy lắng nghe khi component bị hủy
        return () => {
          comicRef.off('value', onComicChange);
        };
      } catch (error) {
        console.error('Error fetching comic:', error);
      }
    };

    fetchComic();
  }, [id]);

  if (!comic) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={'#FF0000'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={30} color={'#ffffff'} />
        </TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {comic.name}
        </Text>
      </View>
      <View style={styles.content}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#212121',
            tabBarInactiveTintColor: '#A6A6A6',
            tabBarIndicatorStyle: {
              borderBottomColor: '#FF0000',
              borderBottomWidth: 2,
            },
            swipeEnabled: false,
          }}>
          <Tab.Screen name="Giới thiệu">
            {() => <ContentComponent comic={comic} category={category} />}
          </Tab.Screen>
          <Tab.Screen name="Chapter">
            {() => <ListChapter comicId={id} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: 45,
    padding: 8,
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});

export default DetailScreen;
