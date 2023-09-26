import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';

interface RowProps {
    iconType: string,
    iconName: string,
    iconSize?: number,
    textStyle?: any,
    text: string,
    _text?: React.ReactElement
}
const Row: React.FC<RowProps> = ({ iconType, iconName, iconSize = 30, textStyle = [], text, _text }) => {
    return (
        <View style={[ tw`flex-row items-center mb-3` ]}>
            <View style={[ tw``, {width: 50} ]}>
                <Icon
                    type={iconType}
                    name={iconName}
                    color='#666'
                    size={iconSize} />
            </View>
            <Text style={[ tw`text-gray-600 font-semibold text-lg mx-2` ]}>:</Text>
            <View style={[ tw`flex-1`, {} ]}>
                <Text style={[ tw`text-black font-medium text-lg`, ...textStyle ]}>{ text }{_text}</Text>
            </View>
        </View>
    )
}

interface DetailsReservationViewProps {
    navigation: any,
    route: any
}
const DetailsReservationView: React.FC<DetailsReservationViewProps> = (props) => {

    const {navigation, route} = props;
    const course = route.params.course;

    useEffect(() => {
        console.log(course);
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Détails' />
            <View style={[ tw`flex-row mt-10 px-10` ]}>
                <Image 
                    source={{ uri: course.image }}
                    style={[ tw`rounded-full`, { width: 60, height: 60 }]} />
                <View style={[ tw`flex-1` ]}>
                    <Text style={[ tw`ml-4 mb-3 text-lg text-black font-bold` ]}>{ course.nom.toUpperCase() + ' ' + course.prenom }</Text>
                    <Row iconType='material-community' iconName='map-marker-outline' iconSize={25} textStyle={[{color: ColorsEncr.main}]} text={course.from + ' - ' + course.to} />
                    <Row iconType='font-awesome-5' iconName='calendar-alt' iconSize={20} text={course.dat} />
                    <Row iconType='font-awesome-5' iconName='history' iconSize={20} text={'12h'} />
                    <Row iconType='antdesign' iconName='user' iconSize={23} text={course.place} _text={
                        <Text style={[ tw`font-normal` ]}> Personnes</Text>
                    } />
                </View>
            </View>
            <View style={[ tw`px-10 mt-4` ]}>
                <TouchableOpacity
                    style={[ tw`p-3 rounded`, {backgroundColor: ColorsEncr.main}]}>
                    <Text style={[ tw`text-center font-semibold text-black text-lg uppercase` ]}>accepter</Text>
                </TouchableOpacity>
            </View>
        </Base>
    )

}

export default DetailsReservationView;