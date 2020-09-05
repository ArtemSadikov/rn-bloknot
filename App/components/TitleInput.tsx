import React, {useRef, useCallback, useMemo, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';

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

const MAX_TITLE_VISIBLE_LENGTH = 25;

function truncateString(value: string, maxLength: number) {
  return value.trim().length <= maxLength
    ? value
    : `${value.slice(0, maxLength - 1)}…`;
}

interface Props extends TextInputProps {
  onChangeText: (value: string) => void;
}

export const TitleInput = (props: Props) => {
  const animVal = useRef(new Animated.Value(0)).current;
  const [placeholderText, setPlaceholderText] = useState(
    props.placeholder || props.value,
  );
  const [value, setValue] = useState('');
  const {onChangeText} = props;

  const handleChangeText = useCallback(
    (text: string) => {
      setValue(text);
      onChangeText(text);
    },
    [onChangeText],
  );

  const onFocus = useCallback(() => {
    Animated.timing(animVal, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }, [animVal]);

  const onBlur = useCallback(() => {
    Animated.timing(animVal, {
      toValue: 0,
      duration: 200,
      easing: Easing.quad,
    }).start();

    setPlaceholderText(
      value.trim().length === 0
        ? props.placeholder
        : truncateString(value, MAX_TITLE_VISIBLE_LENGTH),
    );
  }, [animVal, props.placeholder, value]);

  const opacity = useMemo(
    () =>
      animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [animVal],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, {opacity: animVal}]}>
        <TextInput
          onBlur={onBlur}
          onFocus={onFocus}
          style={styles.textInputStyle}
          onChangeText={handleChangeText}
        />
      </Animated.View>
      <Animated.Text
        style={[
          {opacity},
          styles.placeholder,
          value.trim().length !== 0 && styles.blackTitle,
        ]}>
        {placeholderText}
      </Animated.Text>
    </View>
  );
};
