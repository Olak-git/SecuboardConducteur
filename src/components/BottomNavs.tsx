import { CommonActions } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

const BottomLink: React.FC<{ iconType?: string, iconName: string, screen: string, navigation?: any, path?: string, params?: any, resetHistory?: boolean }> = ({ iconType = 'font-awesome-5', iconName, screen, navigation, path, params, resetHistory }) => {

    const onHandleNavigation = () => {
        if(resetHistory) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            // @ts-ignore
                            name: path, 
                            params: {...params}
                        }
                    ]
                })
            )
        } else {
            navigation?.navigate(path, {...params})
        }
    }

    return (
        <Pressable
            onPress={onHandleNavigation}
        >
            <Icon 
                type={iconType}
                name={iconName}
                color='#FFFFFF'
                size={30}/>
            <Text style={[ tw`text-white text-xs` ]}>{ screen }</Text>
        </Pressable>
    )
}

interface BottomNavsProps {
    navigation: any,
    resetHistory?: boolean
}
const BottomNavs: React.FC<BottomNavsProps> = ({navigation, resetHistory}) => {
    return (
        <View style={[ tw`flex-row items-center justify-around bg-slate-900 rounded-lg`, {height:70} ]}>
            <BottomLink iconType='entypo' iconName='home' screen='Accueil' navigation={navigation} path='DashHome' />
            <BottomLink iconName='car-alt' screen='Course' navigation={navigation} path='DashHistoriqueCourse' />
            <BottomLink iconName='user-friends' screen='Covoiturage' navigation={navigation} path='DashHistoriqueCovoiturage' />
            <BottomLink iconName='calendar-alt' screen='Réservation' navigation={navigation} path='DashHistoriqueReservation' />
        </View>
    )
}

export default BottomNavs;