import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { React } from 'react';

const DraggableText = ({ style, children, initialX, initialY, positionY, disabled }) => {
    const x = useSharedValue(initialX==-1?0:initialX);
    const y = useSharedValue(initialY==-1?0:initialY);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = x.value;
            ctx.startY = y.value;
        },
        onActive: (event, ctx) => {
            if (disabled !== true) {
                if(initialX!=-1) x.value = Math.max(0, ctx.startX + event.translationX);
                if(initialY!=-1) y.value = Math.max(0, ctx.startY + event.translationY);
            }
        },
        onEnd: (_, ctx) => {
            positionY.value = y.value
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: x.value }, { translateY: y.value }] };
    });

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle, style]} >
            {children}
        </Animated.View>
        </PanGestureHandler>
    );
};

export default DraggableText;