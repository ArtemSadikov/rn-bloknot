import React, {useRef, useCallback, useMemo, useState, useEffect} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {INote} from '../utils/interfaces';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    overflow: 'visible',
  },
  inputContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 2,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 8,
    elevation: 1,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 25,
    paddingHorizontal: 10,
  },
  placeholder: {
    position: 'absolute',
    color: '#9c9595',
    zIndex: -1,
    fontSize: 25,
    left: 10,
  },
  blackTitle: {
    color: 'black',
  },
});

interface Props extends TextInputProps {
  onChangeText: (value: string) => void;
  deleted: boolean;
  note?: INote;
}

export const TitleInput = (props: Props) => {
  const {onChangeText, note} = props;
  const animValue = useRef(new Animated.Value(0)).current;
  const [placeholderText] = useState(props.placeholder || props.value);
  const [value, setValue] = useState(note?.title || '');

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

  const onFocus = useCallback(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }, [animValue]);

  const onBlur = useCallback(() => {
    if (!value.trim().length) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.quad,
      }).start();
    }
  }, [animValue, value]);

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
          onBlur={onBlur}
          onFocus={onFocus}
          style={styles.textInputStyle}
          onChangeText={handleChangeText}
          value={value}
        />
      </Animated.View>
      <Animated.Text
        style={[
          {opacity: placeholderOpacity},
          styles.placeholder,
          value.trim().length !== 0 && styles.blackTitle,
        ]}>
        {placeholderText}
      </Animated.Text>
    </View>
  );
};
