import {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const ModalPickerComponent = (props: any) => {
  const [category, setCategory] = useState<any[]>([]);

  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  useEffect(() => {
    const getCategory = () => {
      try {
        const categorysRef = database().ref('category');
        const onComicsChange = (snapshot: any) => {
          const data = snapshot.val();
          if (data) {
            const categoryList = Object.entries(data).map(
              ([id, category]: [string, any]) => ({
                id,
                ...category,
              }),
            );
            setCategory(categoryList);
          }
        };
        categorysRef.on('value', onComicsChange);
        // Hủy lắng nghe khi component bị hủy
        return () => {
          categorysRef.off('value', onComicsChange);
        };
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    getCategory();
  }, []);

  const RenderItem = React.memo(
    ({item}: any) => {
      const onPressItem = () => {
        props.changeModalVisibility(false);
        props.setData(item.id);
      };
      return (
        <TouchableOpacity
          style={{alignItems: 'center'}}
          key={item.id}
          onPress={onPressItem}>
          <Text
            style={{
              margin: 10,
              fontSize: 15,
              fontWeight: 'bold',
              color: '#212121',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    () => true,
  );

  return (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      onPress={() => props.changeModalVisibility(false)}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#FF0000',
          width: WIDTH / 2,
          height: HEIGHT / 2,
        }}>
        <FlatList
          data={category}
          keyExtractor={item => item.name}
          renderItem={({item}) => <RenderItem item={item} />}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ModalPickerComponent;
