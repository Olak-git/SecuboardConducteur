import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View , StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { getApiLevel, getReadableVersion, getVersion, useDeviceName, useIsEmulator, useManufacturer } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { ColorsEncr } from '../../assets/styles';
import { setWelcome } from '../../feature/init.slice';

interface WelcomeViewProps {
   navigation: any,
   route: any 
}

const WelcomeView: React.FC<WelcomeViewProps> = (props) => {

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);

    const {welcome: hasGreet} = init;

    const dispatchNavigation = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Presentation'}
                ]
            })
        )
    }

    const onHandle = async () => {
        await dispatch(setWelcome(true))
    }

    useEffect(() => {
        if(hasGreet) {
            dispatchNavigation();
        } else {
            setTimeout(() => {
                onHandle();
            }, 3000);
        }
    }, [hasGreet])

    return (
        <LinearGradient colors={[ColorsEncr.main, '#000000']} style={tw`flex-1`}>
            <StatusBar
                // hidden={hiddenStatusBar}
                backgroundColor={ ColorsEncr.main_sm }
                translucent
            />
            <View style={[ tw`flex-1 justify-center items-center` ]}>
                <Image source={require('../../assets/images/Untitled-design-24-980x551.png')} style={[ tw``, {resizeMode: 'center'} ]} />
                <View style={[ tw`absolute justify-between pt-20 pb-10 left-0 top-0`, {width: '100%', height: '100%'} ]}>
                    <View style={[ tw`` ]}>
                        <Text style={[tw`text-2xl text-white text-center`,{fontFamily: 'YanoneKaffeesatz-Bold'}]}>Bienvenue</Text>
                        <Text style={[ tw`font-medium text-lg uppercase text-white text-center`,{fontFamily: 'YanoneKaffeesatz-Bold'} ]}>sur</Text>
                        <Text style={[ tw`font-medium text-lg uppercase text-white text-center` ]}>Secuboard</Text>
                    </View>
                    <Text style={[ tw`text-center text-2xl text-white`, {fontFamily: 'ShadowsIntoLight-Regular'} ]}>version { getVersion() }</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

export default WelcomeView;