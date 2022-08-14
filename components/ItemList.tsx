/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Text} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface ItemProps {
  id: number;
  onRemoveItem: Function;
}

const ITEM_HEIGHT = 60;
const ANIMATION_LENGTH = 600;

const Item = (item: ItemProps) => {
  const progress = useSharedValue(1);
  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    progress.value = 1;
  }, [item.id, progress]);

  const onRemoveItem = () => {
    progress.value = 0;
    setTimeout(() => {
      item.onRemoveItem(item.id);
    }, ANIMATION_LENGTH);
  };

  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(progress.value),
      height: withDelay(
        ANIMATION_LENGTH / 2,
        withTiming(interpolate(progress.value, [0, 1], [0, ITEM_HEIGHT])),
      ),
      marginTop: withDelay(
        ANIMATION_LENGTH / 2,
        withTiming(interpolate(progress.value, [0, 1], [0, 8])),
      ),
      marginBottom: withDelay(
        ANIMATION_LENGTH / 2,
        withTiming(interpolate(progress.value, [0, 1], [0, 8])),
      ),
      transform: [
        {
          translateX: withTiming(interpolate(progress.value, [1, 0], [0, 500])),
        },
      ],
    };
  });

  return (
    <Animated.View
      // entering={FadeInLeft.delay(10 * item.id)}
      // exiting={FadeOutRight}
      style={[
        {
          marginLeft: 16,
          marginRight: 16,
        },
        AnimatedStyle,
      ]}>
      <RectButton
        onPress={onRemoveItem}
        style={[
          {
            backgroundColor: '#78a5e8',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            height: ITEM_HEIGHT,
          },
        ]}>
        <Text style={{fontSize: 20, color: 'black'}}>{`${item.id} Hello`}</Text>
      </RectButton>
    </Animated.View>
  );
};

const MyList = () => {
  const list = useRef<FlashList<ItemProps> | null>(null);

  const [items, setItems] = useState<ItemProps[]>(
    new Array(1000).fill(0).map((_, i) => ({
      id: i,
    })) as ItemProps[],
  );

  const onRemoveItem = useCallback((id: number) => {
    console.log(id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    list.current?.prepareForLayoutAnimationRender();
    // After removing the item, we can start the animation.
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <FlashList
      ref={list}
      renderItem={({item}) => <Item id={item.id} onRemoveItem={onRemoveItem} />}
      estimatedItemSize={1000}
      data={items}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export default MyList;
