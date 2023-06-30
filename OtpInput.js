import {forwardRef, useEffect, useReducer, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Animated,
  Platform,
} from 'react-native';
import {
  default as RAnimated,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('screen');
const wrapperStyles = {
  flexDirection: 'row',
  width: width * 0.65,
  justifyContent: 'space-around',
};

const defaultStyles = {
  width: 48,
  height: 62,
  backgroundColor: '#f0ce71',
  borderRadius: 8,
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  elevation: 10,
  shadowRadius: 10,
  textAlign: 'center',
  fontSize: 22,
  fontWeight: 'bold',
};

const AnimatedTextInput = RAnimated.createAnimatedComponent(TextInput);

function reducer(currState, action) {
  const copiedState = [...currState];
  const {type, payload} = action;

  const object = copiedState.find(i => i.active);

  if (type === 'MOVE--FORWARD') {
    object.value = payload.value;
    object.active = false;
    const nextIndex =
      payload.idx === copiedState.length - 1 ? payload.idx : payload.idx + 1;
    copiedState[nextIndex].active = true;
  }

  if (type === 'MOVE--BACKWARD') {
    const curr = object.value ? true : false;
    object.value = payload.value;

    if (curr) {
      object.active = true;
    } else {
      object.active = false;
      const prevIndex = object.idx === 0 ? 0 : payload.idx - 1;
      copiedState[prevIndex].active = true;
      copiedState[prevIndex].value = '';
    }
  }

  if (type === 'RESET--STATE') {
    copiedState.forEach((object, index) => {
      object.value = '';
      object.active = index === 0 ? true : false;
    });
  }

  return copiedState;
}

const OtpInputBox = forwardRef(({input, dispatch, error}, ref) => {
  const jiggle = useRef(new Animated.Value(0)).current;
  const animate = useRef(new Animated.Value(0)).current;
  const keyPressed = useRef(null);
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
      }).start(() => {
        sharedValueBackground.value = withTiming(0, {duration: 600});
        Animated.timing(jiggle, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }),
      {
        iterations: 3,
      },
    ).start();
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

  function handleStateChange(text) {
    const passed = /[0-9]/.test(text);
    if (input.value && keyPressed.current !== 'Backspace') return;

    /* update state and move forward */
    if (passed && keyPressed.current !== 'Backspace') {
      dispatch({
        type: 'MOVE--FORWARD',
        payload: {
          value: text,
          idx: input.idx,
        },
      });
    }

    if (keyPressed.current === 'Backspace') {
      dispatch({
        type: 'MOVE--BACKWARD',
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
});

const OtpInput = ({
  count,
  error,
  setValue,
  inputBoxStyles,
  inputBoxWrapperStyles,
  inputBoxBottomLineStyles,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    new Array(count).fill(0).map((_, idx) => ({
      idx,
      value: '',
      ref: useRef(null),
      active: idx === 0 ? true : false,
    })),
  );

  const [inputsError, setInputsError] = useState(error);

  useEffect(() => {
    const id = setTimeout(() => {
      setInputsError(false);
      dispatch({
        type: 'RESET--STATE',
      });
    }, 700);

    return () => {
      setInputsError(!error);
      clearTimeout(id);
    };
  }, [error]);

  useEffect(() => {
    /** focus the currently active index otp-input-view */
    console.log({state});
    const object = state.find(i => i.active);
    object.ref.current.focus();

    const code = state.reduce((acc, item) => (acc += item.value), '');
    setValue(code);
  }, [state]);

  return (
    <View style={[wrapperStyles]}>
      {state.map((input, index) => (
        <OtpInputBox
          key={`index-${index}`}
          ref={input.ref}
          input={input}
          dispatch={dispatch}
          error={inputsError}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({});

/***
 * 
 *   <OtpInput
        count={4}
        error={error}
        setValue={setState}
        inputBoxStyles={{}}
        inputBoxWrapperStyles={{}}
        inputBoxBottomLineStyles={{}}
      />
 * 
 * 
 * 
 */

/*
    Usage
    export default function () {
      const [value, setValue] = useState('');
      console.log({value});
      return (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <OtpInput count={4} error={false} setValue={setValue} />
        </SafeAreaView>
      );
    }
*/
