import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { View } from '../../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import photoService, { PhotoParams } from '../../services/photoService';
import { Link } from 'expo-router';
import { Skeleton } from '../../components';

export default function HomeScreen() {
  const circleAnimatedValue = new Animated.Value(0);
  const placeholder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

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

  const translateX = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, Dimensions.get('window').width / 2 - 10],
  });

  useEffect(() => {
    fetchAllPhotos(params);
  }, []);

  const renderItem = ({ item }: any) => (
    <Link href={`/photos/${item.id}`}>
      <Image source={item.urls.small} style={[styles.image]} />
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
        <View style={{ padding: 5 }}>
          {refresh && (
            <FlatList
              data={placeholder}
              renderItem={() => (
                <Skeleton
                  circleAnimatedValue={circleAnimatedValue}
                  translateX={translateX}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
          <FlatList
            data={photos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            onEndReached={() =>
              setParams({
                per_page: params.per_page + 20,
              })
            }
            onEndReachedThreshold={30}
            ListFooterComponent={renderFooter}
          />
        </View>
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
    paddingHorizontal: 2.5,
  },
  image: {
    width: Dimensions.get('window').width / 2 - 10,
    height: 200,
    marginBottom: 5,
  },
});
