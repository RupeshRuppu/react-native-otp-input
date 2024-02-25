import {MutableRefObject} from 'react';
import {TextInput, ViewStyle} from 'react-native';

export type InputContainerProps = {
  count: number;
  error: boolean;
  setValue: (otp: string) => void;
  inputBoxStyles?: ViewStyle;
  inputBoxWrapperStyles?: ViewStyle;
  inputBoxBottomLineStyles?: ViewStyle;
};

export type State = {
  idx: number;
  value: string;
  ref: MutableRefObject<TextInput | null>;
  active: boolean;
};

export type ReducerState = Array<State>;

export type ReducerAction =
  | {
      type: 'FORWARD' | 'BACKWARD';
      payload: {
        idx: number;
        value: string;
      };
    }
  | {
      type: 'RESET';
      payload?: never;
    };

export type Dispatch = React.Dispatch<ReducerAction>;
export type InputProps = {
  input: any;
  dispatch: Dispatch;
  error: boolean;
};
