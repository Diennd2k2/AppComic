import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';
import {ReadComicScreenRouteProp} from '../navigations/navigation';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setChapterList} from '../redux/reducers/chapterReducer';

const ListChapter = ({comicId}: any) => {
  const navigation = useNavigation<ReadComicScreenRouteProp>();
  const [chapter, setChapter] = useState<any[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const chapterRef = database().ref(`comics/${comicId}/chapters`);

    const onChapterChange = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const chapterList = Object.entries(data).map(
          ([id, chapter]: [string, any]) => ({
            id,
            ...chapter,
          }),
        );
        const fetchChapterData = async () => {
          const promises = chapterList.map(async item => {
            const cRef = database().ref(`chapter/${item.id}`);
            const snapshot = await cRef.once('value');
            return snapshot.val();
          });

          const chaptersData = await Promise.all(promises);
          const sortedChapterList = chapterList.map((item, index) => ({
            ...item,
            ...chaptersData[index],
          }));
          sortedChapterList.sort((a, b) => {
            const aChapterNumber = Number(a.name.split(' ')[1]);
            const bChapterNumber = Number(b.name.split(' ')[1]);
            return bChapterNumber - aChapterNumber;
          });
          setChapter(sortedChapterList);
          dispatch(setChapterList(sortedChapterList));
        };

        fetchChapterData();
      }
    };

    // Lắng nghe sự kiện thay đổi trên Firebase Realtime Database
    chapterRef.on('value', onChapterChange);

    // Hủy lắng nghe khi component bị hủy
    return () => {
      chapterRef.off('value', onChapterChange);
    };
  }, [comicId]);

  const handleStartReading = () => {
    if (chapter.length > 0) {
      const firstChapterId = chapter[chapter.length - 1].id;
      navigation.navigate('ReadComicScreen', {id: firstChapterId});
    }
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate('ReadComicScreen', {id: item.id})}>
      <View style={styles.chapter}>
        <Text style={styles.titleChapter}>{item.name}</Text>
        <Text style={styles.titleChapter}>Lượt xem: {item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listChap}>
        <FlatList
          data={chapter}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleStartReading}>
          <View style={styles.button}>
            <Text style={styles.textButton}>Bắt đầu đọc</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  listChap: {
    marginBottom: 60,
  },
  textButton: {
    fontSize: 20,
    color: '#fafafa',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: 0,
  },
  button: {
    height: 40,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FF0000',
    borderRadius: 100,
  },
  chapter: {
    height: 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#8F96A5',
    flexDirection: 'row',
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleChapter: {
    fontSize: 15,
    color: '#212121',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default ListChapter;
