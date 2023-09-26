import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, View, Text, Pressable } from 'react-native';
import { ColorsEncr } from '../assets/styles';
import { baseUri, getCurrency } from '../functions/functions';
import { getLocalDate, getLocalTime, openUrl } from '../functions/helperFunction';
import { Icon } from '@rneui/themed';
import tw from 'twrnc';
// @ts-ignore
import CardView from 'react-native-cardview'
import { Divider } from '@rneui/base';

interface RenderItemCourseInstantaneProps {
    item: any,
    navigation: any,
    routeName: string,
    disabled?: boolean,
    onHandle?: any,
    reservation?: boolean
}

const RenderItemCourseInstantane: React.FC<RenderItemCourseInstantaneProps> = ({item, navigation, routeName, disabled, onHandle=()=>{}, reservation}) => {
    const path = item.passager.img ? {uri: baseUri + '/assets/avatars/' + item.passager.img} : require('../assets/images/user-1.png');
    
    const { etat_course } = item;
    const [color, setColor] = useState('');
    const [state, setState] = useState('');

    const km = item.nb_km_parcouru || item.nb_km_prov;
    const new_version = true;

    // if(item.etat_course == 0) {
    //     setColor('text-gray-500'); setState('En attente');
    // } else if(item.etat_course == 1) {
    //     setColor('text-sky-600 font-semibold'); setState('Validé');
    // } else if(item.etat_course == 10) {
    //     setColor('text-blue-600 font-bold'); setState('En cours');
    // } else {
    //     setColor('text-emerald-700 font-black'); setState('Terminée');
    // }

    const onPress = async () => {
        await onHandle();
        navigation.navigate(routeName, {course: item})
    }

    const onChangeState = () => {
        if(etat_course == 0) {
            setColor('text-gray-500'); setState('En attente');
        } else if(etat_course == 1) {
            setColor('text-sky-600 font-semibold'); setState('Validé');
        } else if(etat_course == 10) {
            setColor('text-blue-600 font-bold'); setState('En cours');
        } else {
            setColor('text-emerald-700 font-black'); setState('Terminée');
        }
    }

    useEffect(() => {
        onChangeState();
    }, [etat_course])

    return (
        new_version
        ?
            <Pressable
                onPress={onPress}
                disabled={disabled}
                style={[ tw`mb-4` ]}>
                <CardView cardElevation={5} cardMaxElevation={8} cornerRadius={6}>
                    <View style={[tw`flex-row justify-between items-center p-2 bg-neutral-50`,{}]}>
                        <Image source={path} style={[ tw`bg-red-600 rounded-lg`, {backgroundColor: '#FFF', height: 55, width: 55} ]} />
                        <View style={tw`ml-2 flex-1`}>
                            <Text style={[ tw`text-black text-base font-medium mb-1`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.passager.nom + ' ' + item.passager.prenom }</Text>
                            <View style={tw`flex-row items-center`}>
                                <CardView cardElevation={2} cardMaxElevation={8} cornerRadius={30}>
                                    <Icon type='font-awesome-5' name='phone' size={15} containerStyle={tw`p-2`} iconStyle={tw``} />
                                </CardView>
                                <Text style={tw`text-xs text-black font-bold ml-1`} onPress={() => openUrl(`tel:${item.passager.tel}`)}>{item.passager.tel}</Text>
                                {/* <Text style={tw`rounded-xl bg-amber-400 px-3 text-xs text-black font-bold`} onPress={() => openUrl(`tel:${item.passager.tel}`)}>{item.passager.tel}</Text> */}
                            </View>
                            {/* <Text style={[ tw`text-sm pl-1 mt-2 ${color}`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{state}</Text> */}
                        </View>
                        <View style={tw`items-end`}>
                            <Text style={[ tw`font-medium text-base text-black` ]}>{ getCurrency(item.prix) } F</Text>
                            <Text style={[tw`text-xs text-gray-400`, {}]}>{km.toString().replace('.', ',')} km</Text>
                        </View>
                    </View>
                    <View style={tw`p-2`}>
                        <View style={tw`py-1 mb-1`}>
                            <Text style={tw`font-bold text-gray-300`}>Départ</Text>
                            <View style={tw`flex-row`}>
                                {/* <Icon type='font-awesome' name='circle-thin' size={15} color='gray' containerStyle={[tw``, {width: 20}]} /> */}
                                <Text style={[ tw`flex-1 text-black`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_depart }</Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={tw`py-1 mb-1`}>
                            <Text style={tw`font-bold text-gray-300`}>Destination</Text>
                            <View style={tw`flex-row`}>
                                {/* <Icon type='material-community' name={'map-marker-outline'} size={18} color='#ff2222' containerStyle={[tw``, {width: 20}]} /> */}
                                <Text style={[ tw`flex-1 text-black`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_arrive }</Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={tw`py-1 mt-1`}>
                            <View style={tw`flex-row`}>
                                <Text style={tw`rounded-xl bg-amber-400 px-3 py-1 text-black font-bold italic mb-0`}>{reservation?getLocalDate(item.date_depart):getLocalDate(item.dat)} {reservation?item.heure_depart.slice(0, 5):getLocalTime(item.dat)}</Text>
                                <Text style={tw`mx-2`}></Text>
                                <Text style={tw`rounded-xl bg-cyan-400 px-3 py-1 text-black font-bold mb-0`}>{state}</Text>
                            </View>
                            {/* <Text style={[ tw`text-sm pl-1`, {color: ColorsEncr.main} ]} numberOfLines={1} ellipsizeMode='tail'>{getLocalDate(item.dat)} {getLocalTime(item.dat)}</Text>
                            <Text style={[ tw`text-sm pl-1 ${color}`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{state}</Text> */}
                        </View>
                    </View>

                    {disabled && (
                        <View style={tw`p-2`}>
                            <Divider />
                            <Text style={tw`my-2 text-red-600 text-xs`}>Votre solde est insuffisant pour accepter cette course. Veuillez recharger votre portefeuille.</Text>
                            <Divider />
                        </View>
                    )}
                </CardView>
                {disabled && (
                    <Icon type="material-community" name="key-chain" containerStyle={[tw`absolute top-0 right-0`,{top:-10}]} />
                )}
            </Pressable>
        :
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                style={[ tw`flex-row mb-3` ]}>
                <Image
                    source={path}
                    style={[ tw`rounded-full`, {height: 60, width: 60} ]} />
                <View style={[ tw`flex-1 flex-row items-start justify-between ml-3` ]}>
                    <View style={[ tw`flex-1 border border-white` ]}>
                        <Text style={[ tw`text-black text-base font-medium`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.passager.nom + ' ' + item.passager.prenom }</Text>
                        <View style={[ tw`` ]}>
                            <View style={tw`flex-row mb-1`}>
                                <Icon type='font-awesome' name='circle-thin' size={15} color='gray' containerStyle={[tw``, {width: 20}]} />
                                <Text style={[ tw`flex-1 text-gray-400 text-xs`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_depart }</Text>
                            </View>
                            <View style={tw`flex-row`}>
                                <Icon type='material-community' name={'map-marker-outline'} size={18} color='#ff2222' containerStyle={[tw``, {width: 20}]} />
                                <Text style={[ tw`flex-1 text-gray-400 text-xs`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.adresse_arrive }</Text>
                            </View>
                        </View>
                        <Text style={[ tw`text-sm pl-1`, {color: ColorsEncr.main} ]} numberOfLines={1} ellipsizeMode='tail'>{getLocalDate(item.dat)} {getLocalTime(item.dat)}</Text>
                        <Text style={[ tw`text-sm pl-1 ${color}`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{state}</Text>
                    </View>
                    <View style={[ tw`ml-3` ]}>
                        <Text style={[ tw`font-medium text-base text-gray-400` ]}>{ getCurrency(item.prix) } F</Text>
                        {disabled && (
                            <Icon type="material-community" name="key-chain" />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
    )
}

export default RenderItemCourseInstantane;