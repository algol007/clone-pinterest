import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';
import { View } from '../../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import photoService, { PhotoParams } from '../../services/photoService';
import { Link } from 'expo-router';
import { Skeleton } from '../../components';

export default function SearchScreen() {
  const circleAnimatedValue = new Animated.Value(0);
  const placeholder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const [photos, setPhotos] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [params, setParams] = useState<PhotoParams>({
    per_page: 20,
    query: '',
  });

  const fetchRandomPhotos = useCallback(() => {
    setRefresh(true);
    circleAnimated();
    photoService
      .getRandomPhotos()
      .then((res) => {
        setRefresh(false);
        setPhotos(res);
      })
      .catch((err) => {
        setRefresh(false);
        console.log(err);
      });
  }, []);

  const searchPhotos = useCallback(
    (param: PhotoParams) => {
      setRefresh(true);
      circleAnimated();
      photoService
        .getSearchPhotos(param)
        .then((res) => {
          setRefresh(false);
          // @ts-ignore
          setPhotos(res.results);
        })
        .catch((err) => {
          setRefresh(false);
          console.log(err);
        });
    },
    [params]
  );

  const circleAnimated = () => {
    circleAnimatedValue.setValue(0);
    Animated.timing(circleAnimatedValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        circleAnimated();
      }, 1000);
    });
  };

  const translateX = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, Dimensions.get('window').width / 2 - 10],
  });

  const handleChangeKeyword = (keyword: string) => {
    setParams({
      ...params,
      query: keyword,
    });
  };

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

  useEffect(() => {
    const getData = setTimeout(() => {
      if (params.query !== '') {
        searchPhotos(params);
      } else {
        fetchRandomPhotos();
      }
    }, 2000);

    return () => clearTimeout(getData);
  }, [params]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder='Search a photo'
              onChangeText={handleChangeKeyword}
              // @ts-ignore
              style={{ outlineStyle: 'none' }}
            />
          </View>
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
                  ...params,
                  per_page: params.per_page + 20,
                })
              }
              onEndReachedThreshold={10}
              ListFooterComponent={renderFooter}
            />
          </View>
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
  inputWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    margin: 10,
  },
  image: {
    width: Dimensions.get('window').width / 2 - 10,
    height: 200,
    marginBottom: 5,
  },
});
