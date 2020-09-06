import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useAsyncStorage} from '@react-native-community/async-storage';
import {Note} from '../components/Note';
import {INote} from '../utils/interfaces';
import {TouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export function Home({navigation}) {
  const {getItem, setItem} = useAsyncStorage('notes');
  const [notes, setNotes] = useState<INote[] | null>(null);

  const onMoveToNotesPress = () => {
    navigation.navigate('savedNotes');
  };

  const readItemAsyncStorage = useCallback(async () => {
    try {
      const res = await getItem();
      console.log(res);
      if (res) {
        setNotes(JSON.parse(res));
      }
    } catch (error) {}
  }, [getItem]);

  useEffect(() => {
    readItemAsyncStorage();
  }, []);

  const onSaveNote = useCallback(
    async (value: INote) => {
      try {
        if (value.title.trim().length) {
          if (notes) {
            await setItem(JSON.stringify([...notes, value]));
            setNotes([...notes, value]);
          } else {
            await setItem(JSON.stringify([value]));
            setNotes([value]);
          }
        }
      } catch (e) {}
    },
    [notes, setItem],
  );

  const noteId = useMemo(() => {
    return notes ? notes[notes.length - 1].id + 1 : 0;
  }, [notes]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>&larr; Delete</Text>
        <TouchableOpacity onPress={onMoveToNotesPress}>
          <Text>Move to notes</Text>
        </TouchableOpacity>
        <Text>Add &rarr;</Text>
      </View>
      <Note onSaveNote={onSaveNote} id={noteId} />
    </View>
  );
}
