import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ActivityLoading } from '../../../components/ActivityLoading';
import Header from '../../../components/Header';
import { Divider, Icon } from '@rneui/base';
import { ColorsEncr } from '../../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency, windowWidth } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setDisponibiliteCourse, setDisponibiliteReservation } from '../../../feature/init.slice';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';
import { google_maps_apikey } from '../../../data/data';
import { setReload } from '../../../feature/reload.slice';
import { addCourse, addReservation, deleteCourse, deleteReservation } from '../../../feature/course.slice';
import Geocoder from 'react-native-geocoding';
import { Wave, Wave1, Wave2, Wave3, Wave4 } from '../../../assets';

Geocoder.init(google_maps_apikey, {language : "fr"});

interface FinitionViewProps {
    navigation: any,
    route: any
}
const FinitionView: React.FC<FinitionViewProps> = ({ navigation, route }) => {

    const { course, category } = route.params;

    const courses = useSelector((state: any) => state.course.coords);

    const courseSlice = category == 'ci' ? courses.course : courses.reservation;

    const { passager } = course;

    const avatar = passager.img ? {uri: baseUri + '/assets/avatars/' + passager.img} : require('../../../assets/images/user-1.png');
    
    const [visible, setVisible] = useState(true);

    const [distance, setDistance] = useState<string|undefined>(undefined);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [startFetch, setStartFetch] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [tarif, setTarif] = useState(course.prix);

    const [configuration, setConfiguration] = useState<any>(null);

    const goHome = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Drawer'}]
            })
        )
    }

    const finishingCourse = async () => {
        // @ts-ignore
        let d = distance.replace(/,/g, '.');
        let D = parseFloat(d);
        if(d.indexOf('km') == -1) {
            D = D * 0.01;
        }
        const prix = course.type_voiture.tarif_course_km * D;
        setTarif(prix);
        console.log('Prix=> ', prix);

        const formData = new FormData();
        formData.append('js', null);
        formData.append(category == 'ci' ? 'upd-state-course' : 'upd-state-reservation', 'end');
        formData.append('token', user.slug);
        formData.append('course', course.slug);
        formData.append('nb_km_parcouru', D);
        // console.log('FormData: ', formData);
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
                // console.log('JSON: ', json);
                setConfiguration(json.configuration);
                // dispatch(deleteCourse(course.slug))
                // dispatch(setReload());
                setVisible(false)
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('FinitionView Error1: ', error)
        })
    }

    const getDistance = () => {
        const {latitude: lat1, longitude: lng1} = courseSlice[course.slug]['origin'];
        const {latitude: lat2, longitude: lng2} = courseSlice[course.slug]['end'];
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${lat1},${lng1}&destinations=${lat2},${lng2}&key=${google_maps_apikey}`, {
            method: 'POST'
        })
        .then(resp => resp.json())
        .then(json => {
            if(json.rows[0].elements[0].status.toLowerCase() == 'ok') {
                setDistance(json.rows[0].elements[0].distance.text);
            }
            // console.log('Resp: ', json.rows[0].elements[0])
        })
        .catch(e => console.log('FinitionView Error2: ', e))
    }

    const controller = async () => {
        if(Object.keys(courseSlice[course.slug]).indexOf('origin') !== -1) {
            setEndFetch(true);
        } else {
            await Geocoder.from(course.adresse_depart)
            .then(async json => {
                let location = json.results[0].geometry.location;
                if(category == 'ci') {
                    await dispatch(addCourse({[course.slug]: {origin: {latitude: location.lat, longitude: location.lng}}}));
                } else if(category == 'reservation') {
                    await dispatch(addReservation({[course.slug]: {origin: {latitude: location.lat, longitude: location.lng}}}));
                }
                setEndFetch(true);
            })
            .catch(error => {
                console.warn('FinitionView Error3: ', error)
            });
        }
    }

    useEffect(() => {
        // DeviceEventEmitter.removeAllListeners();
        DeviceEventEmitter.removeAllListeners("event.acceptCourse")
        // DeviceEventEmitter.removeAllListeners("event.onCourse")
        DeviceEventEmitter.emit('event.cleartimer');
        return () => {
            // DeviceEventEmitter.removeAllListeners("event.cleartimer")
        }
    }, [])

    useEffect(() => {
        // console.log('Course: ', course);
        // console.log('Tarif: ', tarif);
        if(distance) {
            if(category == 'ci') {
                dispatch(deleteCourse(course.slug));
            } else if(category == 'reservation') {
                dispatch(deleteReservation(course.slug));
            }
            finishingCourse();
        } else {
            if(endFetch) {
                getDistance();
            } else {
                controller();
            }
        }
    }, [distance, endFetch])

    return (
        <Base>
            {visible
            ?
                <ActivityLoading />
            :
            <>
                <View style={[tw``,{position: 'absolute', top: -2, left: -5, width: windowWidth + 10, height: 90}]}>
                    <Wave4 />
                </View>
                <ScrollView contentContainerStyle={tw`px-5 pt-5`}>
                    <View style={tw`mb-5`}>
                        <Text style={[tw`text-center text-black`,{fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>Course Terminée</Text>
                        <View style={tw`mt-2 px-10`}>
                            <Divider color='gray' />
                        </View>
                    </View>
                    <View style={[tw``]}>
                        <View style={[tw`flex-row items-start mb-2`]}>
                            <Icon type='font-awesome' name='circle-thin' size={22} containerStyle={[tw``, {width: 30}]} />
                            <View style={[tw`ml-2`]}>
                                <Text style={tw`text-gray-500`}>Point de départ</Text>
                                <Text style={[tw`text-black`, {}]}>{course.adresse_depart}</Text>
                            </View>
                        </View>
                        <View style={[tw`flex-row items-start mb-2`]}>
                            <Icon type='font-awesome-5' name='map-marker-alt' color={'red'} containerStyle={[tw``, {width: 30}]} />
                            <View style={[tw`ml-2`]}>
                                <Text style={tw`text-gray-500`}>Point d'arrivé</Text>
                                <Text style={[tw`text-black`, {}]}>{course.adresse_arrive}</Text>
                            </View>
                        </View>
                    </View>

                    {/* <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{distance}</Text>
                            </View>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{duration}</Text>
                            </View>
                        </View> */}

                    <View style={tw`items-center mt-5`}>
                        <Icon type='font-awesome-5' name='car-alt' size={35} reverse />
                        <Text style={tw`mb-2 text-black`}>Distance du trajet parcouru</Text>
                        <Text style={[tw`text-black text-xl font-bold`]}>{distance}</Text>
                    </View>

                    <View style={tw`mt-5 px-10`}>
                        <Divider color='gray' />
                    </View>

                    <View style={tw`items-center mt-2`}>
                        <Text style={tw`mb-2 text-black`}>Tarif de la course</Text>
                        <Text style={[tw`text-black text-2xl font-black bg-gray-100 p-4`]}>{getCurrency(tarif)} FCFA</Text>
                    </View>
                    <View style={tw`items-center mt-4`}>
                        <Icon type='material-community' name='chat-question' size={25} />
                        <Text style={tw`mb-2 text-black`}>Il sera prélevé de votre portefeuille {configuration ? configuration.commission_course : 'x'}% du tarif de la course.</Text>
                    </View>

                    <View style={tw`mt-5 px-10`}>
                        <Divider color='gray' />
                    </View>

                    <View style={tw`mt-4`}>
                        <Text style={tw`text-black font-bold`}>Passager:</Text>
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text style={tw`text-black`}>{passager.nom} {passager.prenom}</Text>
                            <Text style={tw`text-black`}>{passager.tel}</Text>
                        </View>
                        {configuration && (
                            <Pressable
                                onPress={() => navigation.navigate('DashNotationPassager', { passager: passager })}
                                style={tw`mt-3`}
                            >
                                <Text style={tw`text-red-800`}>Notez votre passager</Text>
                            </Pressable>
                        )}
                    </View>

                </ScrollView>
                <View style={[tw`flex-row px-5 justify-center items-center`, { height: 90 }]}>
                    {configuration
                        ?
                        <>
                            <RNDivider size={3} color='rgb(15, 23, 42)' containerSize={useWindowWidth / 3} />
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={goHome}
                                style={[tw`justify-center items-center rounded-full border border-slate-900 mx-2`, { width: 70, height: 70 }]}
                            >
                                <Icon type='entypo' name='home' color='rgb(15, 23, 42)' size={30} reverse />
                            </TouchableOpacity>
                            <RNDivider size={2} color='rgb(15, 23, 42)' containerSize={useWindowWidth / 3} />
                        </>
                        : <ActivityIndicator color='#cccccc' />
                    }
                </View> 
            </>   
            }
        </Base>
    )
}

export default FinitionView;