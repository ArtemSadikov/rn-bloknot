import React, {useMemo, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Keyboard,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {TitleInput} from './TitleInput';
import NoteInput from './NoteInput';
import {INote} from '../utils/interfaces';

const styles = StyleSheet.create({
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
    paddingTop: 12,
    height: 400,
  },
});

const SCROLL_END_DRAG_EVENT = 42;
const TRANSLATE_X = 500;

interface Props {
  onSaveNote: (value: INote) => void;
  id: number;
}

export const Note = (props: Props) => {
  const {id, onSaveNote} = props;

  const scrollPosition = useRef(new Animated.Value(0)).current;
  const [deleted, setDeleted] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const onChangeTitleText = useCallback((value: string) => {
    setTitle(value);
  }, []);
  const onChangeNoteText = useCallback((value: string) => {
    setNote(value);
  }, []);

  const event = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollPosition}}}],
    {useNativeDriver: true},
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const position = e.nativeEvent.contentOffset.x;

      Keyboard.dismiss();
      if (position >= SCROLL_END_DRAG_EVENT) {
        // delete note
        setDeleted(true);
        setTitle('');
        setTimeout(() => setDeleted(false), 100);
      } else if (position <= -SCROLL_END_DRAG_EVENT) {
        // add note
        setTitle('');
        setDeleted(Boolean(title.trim().length));
        setTimeout(() => setDeleted(false), 100);
        onSaveNote({title, note, id});
      }
    },
    [id, note, onSaveNote, title],
  );

  const rotateZ = useMemo(
    () =>
      scrollPosition.interpolate({
        inputRange: [-1000, 0, 1000],
        outputRange: [4, 0, -4],
      }),
    [scrollPosition],
  );

  const translateX = useMemo(
    () =>
      scrollPosition.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [TRANSLATE_X, 0, -TRANSLATE_X],
      }),
    [scrollPosition],
  );

  return (
    <Animated.ScrollView
      horizontal
      onScroll={event}
      scrollEventThrottle={1}
      directionalLockEnabled={true}
      onScrollEndDrag={onScrollEndDrag}
      style={styles.scrollView}>
      <Animated.View
        style={[styles.content, {transform: [{rotateZ}, {translateX}]}]}>
        <TitleInput
          placeholder="Title"
          onChangeText={onChangeTitleText}
          deleted={deleted}
        />
        <NoteInput
          placeholder="Something very cool"
          onChangeText={onChangeNoteText}
          deleted={deleted}
        />
      </Animated.View>
    </Animated.ScrollView>
  );
};
