import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { View } from '../../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import photoService, { PhotoParams } from '../../services/photoService';
import { Link } from 'expo-router';
// import { photos } from '../../constants/dummy';

export default function TabOneScreen() {
  const [photos, setPhotos] = useState<any>([]);
  const [params, setParams] = useState<PhotoParams>({
    per_page: 20,
  });
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchAllPhotos = useCallback(
    (param: PhotoParams) => {
      setRefresh(true);
      photoService
        .getAllPhotos(param)
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

  const renderFooter = () => {
    if (refresh) {
      return <ActivityIndicator size='large' />;
    } else {
      return null;
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={() =>
            setParams({
              per_page: params.per_page + 20,
            })
          }
          onEndReachedThreshold={0.75}
          ListFooterComponent={renderFooter}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
