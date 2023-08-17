import {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollViewProps,
  Text,
} from 'react-native';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

type Props = {
  chapId: any;
  onScroll?: ScrollViewProps['onScroll'];
  scrollEventThrottle?: any;
  handleNextChapter: any;
};

const ImageComponent = (props: Props) => {
  const {chapId, onScroll, scrollEventThrottle, handleNextChapter} = props;

  const [showNextButton, setShowNextButton] = useState(false);
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    const fetchImage = () => {
      const imgRef = database().ref(`chapter/${chapId}/images`);
      const onImageChange = (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          const listImgae = Object.entries(data).map(
            ([id, img]: [string, any]) => ({
              id,
              ...img,
            }),
          );
          const filteredList = listImgae.filter(item => item.id !== '0');
          setImage(filteredList);
        }
      };
      imgRef.on('value', onImageChange);

      return () => {
        imgRef.off('value', onImageChange);
      };
    };
    fetchImage();
  }, [chapId]);

  const windowWidth = Dimensions.get('window').width;
  const RenderItem = React.memo(
    ({item}: any) => {
      return (
        <FastImage
          source={{uri: item.url}}
          style={{
            width: windowWidth,
            height: windowWidth * 0.625,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
      );
    },
    () => true,
  );

  const chapterList = useSelector(
    (state: RootState) => state.chapterReducer.chapterList,
  );

  const currentIndex = chapterList.findIndex(chapter => chapter.id === chapId);

  const renderFooter = () => {
    if (currentIndex > 0) {
      return (
        <View style={{height: 150, alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextChapter}>
            <FontAwesome
              name="hand-o-right"
              size={25}
              color={'black'}></FontAwesome>
            <Text style={styles.buttonText}>Nhấn để tải chap sau</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={image}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <RenderItem item={item} />}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  nextButton: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'black',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ImageComponent;
