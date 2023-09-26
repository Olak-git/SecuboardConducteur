import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Icon } from '@rneui/base';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { Rating } from 'react-native-ratings';
import { useSelector } from 'react-redux';

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

interface DetailsCovoiturageViewProps {
    navigation: any,
    route: any
}
const DetailsCovoiturageView: React.FC<DetailsCovoiturageViewProps> = (props) => {

    const {navigation, route} = props;

    const [course, setCourse] = useState(route.params.course);

    const { passager, covoiturage } = course;

    const path = passager.img ? {uri: baseUri + '/assets/avatars/' + passager.img} : require('../../../assets/images/user-1.png');

    const user = useSelector((state: any) => state.user.data);

    const reload = useSelector((state: any) => state.reload.value);

    const [rating, setRating] = useState(0);

    const getDataUser = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('data-user', passager.slug);
        formData.append('token', user.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                setRating(json.scores);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('DetailsCovoiturageView Error: ', error);
        })
    }

    useEffect(() => {
        getDataUser();
    }, [reload])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Détails/Covoiturage' />
            <ScrollView>
                <View style={[ tw`flex-row border-b border-t border-gray-200 px-3 py-2`, {} ]}>
                    <Image
                        source={path}
                        style={[ tw`rounded-full mr-2 border-2`, {width: 70, height: 70, borderColor: ColorsEncr.main}]}
                    />
                    <View style={tw`flex-1 pt-1`}>
                        <Text style={tw`text-black`}>{passager.nom.toUpperCase() + ' ' + passager.prenom }</Text>
                    </View>

                    <Rating
                        type='custom'
                        readonly
                        startingValue={3}
                        ratingCount={5}
                        imageSize={20}
                        // ratingColor={ColorsEncr.main}
                        ratingBackgroundColor='#c8c7c8'
                    />
                </View>

                <View style={tw`border-b border-gray-200 px-3 py-4`}>
                    <View style={[ tw`flex-row items-center mb-3` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color='green' containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400` ]}>{course.adresse_depart}</Text>
                    </View>
                    <View style={[ tw`flex-row items-center` ]}>
                        <Icon type='font-awesome-5' name='map-marker-alt' color={ColorsEncr.main} containerStyle={tw`mr-2 self-start`} />
                        <Text style={[ tw`flex-1 text-gray-400` ]}>{course.adresse_arrive}</Text>
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-5` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{course.nb_km} km</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{'1h 45m'}</Text>
                        </View>
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>
                    <View style={tw`flex-1 justify-between items-center`}>
                        <Icon type='font-awesome-5' name='calendar-alt' color={ColorsEncr.main} />
                        <Text style={tw`text-black font-bold`}>{ covoiturage.date_course}</Text>
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                        <Text style={tw`text-black font-bold`}>{ covoiturage.heure_course}</Text>
                    </View>
                </View>

                <View style={tw`flex-row justify-between border-b border-gray-200 px-3 py-4`}>

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>{course.nb_place} Passager(s)</Text>
                        <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                    </View>

                    <Divider orientation='vertical' />

                    <View style={tw`flex-1 justify-between items-center`}>
                        <Text style={tw`text-black font-bold`}>Prix</Text>
                        <Text style={[ tw`text-lg`, {color: ColorsEncr.main} ]}>{getCurrency(covoiturage.mnt)} XOF</Text>
                    </View>

                </View>

            </ScrollView>

        </Base>
    )

}

export default DetailsCovoiturageView;