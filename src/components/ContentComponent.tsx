import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {ReadComicScreenRouteProp} from '../navigations/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContentComponent = ({comic, category}: any) => {
  const navigation = useNavigation<ReadComicScreenRouteProp>();

  const chapterList = useSelector(
    (state: RootState) => state.chapterReducer.chapterList,
  );

  const handleStartReading = () => {
    if (chapterList.length > 0) {
      const firstChapterId = chapterList[chapterList.length - 1].id;
      navigation.navigate('ReadComicScreen', {id: firstChapterId});
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          width: '100%',
          height: '30%',
        }}>
        <View style={{width: '45%', height: '100%'}}>
          <FastImage
            source={{uri: comic.avatar}}
            style={{width: 150, height: '100%', borderRadius: 20}}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
        <View
          style={{
            width: '55%',
            height: '100%',
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {comic.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'flex-end',
            }}>
            <Ionicons name="heart-outline" size={30} color={'#212121'} />
            <Ionicons name="share-social-outline" size={30} color={'#212121'} />
          </View>
        </View>
      </View>
      <View style={{height: '100%', marginTop: 10}}>
        <ScrollView horizontal style={{flexDirection: 'row'}}>
          {category.map((categoryData: any, index: any) => (
            <View
              key={index}
              style={{
                padding: 5,
                backgroundColor: '#dfdfe1',
                margin: 5,
                height: 30,
                borderRadius: 5,
              }}>
              <Text style={{color: '#212121'}}>{categoryData.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{height: 1, margin: 8, backgroundColor: '#f0f0f0'}}></View>

        <Text style={{color: 'black', height: '92%'}}>{comic.summary}</Text>
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
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FF0000',
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContentComponent;
