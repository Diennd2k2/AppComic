import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BannerSlider} from '../components';
import FastImage from 'react-native-fast-image';
import database from '@react-native-firebase/database';
import {DetailScreenRouteProp} from '../navigations/navigation';
import {useEffect, useRef, useState} from 'react';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

type Comic = {
  id: string;
  name: string;
  avatar: string;
};

const HomeScreen = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [randomComics, setRandomComics] = useState<Comic[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList<any>>(null);

  const navigation = useNavigation<DetailScreenRouteProp>();

  useEffect(() => {
    // Lấy danh sách truyện tranh từ Realtime Database
    const getComics = () => {
      try {
        const comicsRef = database().ref('comics');
        const onComicsChange = (snapshot: any) => {
          const data = snapshot.val();
          if (data) {
            const comicList = Object.entries(data).map(
              ([id, comic]: [string, any]) => ({
                id,
                ...comic,
              }),
            );
            setComics(comicList);
            const randomComics = comicList
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            setRandomComics(randomComics);
            setActiveIndex(0);
            flatListRef.current?.scrollToIndex({index: 0, animated: false});
          }
        };
        comicsRef.on('value', onComicsChange);
        // Hủy lắng nghe khi component bị hủy
        return () => {
          comicsRef.off('value', onComicsChange);
        };
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };

    getComics();
  }, []);

  const RenderItemComponent = React.memo(
    ({item}: {item: Comic}) => {
      return (
        <View style={{width: '33.333%', padding: '1%'}}>
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('DetailScreen', {id: item.id})}>
            <FastImage
              source={{uri: item.avatar}}
              style={{width: '100%', height: 180, borderRadius: 10}}
              resizeMode={FastImage.resizeMode.stretch}
            />

            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{color: 'black', fontWeight: 'bold'}}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    () => true,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          Trang chủ
        </Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <View>
          <BannerSlider
            comics={randomComics}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            flatListRef={flatListRef}
          />
        </View>
        <View style={{width: '100%', paddingHorizontal: 16}}>
          <View>
            <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
              Thể loại
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 10,
            }}>
            <View style={{width: '50%', paddingHorizontal: 5, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryScreen', {id: 'huyen_huyen'})
                }>
                <FastImage
                  style={{width: '100%', height: 60, borderRadius: 5}}
                  source={require('../assets/images/huyen_huyen.jpg')}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '50%', paddingHorizontal: 5, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryScreen', {id: 'xuyen_khong'})
                }>
                <FastImage
                  style={{width: '100%', height: 60, borderRadius: 5}}
                  source={require('../assets/images/xuyen_khong.jpg')}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '50%', paddingHorizontal: 5, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryScreen', {id: 'ngon_tinh'})
                }>
                <FastImage
                  style={{width: '100%', height: 60, borderRadius: 5}}
                  source={require('../assets/images/ngon_tinh.jpg')}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '50%', paddingHorizontal: 5, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryScreen', {id: 'he_thong'})
                }>
                <FastImage
                  style={{width: '100%', height: 60, borderRadius: 5}}
                  source={require('../assets/images/he_thong.jpg')}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Truyện tranh
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <FlatList
              data={comics}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => <RenderItemComponent item={item} />}
              numColumns={3}
            />
          </View>
        </View>
      </ScrollView>
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
    height: 50,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    color: '#212121',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
