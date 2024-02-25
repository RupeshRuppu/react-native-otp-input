import {Dimensions, TextStyle, ViewStyle} from 'react-native';
const {width} = Dimensions.get('screen');

export const FORWARD = 'FORWARD';
export const BACKWARD = 'BACKWARD';
export const RESET = 'RESET';

export const wrapperStyles: ViewStyle = {
  flexDirection: 'row',
  width: width * 0.65,
  justifyContent: 'space-around',
};

export const defaultStyles: TextStyle = {
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
