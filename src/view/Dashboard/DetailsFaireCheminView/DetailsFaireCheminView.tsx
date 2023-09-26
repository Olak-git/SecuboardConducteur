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
            <View style={[ tw`flex-1` ]}>
                <Text style={[ tw`text-black font-medium text-lg`, ...textStyle ]}>{ text }{_text}</Text>
            </View>
        </View>
    )
}

interface DetailsFaireCheminViewProps {
    navigation: any,
    route: any
}
const DetailsFaireCheminView: React.FC<DetailsFaireCheminViewProps> = (props) => {

    const {navigation, route} = props;
    const course = route.params.course;

    useEffect(() => {
        console.log(course);
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Détails' />
            <View style={[ tw`flex-1 mt-10 px-10` ]}>
                <Row iconType='material-community' iconName='map-marker-outline' textStyle={[{color: ColorsEncr.main}]} text={course.from + ' - ' + course.to} />
                <Row iconType='font-awesome-5' iconName='calendar-alt' iconSize={20} text={course.dat} />
                <Row iconType='font-awesome-5' iconName='history' iconSize={20} text={'12h'} />
                <Row iconType='antdesign' iconName='user' iconSize={23} text={course.place_dispo} _text={
                    <Text style={[ tw`font-normal` ]}> Places</Text>
                } />
                <Row iconType='font-awesome-5' iconName='wallet' iconSize={25} text={'4500 F'} />
            </View>
        </Base>
    )

}

export default DetailsFaireCheminView;