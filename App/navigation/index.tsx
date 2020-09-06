import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../screens/Home';
import {View, StatusBar, StyleSheet, Text} from 'react-native';
import {SavedNotes} from '../screens/SavedNotes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  statusBarContainer: {
    height: 20,
  },
  headerContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

const Stack = createStackNavigator();

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        <StatusBar barStyle="dark-content" />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Notes!</Text>
      </View>
    </View>
  );
};

export function Routes() {
  return (
    <Stack.Navigator screenOptions={{header: () => <Header />}}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="savedNotes" component={SavedNotes} />
    </Stack.Navigator>
  );
}
