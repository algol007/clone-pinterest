import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { useCallback, useEffect, useMemo, useState } from 'react';
import photoService from '../../services/photoService';

export default function TabOneScreen() {
  const randomBool = useMemo(() => Math.random() < 0.5, []);
  const [photos, setPhotos] = useState<any>([]);

  const fetchAllPhotos = useCallback(() => {
    photoService
      .getAllPhotos()
      .then((res) => setPhotos(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const numColumns = 2;

  const renderItem = ({ item }: any) => (
    <Image source={item.urls.raw} style={[styles.image]} />
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.columnWrapper}
        />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
