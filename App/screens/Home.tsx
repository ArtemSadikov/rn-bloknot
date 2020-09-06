import React, {useCallback, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {TitleInput} from '../components/TitleInput';
import NoteInput from '../components/NoteInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 10,
    overflow: 'visible',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  noteInputContainer: {
    flex: 1,
    backgroundColor: 'green',
    paddingTop: 12,
    height: 400,
  },
});

export function Home() {
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const onChangeTitleText = useCallback((value: string) => {}, []);
  const onChangeNoteText = useCallback((value: string) => {}, []);

  const event = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollPosition}}}],
    {useNativeDriver: true},
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {},
    [],
  );

  const rotate = useMemo(
    () =>
      scrollPosition.interpolate({
        inputRange: [-1000, 0, 1000],
        outputRange: [6, 0, -6],
      }),
    [scrollPosition],
  );

  const translateX = useMemo(
    () =>
      scrollPosition.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [500, 0, -500],
      }),
    [scrollPosition],
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        onScroll={event}
        scrollEventThrottle={1}
        directionalLockEnabled={true}
        onScrollEndDrag={onScrollEndDrag}
        style={styles.scrollView}>
        <Animated.View
          style={[styles.content, {transform: [{rotate}, {translateX}]}]}>
          <TitleInput placeholder="Title" onChangeText={onChangeTitleText} />
          <NoteInput
            placeholder="Something very cool"
            onChangeText={onChangeNoteText}
          />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
