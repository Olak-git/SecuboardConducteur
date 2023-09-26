import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import { Button } from 'react-native-paper';
import tw from 'twrnc';

interface LocationBottomButtonProps {
    buttonTitle: string, 
    pressAction?: any,
    loading?: boolean,
    containerStyle?: StyleProp<ViewStyle>
}
const LocationBottomButton: React.FC<LocationBottomButtonProps> = ({buttonTitle, pressAction, loading=false, containerStyle}) => {
    const [active, setActive] = useState(false);
    const [styles, setStyles] = useState({});

    useEffect(() => {
        if(active) {
            setStyles({
                position: 'absolute',
                left: 0,
                transform: [{translateY: -50}]
            })
        } else {
            setStyles({})
        }
    }, [active])
    return (
        <View style={[ tw`bg-white py-4`, styles, {width: '100%', borderTopEndRadius: 14, borderTopStartRadius: 14}, containerStyle]}>
            {/* <Pressable>
                <Icon type='' name='' />
            </Pressable> */}
            <View style={[ tw`px-30 my-3` ]}>
                <Divider />
            </View>
            <View style={tw`px-4`}>
                <Button mode='contained-tonal' loading={loading} buttonColor='#F4F4F4' onPress={pressAction} style={tw`rounded-sm p-2`}>{buttonTitle}</Button>
                {/* <TouchableOpacity
                    onPress={pressAction}
                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                    <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>{buttonTitle}</Text>
                </TouchableOpacity> */}
            </View>    
        </View>
    )
}

export default LocationBottomButton;