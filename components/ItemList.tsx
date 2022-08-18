/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Pressable, Text} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
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

const Item = ({id, onRemoveItem: removeItem}: ItemProps) => {
  const progress = useSharedValue(1);
  const height = useSharedValue(1);

  useEffect(() => {
    // Reset value when id changes (view was recycled for another item)
    progress.value = 1;
    height.value = ITEM_HEIGHT;
  }, [id, progress, height]);

  const onRemoveItem = useCallback(
    (itemId: number) => {
      removeItem(itemId);
    },
    [removeItem],
  );

  const onRemoveExit = useCallback(() => {
    progress.value = 0;
    height.value = withDelay(
      ANIMATION_LENGTH / 2,
      withTiming(
        interpolate(0, [0, 1], [0, ITEM_HEIGHT]),
        undefined,
        finished => {
          if (finished) {
            runOnJS(onRemoveItem)(id);
          }
        },
      ),
    );
  }, [progress, id, onRemoveItem, height]);

  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(progress.value),
      marginTop: withDelay(
        ANIMATION_LENGTH / 2,
        withTiming(interpolate(progress.value, [0, 1], [0, 8])),
      ),
      height: height.value,
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
      style={[
        {
          marginLeft: 16,
          marginRight: 16,
        },
        AnimatedStyle,
      ]}>
      <Pressable
        onPress={onRemoveExit}
        style={[
          {
            backgroundColor: '#78a5e8',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            height: '100%',
          },
        ]}>
        <Text style={{fontSize: 20, color: 'black'}}>{`${id} Hello`}</Text>
      </Pressable>
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
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    // list.current?.prepareForLayoutAnimationRender();
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
