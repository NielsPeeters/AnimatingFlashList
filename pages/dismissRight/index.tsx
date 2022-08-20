import React, {useState, useEffect, useRef, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Pressable, Text, useColorScheme, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ItemProps {
  id: number;
  onRemoveItem: Function;
}

const ITEM_HEIGHT = 60;
const ANIMATION_LENGTH = 600;
const ITEMS_TO_GENERATE = 100;

const Item = ({id, onRemoveItem: removeItem}: ItemProps) => {
  const opacity = useSharedValue(1);
  const height = useSharedValue(ITEM_HEIGHT);
  const translateY = useSharedValue(8);
  const margin = useSharedValue(8);

  const isDarkMode = useColorScheme() === 'dark';

  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    opacity.value = 1;
    height.value = ITEM_HEIGHT;
    translateY.value = 8;
    margin.value = 8;
    setIsPressed(false);
  }, [id, opacity, height, translateY, margin]);

  const onRemoveItem = useCallback(
    (itemId: number) => {
      removeItem(itemId);
    },
    [removeItem],
  );

  const onRemoveExit = useCallback(() => {
    setIsPressed(true);
    opacity.value = withTiming(0);
    height.value = withDelay(
      ANIMATION_LENGTH / 2,
      withTiming(0, undefined, finished => {
        if (finished) {
          runOnJS(onRemoveItem)(id);
        }
      }),
    );
    translateY.value = withTiming(50);
    margin.value = withDelay(ANIMATION_LENGTH / 2, withTiming(0));
  }, [opacity, id, onRemoveItem, height, translateY, margin]);

  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      marginTop: margin.value,
      height: height.value,
      marginBottom: margin.value,
      transform: [
        {
          translateX: translateY.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          marginLeft: 8,
          marginRight: 16,
        },
        AnimatedStyle,
      ]}>
      <Pressable
        onPress={onRemoveExit}
        disabled={isPressed}
        style={[
          {
            backgroundColor: '#78a5e8',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            height: '100%',
          },
        ]}>
        <Text
          style={{
            fontSize: 20,
            color: isDarkMode ? Colors.darker : Colors.lighter,
          }}>{`Delete ${id} `}</Text>
      </Pressable>
    </Animated.View>
  );
};

const AnimatedList = () => {
  const list = useRef<FlashList<ItemProps> | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const [items, setItems] = useState<ItemProps[]>(
    new Array(ITEMS_TO_GENERATE).fill(0).map((_, i) => ({
      id: i,
    })) as ItemProps[],
  );

  const onRemoveItem = useCallback((id: number) => {
    console.log(id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <View
        style={{
          paddingRight: 16,
          paddingLeft: 16,
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            color: isDarkMode ? Colors.lighter : Colors.darker,
            fontSize: 20,
          }}>
          Items remaining: {items.length}
        </Text>
      </View>
      <FlashList
        ref={list}
        renderItem={({item}) => (
          <Item id={item.id} onRemoveItem={onRemoveItem} />
        )}
        estimatedItemSize={ITEMS_TO_GENERATE}
        data={items}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default AnimatedList;
