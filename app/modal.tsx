import { ImageBackground, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useCallback, useEffect, useState } from 'react';
import userService from '../services/userService';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ModalScreen() {
  const [user, setUser] = useState<any>();

  const fetchUserProfile = useCallback(() => {
    userService
      .getCurrentUser()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          MY PROFILE
        </Text>
      </View>
      <View style={{ marginBottom: 40, alignItems: 'center' }}>
        <View style={{ borderRadius: 50, overflow: 'hidden', borderWidth: 2 }}>
          <ImageBackground
            style={{
              width: 100,
              height: 100,
            }}
            source={{ uri: user?.profile_image?.large }}
          />
        </View>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.subtitle}>Full Name</Text>
        <Text>
          {user?.first_name} {user?.last_name}
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.subtitle}>Username</Text>
        <Text>{user?.username}</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.subtitle}>Bio</Text>
        <Text>{user?.bio || '-'}</Text>
      </View>
      <View
        style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}
      >
        <FontAwesome name='instagram' size={24} style={{ marginRight: 10 }} />
        <Text>{user?.social.instagram_username || '-'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
