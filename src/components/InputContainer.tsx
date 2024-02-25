import {useEffect, useReducer, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {InputContainerProps} from '../types';
import {wrapperStyles} from '../constants';
import reducer from '../utils/reducer';
import Input from './Input';

const InputContainer = ({
  count,
  error,
  setValue,
  inputBoxStyles,
  inputBoxWrapperStyles,
  inputBoxBottomLineStyles,
}: InputContainerProps) => {
  const [state, dispatch] = useReducer(
    reducer,
    new Array(count).fill(0).map((_, idx) => ({
      idx,
      value: '',
      ref: useRef<null | TextInput>(null),
      active: idx === 0 ? true : false,
    })),
  );

  const [inputsError, setInputsError] = useState(error);

  useEffect(() => {
    const id = setTimeout(() => {
      setInputsError(false);
      dispatch({
        type: 'RESET',
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
    if (object) {
      object.ref.current?.focus();
    }

    const code = state.reduce((acc, item) => (acc += item.value), '');
    setValue(code);
  }, [state]);

  return (
    <View style={[wrapperStyles]}>
      {state.map((input, index) => (
        <Input
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

export default InputContainer;
