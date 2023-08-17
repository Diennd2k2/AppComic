import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigations/navigation';
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import {ImageComponent} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {setChapterId} from '../redux/reducers/chapterReducer';

const ReadComicScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<AppStackParamList, 'ReadComicScreen'>) => {
  const {id} = route.params;
  const [chapter, setChapter] = useState<any>(null);
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState<boolean>(true);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [viewUpdated, setViewUpdated] = useState(false);

  useEffect(() => {
    const fetchChapter = () => {
      try {
        const chapRef = database().ref(`chapter/${id}`);
        const onChapterChange = (snapshot: any) => {
          const data = snapshot.val();
          setChapter(data);
        };
        chapRef.on('value', onChapterChange);

        return () => {
          chapRef.off('value', onChapterChange);
        };
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };
    fetchChapter();
  }, [id]);

  const updateViews = () => {
    if (!viewUpdated) {
      const chapterRef = database().ref(`chapter/${id}`);
      chapterRef.once('value').then(snapshot => {
        const chapterData = snapshot.val();
        const newViews = (chapterData.views || 0) + 1;
        console.log(newViews);
        chapterRef.update({views: newViews}).then(() => {
          setViewUpdated(true); // Mark view as updated
        });
      });
    }
  };

  const startReading = () => {
    if (!viewUpdated) {
      const readingTimer = setTimeout(() => {
        updateViews();
        setTimer(null);
      }, 30000);
      setTimer(readingTimer);
    }
  };

  const stopReading = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null); // Reset timer after clearTimeout
    }
  };

  const chapterList = useSelector(
    (state: RootState) => state.chapterReducer.chapterList,
  );
  const dispatch = useDispatch();

  const handlePreviousChapter = () => {
    const currentIndex = chapterList.findIndex(chapter => chapter.id === id);
    if (currentIndex < chapterList.length - 1) {
      const previousChapterId = chapterList[currentIndex + 1].id;
      if (timer) {
        clearTimeout(timer);
        setTimer(null); // Reset timer after clearTimeout
      }
      dispatch(setChapterId(previousChapterId));
      navigation.replace('ReadComicScreen', {id: previousChapterId});
    } else {
      console.log('hết');
    }
  };

  const handleNextChapter = () => {
    const currentIndex = chapterList.findIndex(chapter => chapter.id === id);
    if (currentIndex > 0) {
      const nextChapterId = chapterList[currentIndex - 1].id;
      if (timer) {
        clearTimeout(timer);
        setTimer(null); // Reset timer after clearTimeout
      }
      dispatch(setChapterId(nextChapterId));
      navigation.replace('ReadComicScreen', {id: nextChapterId});
    } else {
      console.log('No next chapter available.');
    }
  };

  if (!chapter) {
    return (
      <View>
        <Text style={{color: 'black'}}>Loading...</Text>
      </View>
    );
  }

  const scrollY = new Animated.Value(0);
  const HEADER_HEIGHT = 45;
  const FOOTER_HEIGHT = 45;
  const SCROLL_THRESHOLD = 50;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const footerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, FOOTER_HEIGHT],
    extrapolate: 'clamp',
  });

  const handleScroll = (event: any) => {
    const currentScrollOffset = event.nativeEvent.contentOffset.y;
    if (currentScrollOffset > SCROLL_THRESHOLD) {
      setShowHeaderAndFooter(false);
    } else {
      setShowHeaderAndFooter(true);
    }
  };

  const singleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      setShowHeaderAndFooter(currentState => !currentState);
    });

  return (
    <View style={styles.container}>
      {showHeaderAndFooter && (
        <Animated.View
          style={[
            styles.header,
            {transform: [{translateY: headerTranslateY}]},
          ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              stopReading();
              navigation.goBack();
            }}>
            <Ionicons name={'arrow-back'} size={30} color={'#ffffff'} />
            <Text style={styles.title}>{chapter.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <GestureDetector gesture={singleTap}>
        <View style={styles.container}>
          <ImageComponent
            chapId={id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            handleNextChapter={handleNextChapter}
          />
        </View>
      </GestureDetector>
      {showHeaderAndFooter && (
        <Animated.View
          style={[
            styles.footer,
            {transform: [{translateY: footerTranslateY}]},
          ]}>
          <TouchableOpacity
            style={styles.chevron}
            onPress={handlePreviousChapter}>
            <Ionicons name={'chevron-back-sharp'} size={30} color={'#ffffff'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chevron} onPress={handleNextChapter}>
            <Ionicons
              name={'chevron-forward-sharp'}
              size={30}
              color={'#ffffff'}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: '#FF0000',
    height: 45,
    justifyContent: 'center',
    zIndex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF0000',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    alignItems: 'center',
  },
});

export default ReadComicScreen;
