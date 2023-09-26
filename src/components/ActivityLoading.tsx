import { Icon } from '@rneui/base';
import React from 'react';
import { ActivityIndicator, Platform, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Spinner from 'react-native-spinkit';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import Base from './Base';

interface ActivityLoadingProps {
    loadingText?: string,
    goBack?: boolean,
    navigation?: any,
    with_activity_indicator?: boolean,
    contentContainerStyle?: StyleProp<ViewStyle>
}
export const ActivityLoading: React.FC<ActivityLoadingProps> = ({ loadingText, goBack, navigation, with_activity_indicator, contentContainerStyle }) => {
    return (
        // <Base>
            <View style={[ tw`rounded-3xl flex-1 justify-center items-center bg-white mt-1`, contentContainerStyle ]}>
                {(Platform.OS !== 'android' && goBack && navigation && navigation.canGoBack()) && (
                    <TouchableOpacity
                        onPress={()=>navigation.goBack()}
                        style={[ tw`absolute rounded top-1 left-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Icon type='ant-design' name='arrowleft' size={20} />
                    </TouchableOpacity>
                )}
                {with_activity_indicator
                    ? <ActivityIndicator color={'silver'} animating />
                    : <Spinner type='Pulse' color={ColorsEncr.main} size={60} />
                }
                {loadingText && (
                    <Text style={[ tw`text-gray-400` ]}>{ loadingText }</Text>
                )}
            </View>
        // </Base>
    )
}