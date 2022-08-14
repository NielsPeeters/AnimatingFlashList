/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, UIManager, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableLayoutAnimations} from 'react-native-reanimated';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MyList from './components/ItemList';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const isHermes = () => !!global.HermesInternal;

const App = () => {
  enableLayoutAnimations(true);
  const isDarkMode = useColorScheme() === 'dark';
  console.log('HermesEnabled: ', isHermes());
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <MyList />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
