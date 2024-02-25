import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import OtpInput from './src/components/InputContainer';

export default function () {
  const [value, setValue] = useState('');
  console.log({value});
  return (
    <View style={[styles.container]}>
      <OtpInput count={4} error={false} setValue={setValue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 20, paddingHorizontal: 5},
});
