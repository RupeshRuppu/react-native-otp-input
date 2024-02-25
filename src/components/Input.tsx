import React, {forwardRef, useEffect, useRef} from 'react';
import {TextInput, View, Animated, Platform} from 'react-native';
import RAnimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {InputProps} from '../types';
import {defaultStyles} from '../constants';

const AnimatedTextInput = RAnimated.createAnimatedComponent(TextInput);

const Input = ({input, dispatch, error}: InputProps, ref: TextInput) => {
  const jiggle = useRef(new Animated.Value(0)).current;
  const animate = useRef(new Animated.Value(0)).current;
  const keyPressed = useRef<null | string>(null);
  const sharedValueBackground = useSharedValue(0);
  const backgroundColorAnimtedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor:
        sharedValueBackground.value === 0 ? '#f0ce71' : 'rgb(255,120,120)',
    };
  });

  useEffect(() => {
    if (!error) startAnimation();
    if (error) {
      startJiggleAnimation();
    }
  }, [error]);

  function startJiggleAnimation() {
    sharedValueBackground.value = 1;
    Animated.loop(
      Animated.timing(jiggle, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      {
        iterations: 3,
      },
    ).start(() => {
      sharedValueBackground.value = withTiming(0, {duration: 600});
      Animated.timing(jiggle, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  }

  function startAnimation() {
    Animated.loop(
      Animated.timing(animate, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ).start(() => {
      Animated.timing(animate, {
        toValue: 0,
        useNativeDriver: true,
        duration: 400,
      }).start();
    });
  }

  function handleStateChange(text: string) {
    const passed = /[0-9]/.test(text);
    if (input.value && keyPressed.current !== 'Backspace') return;

    /* update state and move forward */
    if (passed && keyPressed.current !== 'Backspace') {
      dispatch({
        type: 'FORWARD',
        payload: {
          value: text,
          idx: input.idx,
        },
      });
    }

    if (keyPressed.current === 'Backspace') {
      dispatch({
        type: 'BACKWARD',
        payload: {
          value: '',
          idx: input.idx,
        },
      });
    }

    keyPressed.current = null;
  }

  return (
    <View pointerEvents={input.active ? 'auto' : 'none'}>
      <View
        style={{
          position: 'absolute',
          width: '95%',
          height: 5,
          backgroundColor: input.active && !input.value ? '#f0ce71' : '#000000',
          borderRadius: 5,
          bottom: '-20%',
          alignSelf: 'center',
        }}
      />
      <Animated.View
        style={{
          transform: [
            {
              scale: animate.interpolate({
                inputRange: [0, 1],
                outputRange: [1, input.active && !input.value ? 1.03 : 1],
              }),
            },
            {
              translateX: jiggle.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, -10, 10],
              }),
            },
          ],
          borderColor: error ? '#FF0000' : 'transparent',
          borderWidth: error ? 3 : 0,
          borderRadius: 10,
        }}>
        <AnimatedTextInput
          ref={ref}
          maxLength={1}
          caretHidden={true}
          autoCorrect={false}
          style={[defaultStyles, backgroundColorAnimtedStyles]}
          value={input.value}
          autoFocus={input.idx === 0}
          keyboardType={Platform.OS === 'android' ? 'number-pad' : 'numeric'}
          onKeyPress={e => {
            keyPressed.current = e.nativeEvent.key;
            handleStateChange(e.nativeEvent.key);
          }}
        />
      </Animated.View>
    </View>
  );
};

export default forwardRef<TextInput, InputProps>(Input);
