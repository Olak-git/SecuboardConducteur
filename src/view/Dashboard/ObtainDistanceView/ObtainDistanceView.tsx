import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import Base from '../../../components/Base';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { google_maps_apikey, imageMapPath, LATITUDE_DELTA, LONGITUDE_DELTA } from '../../../data/data';
import tw from 'twrnc';
import { locationPermission, getCurrentLocation } from '../../../functions/helperFunction';
import { ActivityLoading } from '../../../components/ActivityLoading';
import Header from '../../../components/Header';
import { Divider, Icon } from '@rneui/base';
import { ColorsEncr } from '../../../assets/styles';
import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogCovoiturage } from '../../../feature/dialog.slice';
import RNMarker from '../../../components/RNMarker';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setDisponibiliteCourse, setDisponibiliteReservation } from '../../../feature/init.slice';
import Spinner from 'react-native-spinkit';
import { RNDivider } from '../../../components/RNDivider';
import { CommonActions } from '@react-navigation/native';
import { setReload } from '../../../feature/reload.slice';
import { deleteCourse } from '../../../feature/course.slice';

Geocoder.init(google_maps_apikey, {language : "fr"});

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface RenderItembuttonChoiceLocationProps {
    callAction: any,
    data: any,
    stateCoords: any
}

const BottomButton: React.FC<{buttonTitle: string, pressAction?: any}> = ({buttonTitle, pressAction}) => {
    return (
        <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
            <View style={[ tw`px-30 my-3` ]}>
                <Divider />
            </View>
            <View style={[ tw`px-8` ]}>
                <TouchableOpacity
                    onPress={pressAction}
                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                    <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>{buttonTitle}</Text>
                </TouchableOpacity>
            </View>    
        </View>
    )
}

interface ObtainDistanceViewProps {
    navigation: any,
    route: any
}
const ObtainDistanceView: React.FC<ObtainDistanceViewProps> = ({ navigation, route }) => {

    const mapRef = useRef();
    const markerRef = useRef();
    const flatRef = useRef(null);

    const { course, category } = route.params;

    const courses = useSelector((state: any) => state.course.coords);

    const courseSlice = category == 'ci' ? courses.course : courses.reservation;

    // console.log('courseSlice => ', courseSlice);

    const { passager } = course;

    const avatar = passager.img ? {uri: baseUri + '/assets/avatars/' + passager.img} : require('../../../assets/images/user-1.png');
    
    const [visible, setVisible] = useState({
        modal: false,
        description_start: false,
        description_end: false
    });

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const dispatch = useDispatch();

    const [startFetch, setStartFetch] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [distance, setDistance] = useState<string|undefined>(undefined);

    const [duration, setDuration] = useState('0 s');

    const [tarif, setTarif] = useState(course.prix);

    const [state, setState] = useState({
        startingCords: {
            ...courseSlice[course.slug]['origin']
        },
        destinationCords: {
            ...courseSlice[course.slug]['end']
        },
        coordinate: new AnimatedRegion({
            ...courseSlice[course.slug]['origin'],
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        isLoading: false
    });

    const {startingCords, destinationCords, isLoading, coordinate} = state;

    const goFinitionScreen = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'DashFinition', params: {course: course, category: category, distance: distance}}]
            })
        )
    }

    // useEffect(() => {
    //     // DeviceEventEmitter.emit('event.cleartimer');
    //     DeviceEventEmitter.emit('event.cancelLoad');
    //     return () => {
    //         // DeviceEventEmitter.removeAllListeners("event.cleartimer")
    //         DeviceEventEmitter.removeAllListeners("event.cancelLoad")
    //     }
    // }, [])


    const getDistance = () => {
        const {latitude: lat1, longitude: lng1} = courseSlice[course.slug]['origin'];
        const {latitude: lat2, longitude: lng2} = courseSlice[course.slug]['end'];
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${lat1},${lng1}&destinations=${lat2},${lng2}&key=${google_maps_apikey}`, {
            method: 'POST'
        })
        .then(resp => resp.json())
        .then(json => console.log('Resp: ', json.rows[0].elements[0]))
        .catch(e => console.log('ObtainDistanceView Error: ', e))
    }

    useEffect(() => {
        getDistance();
        if(endFetch && distance) {
            console.log('Distance: ', distance);
            // goFinitionScreen();
        }
    }, [endFetch, distance])

    return (
        <Base>
            
            <View style={[tw`justify-center items-center bg-white`, StyleSheet.absoluteFill, { zIndex: 1 }]}>
                <ActivityIndicator
                    size={'large'}
                    color={ColorsEncr.main}
                    animating />
                <Text style={[tw`text-gray-400`]}>Traitement des données en cours...</Text>
            </View>

            <View style={{ flex: 1 }}>
                <MapView
                    // @ts-ignore
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    // @ts-ignore
                    initialRegion={
                        Object.keys(startingCords).length > 0
                            ?
                            {
                                ...startingCords,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }
                            :
                            undefined
                    }
                >
                    <Marker.Animated
                        // ref={markerRef}
                        // image={imageMapPath.icUser}
                        // @ts-ignore
                        coordinate={coordinate}
                        // coordinate={startingCords}
                        // onPress={() => setVisible((state) => ({ ...state, description_start: !visible.description_start }))}
                    />

                    {Object.keys(destinationCords).length > 0 && (
                        <>
                            <Marker
                                tracksInfoWindowChanges={true}
                                // image={imageMapPath.icCar}
                                // @ts-ignore
                                coordinate={destinationCords}
                                // onPress={() => setVisible((state) => ({ ...state, description_end: !visible.description_end }))}
                            />

                            {/* @ts-ignore */}
                            <MapViewDirections
                                origin={startingCords}
                                // @ts-ignore
                                destination={destinationCords}
                                apikey={google_maps_apikey}
                                language='fr'
                                optimizeWaypoints={true}
                                mode='DRIVING' //'WALKING'
                                precision='high'
                                strokeWidth={5}
                                strokeColor="hotpink"
                                lineDashPattern={[0]}
                                onStart={params => {
                                    // console.log('Params', params);
                                    // {origin, destination, waypoints} = params
                                }}
                                onReady={result => {
                                    const { distance, duration, coordinates, legs } = result
                                    const data = legs[0];
                                    setEndFetch(true);
                                    console.log('ResultXXX: ', result);
                                    setDistance(data.distance.text);
                                    setDuration(data.duration.text.replace(/heures?/g, 'h').replace(/minutes?/g, 'm').replace(/secondes?/g, ''))
                                    // @ts-ignore
                                    mapRef.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: 30,
                                            bottom: 300,
                                            left: 30,
                                            top: 100
                                        }
                                    })
                                }}
                                onError={errorMessage => {
                                    console.log(errorMessage);
                                }}
                            />
                        </>
                    )}
                </MapView>
            </View>
        </Base>
    )
}

export default ObtainDistanceView;