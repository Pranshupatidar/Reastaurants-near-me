import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BufferScreen from './screens/BufferScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.mainConatiner}>
      <BufferScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
