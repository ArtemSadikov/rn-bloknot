import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {TitleInput} from '../components/TitleInput';
import Animated from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 10,
    overflow: 'visible',
  },
});

export const Home = () => {
  const onChangeText = useCallback((value: string) => {
    
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView style={styles.scrollView}>
        <TitleInput placeholder="Title" onChangeText={onChangeText} />
      </Animated.ScrollView>
    </View>
  );
};
