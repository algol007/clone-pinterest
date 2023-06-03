import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { View } from '../../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import photoService, {
  PhotoParams,
  RandomPhotoParams,
} from '../../services/photoService';
import { Link } from 'expo-router';
// import { photos } from '../../constants/dummy';

export default function TabTwoScreen() {
  const [photos, setPhotos] = useState<any>([]);
  const [params, setParams] = useState<RandomPhotoParams>({
    count: 20,
  });
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchAllPhotos = useCallback(
    (param: RandomPhotoParams) => {
      setRefresh(true);
      photoService
        .getRandomPhotos(param)
        .then((res) => {
          setRefresh(false);
          setPhotos(res);
        })
        .catch((err) => {
          setRefresh(false);
          console.log(err);
        });
    },
    [params]
  );

  useEffect(() => {
    fetchAllPhotos(params);
  }, []);

  const numColumns = 2;

  const renderItem = ({ item }: any) => (
    <Link href={`/photos/${item.id}`}>
      <Image source={item.urls.raw} style={[styles.image]} />
    </Link>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View
            style={{
              marginBottom: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderWidth: 1,
              borderRadius: 20,
              margin: 5,
            }}
          >
            <TextInput placeholder='Search a photo' />
          </View>

          <FlatList
            data={photos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={numColumns}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  columnWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  image: {
    width: Dimensions.get('window').width / 2 - 10,
    height: 200,
    marginBottom: 10,
  },
});
