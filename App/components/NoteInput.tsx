import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {INote} from '../utils/interfaces';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 2,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 8,
    elevation: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  textInputStyle: {
    fontSize: 20,
  },
  placeholder: {
    position: 'absolute',
    color: '#9c9595',
    zIndex: -1,
    fontSize: 25,
    left: 10,
  },
});

interface Props extends TextInputProps {
  onChangeText: (value: string) => void;
  deleted: boolean;
  note?: INote;
}

const NoteInput = (props: Props) => {
  const {onChangeText, note} = props;
  const [placeholderText] = useState(props.placeholder || props.value);
  const [value, setValue] = useState(note?.note || '');
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.deleted) {
      setValue('');
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.quad,
      }).start();
    }
  }, [props.deleted]);

  const handleChangeText = useCallback(
    (text: string) => {
      setValue(text);
      onChangeText(text);
    },
    [onChangeText],
  );

  const onBlur = useCallback(() => {
    if (value && !value.trim().length) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.quad,
      }).start();
    }
  }, [animValue, value]);
  const onFocus = useCallback(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }, [animValue]);

  const inputContainerOpacity = useMemo(() => {
    if (note) {
      return 1;
    }

    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  }, [animValue, note]);

  const placeholderOpacity = useMemo(
    () =>
      animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [animValue],
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.inputContainer, {opacity: inputContainerOpacity}]}>
        <TextInput
          numberOfLines={4}
          multiline
          onBlur={onBlur}
          onFocus={onFocus}
          style={styles.textInputStyle}
          onChangeText={handleChangeText}
          value={value}
        />
      </Animated.View>
      <Animated.Text
        style={[{opacity: placeholderOpacity}, styles.placeholder]}>
        {placeholderText}
      </Animated.Text>
    </View>
  );
};

export default NoteInput;
