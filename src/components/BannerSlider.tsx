import {useEffect, useRef, useState} from 'react';
import database from '@react-native-firebase/database';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {DetailScreenRouteProp} from '../navigations/navigation';
import {useNavigation} from '@react-navigation/native';

type Comic = {
  id: string;
  name: string;
  avatar: string;
};

type Props = {
  comics: any;
  activeIndex: any;
  flatListRef: any;
  setActiveIndex: any;
};

const BannerSlider = (props: Props) => {
  const {comics, activeIndex, flatListRef, setActiveIndex} = props;

  const navigation = useNavigation<DetailScreenRouteProp>();

  // useEffect(() => {
  //   // Lấy danh sách truyện tranh từ Realtime Database
  //   const getComics = () => {
  //     try {
  //       const comicsRef = database().ref('comics');
  //       const onComicsChange = (snapshot: any) => {
  //         const data = snapshot.val();
  //         if (data) {
  //           const comicList = Object.entries(data).map(
  //             ([id, comic]: [string, any]) => ({
  //               id,
  //               ...comic,
  //             }),
  //           );
  //           const randomComics = comicList
  //             .sort(() => 0.5 - Math.random())
  //             .slice(0, 5);
  //           setComics(randomComics);
  //           setActiveIndex(0);
  //           flatListRef.current?.scrollToIndex({index: 0, animated: false});
  //         }
  //       };
  //       comicsRef.on('value', onComicsChange);
  //       // Hủy lắng nghe khi component bị hủy
  //       return () => {
  //         comicsRef.off('value', onComicsChange);
  //       };
  //     } catch (error) {
  //       console.error('Error fetching comics:', error);
  //     }
  //   };

  //   getComics();
  // }, []);

  const RenderItemComponent = React.memo(
    ({item}: {item: Comic}) => {
      return (
        <TouchableOpacity
          style={[styles.bannerContainer]}
          key={item.id}
          onPress={() => navigation.navigate('DetailScreen', {id: item.id})}>
          <FastImage
            source={{uri: item.avatar}}
            style={[styles.bannerImage]}
            resizeMode={FastImage.resizeMode.stretch}
          />
          {/* <Image source={{uri: item.avatar}} style={[styles.bannerImage]} /> */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    () => true,
  );

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const screenWith = event.nativeEvent.layoutMeasurement.width;
    const index = Math.ceil(scrollPosition / screenWith);
    setActiveIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (comics.length > 0) {
        const nextIndex =
          activeIndex === comics.length - 1 ? 0 : activeIndex + 1;
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex, comics]);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: any}) => {
      if (viewableItems && viewableItems.length > 0) {
        const firstVisibleIndex = viewableItems[0].index;
        setActiveIndex(firstVisibleIndex);
      }
    },
  ).current;

  const RenderDotIndicatorsComponent = React.memo(() => {
    return comics.map((dot: any, index: any) => {
      const isActive = index === activeIndex;
      return (
        <View
          key={index}
          style={[
            styles.dotIndicator,
            {backgroundColor: isActive ? '#FF0000' : '#dfdfe1'},
          ]}
        />
      );
    });
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={comics}
        ref={flatListRef}
        onScroll={handleScroll}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        getItemLayout={(_, index) => ({
          length: Dimensions.get('window').width,
          offset: Dimensions.get('window').width * index,
          index,
        })}
        renderItem={({item}) => <RenderItemComponent item={item} />}
      />
      <View style={styles.dotIndicatorsContainer}>
        <RenderDotIndicatorsComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#212121',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  bannerContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 16,
    height: Dimensions.get('window').height * 0.3,
  },
  bannerImage: {
    width: '100%',
    height: '85%',
    borderRadius: 20,
  },
  dotIndicatorsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 190,
  },
  dotIndicator: {
    backgroundColor: '#dfdfe1',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default BannerSlider;
