import React from 'react';
import { View } from './Themed';
import { Animated, Dimensions } from 'react-native';

function Skeleton({ translateX }: any) {
  return (
    <View
      style={{ padding: 5, width: Dimensions.get('window').width / 2 - 10 }}
    >
      <View
        style={{
          height: 200,
          backgroundColor: '#ECEFF1',
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: 0.5,
            transform: [{ translateX }],
          }}
        ></Animated.View>
      </View>
    </View>
  );
}

export default Skeleton;
