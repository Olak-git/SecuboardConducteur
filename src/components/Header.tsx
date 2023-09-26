import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
// @ts-ignore
import CardView from 'react-native-cardview';

export const HeaderTitle:React.FC<{title?: string}> = ({title}) => {
    return (
        <Text style={[ tw`px-4 text-sm text-black`,{fontFamily: 'Audiowide-Regular'} ]}>{title}</Text>
    )
}

interface HeaderProps {
    navigation: any,
    headerTitle?: string,
    contentLeft?: React.ReactElement,
    content?: React.ReactElement,
    containerContentStyle?: StyleProp<ViewStyle>
}
const Header: React.FC<HeaderProps> = ({navigation, headerTitle, contentLeft, content, containerContentStyle}) => {
    return (
        // '#F4F4F4'
        <View style={[ tw`flex-row items-center px-4 bg-white`, {height: 60, borderBottomWidth: 0.5, borderColor: '#F4F4F4'}, containerContentStyle ]}>
            {contentLeft
            ?
                contentLeft
            :
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon 
                        type='ant-design'
                        name='arrowleft'
                        size={30} />
                </Pressable>   
            }
            {content
            ?
                content
            :
                <HeaderTitle title={headerTitle} />
            }
        </View>
    )
}

export default Header;