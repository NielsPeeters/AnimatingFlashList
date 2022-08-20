import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DismissRight from '../dismissRight';
import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Drawer = createDrawerNavigator();

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const drawerOptions = {
    headerShown: false,
    drawerActiveBackgroundColor: isDarkMode ? Colors.lighter : Colors.darker,
    drawerLabelStyle: {
      color: isDarkMode ? Colors.dark : Colors.light,
    },
    drawerInactiveBackgroundColor: isDarkMode ? '#999999' : '#aaaaaa',
    drawerContentStyle: isDarkMode
      ? {backgroundColor: '#333333'}
      : {backgroundColor: '#dddddd'},
    sceneContainerStyle: {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    },
    overlayColor: 'transparent',
  };

  return (
    <Drawer.Navigator
      initialRouteName="dismiss-right"
      screenOptions={drawerOptions}>
      <Drawer.Screen
        name="dismiss-right"
        component={DismissRight}
        options={{drawerLabel: 'Dismiss Right'}}
      />
      <Drawer.Screen
        name="dismiss-left"
        component={DismissRight}
        options={{drawerLabel: 'Swipe Left'}}
      />
    </Drawer.Navigator>
  );
};

export default Home;
