import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ColorsEncr } from '../../../../assets/styles';
import tw from 'twrnc';
import { Icon } from '@rneui/base';

export const DrawerMenuText: React.FC<{disabled?: boolean, text: string, textStyle?: StyleProp<TextStyle>}> = ({disabled, text, textStyle}) => {
    return (
        <Text style={[ tw`flex-1 px-4 font-semibold text-lg ${disabled ? 'text-gray-300' : 'text-black'}`,{fontFamily: 'Raleway-VariableFont_wght'}, textStyle ]} numberOfLines={1}>{text}</Text>
    )
}

interface DrawerMenuProps {
    navigation?: any,
    containerStyle?: StyleProp<ViewStyle>,
    iconType?: string,
    iconName: string,
    iconSize?: number,
    textMenu: string,
    screenName?: string,
    screenParams?: any,
    disabled?: boolean
}
const DrawerMenu: React.FC<DrawerMenuProps> = ({ navigation, containerStyle, iconType = 'font-awesome-5', iconName, iconSize = 25, textMenu, screenName, screenParams={}, disabled }) => {

    return (
        <TouchableOpacity
            onPress={() => navigation?.navigate(screenName, screenParams)}
            disabled={disabled}
            style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50 mb-2 border-b-0`, containerStyle ]}>
            <Icon type={iconType} name={iconName} size={iconSize} color='#CCC' />
            <DrawerMenuText disabled={disabled} text={textMenu} />
        </TouchableOpacity>
    )
}

export default DrawerMenu;