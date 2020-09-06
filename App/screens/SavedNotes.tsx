import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {useAsyncStorage} from '@react-native-community/async-storage';
import {INote} from '../utils/interfaces';
import {Note} from '../components/Note';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: '50%',
  },
  noteSeparator: {
    height: 10,
  },
});

export const SavedNotes = () => {
  const {getItem} = useAsyncStorage('notes');
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<INote[] | null>(null);

  const readFromAsyncStorage = useCallback(async () => {
    try {
      const res = await getItem();
      if (res) {
        setNotes(JSON.parse(res));
      }
      setIsLoading(false);
    } catch (error) {}
  }, [getItem]);

  const itemSeparator = () => {
    return <View style={styles.noteSeparator} />;
  };

  const renderItem = useCallback(
    ({item, index}: {item: INote; index: number}) => {
      return (
        <View key={index} style={styles.noteContainer}>
          <Note oldNote={item} />
        </View>
      );
    },
    [],
  );

  useEffect(() => {
    readFromAsyncStorage();
  }, []);

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={itemSeparator}
        />
      ) : (
        <View>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};
