import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import tw from 'twrnc';
import { windowHeight, windowWidth } from '../../../functions/functions';


interface ItemProps {
    item: any
}
const Item: React.FC<ItemProps> = ({ item }) => {

    const {width, height} = useWindowDimensions();

    return (
        <View style={[tw``, styles.container_item, {width: width, height: height - 120} ]}>
            <View style={ styles.item }>
                <Image
                    style={ styles.item_image }
                    source={ item.image }
                    resizeMode='center' />
                <View style={tw``}>
                    {item.title && (
                        <Text style={tw`text-center text-xl text-black mb-2`}>{item.title}</Text>
                    )}
                    <Text style={[ tw`font-medium text-center text-gray-700`, styles.item_title ]}>{ item.titre }</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container_item: {
        width: windowWidth,
        height: windowHeight - 100,
        alignItems: 'center'
    },
    item: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    item_image: {
        height: '40%',
        width: '100%'
    },
    item_title: {
    }
})

export default Item;