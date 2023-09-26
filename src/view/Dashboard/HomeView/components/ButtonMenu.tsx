import { Icon } from '@rneui/base';
import React from 'react';
import { TouchableOpacity, View, Text, StyleProp, ViewStyle } from 'react-native';
import { ColorsEncr } from '../../../../assets/styles';
import tw from 'twrnc';

interface ButtonMenuProps {
    navigation?: any,
    route?: string,
    iconName: string,
    caption: string,
    containerStyle?: StyleProp<ViewStyle>,
    disabled?: boolean
}
const ButtonMenu: React.FC<ButtonMenuProps> = ({ navigation, route, iconName, caption, containerStyle, disabled }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation?.navigate(route)}
            disabled={disabled}
            style={[ tw`flex-1 justify-center items-center rounded-lg ${disabled ? 'bg-gray-100' : 'bg-blue-100'} py-5 px-3`, {height: '100%'}, containerStyle ]}>
            <View style={[ tw`` ]}>
                <Icon
                    type='font-awesome-5'
                    name={iconName}
                    color={disabled ? 'grey' : ColorsEncr.main}
                    size={60} />
                <Text style={[ tw`text-center text-black` ]}>{ caption }</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ButtonMenu;