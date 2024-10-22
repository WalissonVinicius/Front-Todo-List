import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import ToDoListScreen from './src/components/ToDoListScreen';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ToDoListScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
});

export default App;
