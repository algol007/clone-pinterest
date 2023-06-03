import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import { View } from '../../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import photoService, { PhotoParams } from '../../services/photoService';
import { Link, useLocalSearchParams } from 'expo-router';
import { photos } from '../../constants/dummy';
import Colors from '../../constants/Colors';

export default function PhotoDetail() {
  const [photo, setPhoto] = useState<any>([]);
  const { id } = useLocalSearchParams();
  // const photo: any = photos[0];

  const fetchDetailPhoto = useCallback(() => {
    photoService
      .getPhotoDetail(String(id))
      .then((res) => {
        setPhoto(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchDetailPhoto();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={{ uri: photo?.urls?.full }}
        />
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  overflow: 'hidden',
                }}
              >
                <ImageBackground
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  source={{ uri: photo?.user?.profile_image?.medium }}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>
                  {photo?.user?.username}
                </Text>
                <Text>{photo?.user?.total_likes} followers</Text>
              </View>
            </View>

            <View>
              <TouchableOpacity style={styles.button}>
                <Text style={{ fontWeight: 'bold' }}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <Text style={{ fontSize: 16 }}>{photo?.description}</Text>
          </View>
          <View style={styles.fixToText}>
            <TouchableOpacity style={styles.button}>
              <Text style={{ fontWeight: 'bold' }}>
                {photo?.liked_by_user ? 'Unlike' : 'Like'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.light.tint }]}
            >
              <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                Download
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    minHeight: Dimensions.get('window').height,
  },
  columnWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  image: {
    width: undefined,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 20,
    minWidth: 100,
  },
});
