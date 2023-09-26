import React from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import { getCurrency, getDate, windowHeight } from '../../../functions/functions';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';

interface EndCourseViewProps {
    navigation: any,
    route: any
}
const EndCourseView: React.FC<EndCourseViewProps> = ({ navigation, route }) => {

    const { adresse_depart, adresse_arrive, nb_km_prov, nb_place, date_depart, heure_depart, type_voiture, prix, duration, action } = route.params;

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const goHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Drawer'}]
            })
        )
    }
    
    return (
        <Base>

            <ScrollView>

                <View style={[ tw`bg-white pt-8 px-5` ]}>

                    <View style={[ tw`` ]}>
                        <View style={[ tw`flex-row items-start mb-2` ]}>
                            <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`pt-1 pl-1 pr-2`} />
                            <View style={[ tw`ml-2` ]}>
                                <Text style={tw`text-gray-500`}>Point de départ</Text>
                                <Text style={[ tw`text-black`, {} ]}>{adresse_depart}</Text>
                            </View>
                        </View>
                        <View style={[ tw`flex-row items-start mb-2` ]}>
                            <Icon type='material-community' name='map-marker-outline' size={25} color={'red'} containerStyle={tw`pt-1`} />
                            <View style={[ tw`ml-2` ]}>
                                <Text style={tw`text-gray-500`}>Point d'arrivé</Text>
                                <Text style={[ tw`text-black`, {} ]}>{adresse_arrive}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{nb_km_prov}</Text>
                        </View>
                        <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                            <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                            <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                            <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{duration}</Text>
                        </View>
                    </View>

                    {action == 'reservation'
                    ?
                        <>
                            {/* <View style={tw`flex-row px-2 mt-5 mb-3`}>
                                <Text style={tw`text-black font-bold`}>Date: </Text>
                                <Text style={tw`text-black`}>{(new Date(date_depart)).toLocaleString('fr-FR', {weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'})} à { heure_depart }</Text>
                            </View> */}

                            <View style={tw`flex-row mt-10 mb-5 justify-between border-b border-t border-gray-200 px-3 py-4`}>

                                <View style={tw`flex-1 justify-between items-center`}>
                                    <Text style={tw`text-black font-bold`}>{ nb_place } Passager(s)</Text>
                                    <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                                </View>

                                <Divider orientation='vertical' />

                                <View style={tw`flex-1 justify-between items-center`}>
                                    <Text style={tw`text-black font-bold text-center`}>{ date_depart } { heure_depart }</Text>
                                    <Icon type='font-awesome-5' name='history' color={ColorsEncr.main} />
                                </View>

                                <Divider orientation='vertical' />

                                <View style={tw`flex-1 justify-between items-center`}>
                                    <View style={[ tw`flex-row justify-center items-center` ]}>
                                        <Icon type='material-community' name='approximately-equal' containerStyle={[ tw`mr-1` ]} />
                                        <Text style={tw`text-black font-bold`}>Prix</Text>
                                    </View>
                                    {/* <Text style={tw`text-black font-bold`}>Prix</Text> */}
                                    <Text style={[ tw`text-lg`, {color: ColorsEncr.main} ]}>{ getCurrency(prix) } XOF</Text>
                                </View>

                            </View>
                        </>
                    :
                        action == 'course' && (
                            <>
                                <View style={tw`items-center mt-2`}>
                                    <Text style={tw`text-black font-bold`}>{ nb_place } Passager(s)</Text>
                                    <Icon type='ant-design' name='user' color={ColorsEncr.main} />
                                </View>

                                <View style={[ tw`flex-row mt-10 mb-3 justify-center items-center border-t border-b border-slate-300 rounded-2xl py-1 px-3` ]}>
                                    <Icon type='material-community' name='approximately-equal' size={40} color={ColorsEncr.main} containerStyle={[ tw`mr-1` ]} />
                                    <Text style={[ tw`text-black text-lg font-bold` ]}>{ getCurrency(prix) } XOF</Text>
                                </View>
                            </>
                        )
                    }

                    <View style={tw`items-center`}>
                        <Text style={tw`text-center text-black text-lg`}>Recherche de Taxi...</Text>
                        <Spinner isVisible={true} size={30} color={'black'} type='ThreeBounce' />
                        <Text style={tw`text-center text-gray-500 mb-3`}>
                            {action == 'reservation'
                            ?
                                `Votre réservation a bien été enregistrée. Vous serez notifié sur les différentes étapes d'exécution de celle-ci`
                            :
                                `Veuillez patienter. Un taxi plus proche de vous acceptera votre course et se rendra au point de départ.`
                            }                            
                        </Text>
                    </View>

                    <View style={tw`flex-1 justify-center items-center py-10`}>
                        <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='WanderingCubes' />
                    </View>

                </View>

            </ScrollView>

            <View style={[ tw`flex-row px-5 justify-center items-center`, {height: 90} ]}>
                <RNDivider size={3} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
                <Pressable
                    onPress={goHome}
                    style={[ tw`justify-center items-center rounded-full border border-slate-900 mx-2`, {width: 70, height:70} ]}
                >
                    <Icon 
                        type='entypo'
                        name='home'
                        color='rgb(15, 23, 42)'
                        size={30}
                        reverse
                    />
                </Pressable>
                <RNDivider size={2} color='rgb(15, 23, 42)' containerSize={useWindowWidth/3} />
            </View>

        </Base>
    )
}

export default EndCourseView;