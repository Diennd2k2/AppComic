import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import React from 'react';
import FastImage from 'react-native-fast-image';
import lodash from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {DetailScreenRouteProp} from '../navigations/navigation';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [comicData, setComicData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<DetailScreenRouteProp>();

  useEffect(() => {
    setIsLoading(true);
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

            setIsLoading(false);
            setComicData(comicList);
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

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={'#FF0000'} />
      </View>
    );
  }

  const removeDiacritics = (str: string) => {
    const diacriticsMap: {[key: string]: string} = {
      à: 'a',
      á: 'a',
      ạ: 'a',
      ả: 'a',
      ã: 'a',
      â: 'a',
      ầ: 'a',
      ấ: 'a',
      ậ: 'a',
      ẩ: 'a',
      ẫ: 'a',
      ă: 'a',
      ằ: 'a',
      ắ: 'a',
      ặ: 'a',
      ẳ: 'a',
      ẵ: 'a',
      è: 'e',
      é: 'e',
      ẹ: 'e',
      ẻ: 'e',
      ẽ: 'e',
      ê: 'e',
      ề: 'e',
      ế: 'e',
      ệ: 'e',
      ể: 'e',
      ễ: 'e',
      ì: 'i',
      í: 'i',
      ị: 'i',
      ỉ: 'i',
      ĩ: 'i',
      ò: 'o',
      ó: 'o',
      ọ: 'o',
      ỏ: 'o',
      õ: 'o',
      ô: 'o',
      ồ: 'o',
      ố: 'o',
      ộ: 'o',
      ổ: 'o',
      ỗ: 'o',
      ơ: 'o',
      ờ: 'o',
      ớ: 'o',
      ợ: 'o',
      ở: 'o',
      ỡ: 'o',
      ù: 'u',
      ú: 'u',
      ụ: 'u',
      ủ: 'u',
      ũ: 'u',
      ư: 'u',
      ừ: 'u',
      ứ: 'u',
      ự: 'u',
      ử: 'u',
      ữ: 'u',
      ỳ: 'y',
      ý: 'y',
      ỵ: 'y',
      ỷ: 'y',
      ỹ: 'y',
      đ: 'd',
    };

    return str.replace(/[^A-Za-z0-9]/g, char => diacriticsMap[char] || char);
  };

  const constains = ({name}: any, query: string) => {
    const formattedName = removeDiacritics(name.toLowerCase());
    if (formattedName.includes(query)) {
      return true;
    }
    return false;
  };

  const handleSearch = (query: string) => {
    setSearchText(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    const formattedQuery = removeDiacritics(query.toLowerCase());
    const filteredData = lodash.filter(comicData, name => {
      return constains(name, formattedQuery);
    });
    setSearchResults(filteredData);
  };

  const RenderItemComponent = React.memo(
    ({item}: {item: any}) => {
      return (
        <View style={{flex: 1, width: '100%', paddingBottom: 10}}>
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('DetailScreen', {id: item.id})}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: '15%',
              }}>
              <FastImage
                source={{uri: item.avatar}}
                style={{width: '90%', height: 60, borderRadius: 5}}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
            <View style={{width: '85%'}}>
              <Text
                style={{color: '#121212', fontWeight: 'bold', fontSize: 15}}>
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
          Tìm kiếm
        </Text>
      </View>
      <View style={{flex: 1, paddingHorizontal: 16}}>
        <View
          style={{
            borderWidth: 2,
            borderColor: '#FF0000',
            borderRadius: 10,
            height: 45,
          }}>
          <TextInput
            style={{color: '#212121'}}
            placeholder="Tìm kiếm truyện tranh..."
            placeholderTextColor={'#A6A6A6'}
            value={searchText}
            onChangeText={query => handleSearch(query)}
            // onSubmitEditing={handleSearch}
            autoCorrect={false}
          />
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            data={searchResults}
            keyExtractor={item => item.name}
            renderItem={({item}) => <RenderItemComponent item={item} />}
          />
        </View>
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

export default SearchScreen;
