import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Base from '../../../components/Base';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { google_maps_apikey, imageMapPath, LATITUDE_DELTA, LONGITUDE_DELTA } from '../../../data/data';
import tw from 'twrnc';
import { locationPermission, getCurrentLocation } from '../../../functions/helperFunction';
import { ActivityLoading } from '../../../components/ActivityLoading';

const timer = require('react-native-timer');

interface ProgramCheminViewProps {
    navigation: any
}
const ProgramCheminView: React.FC<ProgramCheminViewProps> = ({ navigation }) => {
    
    const mapRef = useRef();
    const markerRef = useRef();

    const [currentCoords, setCurrentCoords] = useState(null)

    const [state, setState] = useState({
        startingCords: {
            latitude: 30.7046,
            longitude: 76.7179
        },
        destinationCords: {},
        coordinate: new AnimatedRegion({
            latitude: 30.7046,
            longitude: 76.7179,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        isLoading: false
    });
    const {startingCords, destinationCords, isLoading, coordinate} = state;

    const onCenter = () => {
        // @ts-ignore
        mapRef.current?.animateToRegion({
            ...startingCords,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const animate = (latitude: number, longitude: number) => {
        const newCoordinate = {latitude, longitude};
        if(Platform.OS == 'android') {
            // @ts-ignore
            markerRef.current?.animateMarkerToCoordinate(newCoordinate, 7000)
        } else {
            // @ts-ignore
            coordinate.timing(newCoordinate).start();
        }
    }

    const fetchValues = (data: any) => {
        if(Object.keys(data.pickupCords).length > 0) {
            setState({
                ...state,
                startingCords: {
                    ...data.pickupCords
                }
            })
        }
        setState({
            ...state,
            destinationCords: {
                ...data.destinationCords
            }
        })
    }

    const onPressLocation = () => {
        navigation.navigate('DashChooseLocation', {getCordinates: fetchValues})
    }

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            const res = await getCurrentLocation();
            const {latitude, longitude} = res
            animate(latitude, longitude);
            console.log('CurrentCoordinates: ', res);
            setCurrentCoords(res)
            setState({
                ...state,
                startingCords: {
                    ...startingCords,
                    ...res
                    // latitude: res.latitude,
                    // longitude: res.longitude
                },
                coordinate: new AnimatedRegion({
                    ...coordinate,
                    ...res
                }),
                isLoading: true
            })
        }
    }

    useEffect(() => {
        getLiveLocation()
    }, [])

    useEffect(() => {
        timer.setInterval('live-location', getLiveLocation, 6000);
        return () => {
            timer.clearInterval('live-location');
        }
    })

    return (
        <Base>
            {isLoading 
            ?
                <>
                <View style={{flex: 1}}>
                    <MapView
                        // @ts-ignore
                        ref={mapRef}
                        style={StyleSheet.absoluteFill}
                        initialRegion={{
                            ...startingCords,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}
                        onPress={(e) => {
                            // @ts-ignore
                            setCurrentCoords(e.nativeEvent.coordinate)
                            const {latitude, longitude} = e.nativeEvent.coordinate
                        }}
                    >
                        <Marker.Animated
                            ref={markerRef}
                            tracksViewChanges={true}
                            image={imageMapPath.icUser}
                            // @ts-ignore
                            coordinate={coordinate} />

                        { Object.keys(destinationCords).length > 0 && (
                            <>
                                <Marker 
                                    tracksViewChanges={true}
                                    image={imageMapPath.icCar}
                                    // @ts-ignore
                                    coordinate={destinationCords}
                                    // @ts-ignore
                                    description={destinationCords.address}
                                    // @ts-ignore
                                    title={'T::' + destinationCords.address} />
                                <MapViewDirections
                                    origin={startingCords}
                                    // @ts-ignore
                                    destination={destinationCords}
                                    apikey={ google_maps_apikey }
                                    language='fr'
                                    optimizeWaypoints={true}
                                    // mode='WALKING'
                                    precision='high'
                                    strokeWidth={3}
                                    strokeColor="hotpink"
                                    lineDashPattern={[0]}
                                    onStart={params => {
                                        // {origin, destination, waypoints} = params
                                    }}
                                    onReady={result => {
                                        // {distance, duration, coordinates} = result
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
                                        // console.log(errorMessage);
                                    }}
                                />
                            </>
                        )}
                    </MapView>
                    <TouchableOpacity
                        onPress={onCenter}
                        style={[ tw`absolute rounded bottom-1 right-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Image 
                            source={imageMapPath.icMapCenter}
                            style={{width: 25, height: 25}} />
                    </TouchableOpacity>
                </View>
                <View style={[ tw`bg-white p-8`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
                    <Text style={[ tw`text-black` ]}>Où allez-vous... ?</Text>
                    <TouchableOpacity onPress={onPressLocation}
                        style={[ tw`bg-white p-3 rounded-lg mt-2 border border-gray-200` ]}>
                        <Text style={[ tw`text-center text-black` ]}>
                            Choisissez votre destination
                        </Text>
                    </TouchableOpacity>
                </View>
                </>
            :
                <ActivityLoading loadingText='Chargement en cours...' />
            }
        </Base>
    )
}

export default ProgramCheminView;