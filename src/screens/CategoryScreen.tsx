import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppStackParamList} from '../navigations/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {ModalPickerComponent} from '../components';

type Comic = {
  id: string;
  name: string;
  avatar: string;
};

const CategoryScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<AppStackParamList, 'CategoryScreen'>) => {
  const {id} = route.params;

  const [comicsCategory, setComicsCategory] = useState<Comic[]>([]);
  const [chooseCategory, setChooseCategory] = useState(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameCategory, setNameCategory] = useState<any>([]);

  const changeModalVisibility = (bool: any) => {
    setIsModalVisible(bool);
  };

  useEffect(() => {
    const comicsRef = database().ref('comics');

    const onComicsChange = (snapshot: any) => {
      const data = snapshot.val();
      const comicList = Object.entries(data).map(
        ([id, comic]: [string, any]) => ({
          id,
          ...comic,
        }),
      );
      const comicsInCategory = comicList.filter(comic =>
        comic.category.includes(chooseCategory),
      );

      setComicsCategory(comicsInCategory);
    };

    comicsRef.orderByChild(`category`).on('value', onComicsChange);
    const categoryRef = database().ref(`category/${chooseCategory}`);
    const onCategoryChange = (snapshot: any) => {
      const dataCategory = snapshot.val();
      setNameCategory(dataCategory);
      console.log(dataCategory);
    };
    categoryRef.on('value', onCategoryChange);
    // Hủy lắng nghe khi component bị hủy
    return () => {
      comicsRef.off('value', onComicsChange);
      categoryRef.off('value', onCategoryChange);
    };
  }, [chooseCategory]);

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={30} color={'#ffffff'} />
        </TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          Thể loại
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => changeModalVisibility(true)}
          style={{
            marginTop: 10,
            paddingHorizontal: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              padding: 10,
              fontSize: 15,
              color: '#FF0000',
              borderColor: '#212121',
              borderWidth: 1,
              fontWeight: 'bold',
              borderRadius: 10,
            }}>
            {nameCategory.name}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => changeModalVisibility(false)}>
          <ModalPickerComponent
            changeModalVisibility={changeModalVisibility}
            setData={setChooseCategory}></ModalPickerComponent>
        </Modal>
      </View>
      <View style={{marginTop: 10, paddingHorizontal: 16}}>
        <FlatList
          data={comicsCategory}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => <RenderItemComponent item={item} />}
          numColumns={3}
        />
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
});

export default CategoryScreen;
