import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Button } from 'react-native-paper';
import tw from'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { windowHeight } from '../../../functions/functions';

interface PaginationProps {
    index: any,
    data: any,
    handleOnChange: any
}
const Pagination: React.FC<PaginationProps> = ({ index, data, handleOnChange = () => {} }) => {

    const {height} = useWindowDimensions();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const length = data.length;

    useEffect(() => {
        Animated.timing(
            fadeAnim, {
                toValue: index === data.length-1 ? -45 : 100,
                duration: 500,
                useNativeDriver: true
            }
        ).start();
    }, [index])

    return (
        <View style={[ styles.container_dot, {bottom: height < windowHeight ? 30 : 50} ]}>
            {index !== length-1 && (
                data.map((slide:any, idx:number) => (
                    <View
                        key={ idx.toString() }
                        style={[ styles.dot, {backgroundColor: index == idx ? ColorsEncr.main : 'silver'} ]} />
                ))
            )}
            <Animated.View style={[tw``, {position:'absolute', zIndex:2, transform: [{translateY: fadeAnim}]}]}>
                <Button onPress={handleOnChange} mode='outlined' style={[tw`rounded`, {}]}>Commencer</Button>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container_dot: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 50,
        zIndex: 2
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginHorizontal: 3
    }
})

export default Pagination;