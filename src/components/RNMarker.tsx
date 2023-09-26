import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ImageStyle } from 'react-native';
import { imageMapPath } from '../data/data';
import { windowWidth } from '../functions/functions';
import tw from 'twrnc';

interface RNMarkerProps {
    visible?: boolean,
    title?: string,
    description?: string,
    src: any,
    imageStyle?: StyleProp<ImageStyle>,
    heading?: number
}
const RNMarker: React.FC<RNMarkerProps> = ({visible, title, description, src = require("../assets/images/epingle-carte.png"), imageStyle, heading=0}) => {
    // let src = require("../assets/images/epingle-carte.png");
    // if(file == 'car') {
    //     src = require("../assets/images/icon-car.png");
    // } else if(file == 'user') {
    //     src = require("../assets/images/localisation-user.png");
    // }
    return (
        <>
            {visible && (
                <View>
                    <View style={[tw`bg-white p-2 rounded-lg`]}>
                        <Text style={tw`text-black text-xs font-bold mb-1`}>{title}</Text>
                        <Text style={[tw`text-black text-xs`, {maxWidth: windowWidth / 2, lineHeight: 13}]}>{description}</Text>
                    </View>
                    <View style={[tw`flex-row justify-center`]}>
                        <View style={[tw``, styles.triangle]}></View>
                    </View>
                </View>
            )}
            <View style={tw`items-center`}>
                <Image
                    source={src}
                    style={[tw``, {width: 40, height: 40, transform: [{rotate: `${heading}deg`}]}, imageStyle]} 
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    triangle: {
        width: 15,
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
        borderTopWidth: 13,
        borderTopColor: '#FFFFFF'
    }
})

export default RNMarker;