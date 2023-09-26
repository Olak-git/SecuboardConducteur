import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Pressable, ScrollView, useWindowDimensions, FlatList, Dimensions, StatusBar, DeviceEventEmitter, Modal } from 'react-native';
import Base from '../../../components/Base';
import MapView, { AnimatedRegion, MapWMSTile, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { google_maps_apikey, imageMapPath, LATITUDE_DELTA, LONGITUDE_DELTA } from '../../../data/data';
import tw from 'twrnc';
import { locationPermission, getCurrentLocation, getErrorsToString } from '../../../functions/helperFunction';
import { ActivityLoading } from '../../../components/ActivityLoading';
import Header from '../../../components/Header';
import { Divider, Icon } from '@rneui/base';
import { ColorsEncr } from '../../../assets/styles';
import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogCovoiturage } from '../../../feature/dialog.slice';
import RNMarker from '../../../components/RNMarker';
import { fetchUri, toast } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setDisponibiliteCourse, setDisponibiliteReservation } from '../../../feature/init.slice';
import { addCourse, setCourse as setCourseSlice, addReservation, setReservation } from '../../../feature/course.slice';
import { CommonActions } from '@react-navigation/native';
import { refreshCourse, refreshCovoiturage, refreshReservation } from '../../../feature/refresh.slice';
import { Button } from 'react-native-paper';
import { SwipeablePanel } from 'rn-swipeable-panel';

const timer = require('react-native-timer');

Geocoder.init(google_maps_apikey, {language : "fr"});

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface RenderItembuttonChoiceLocationProps {
    callAction: any,
    data: any,
    stateCoords: any
}
interface BottomButtonProps {
    buttonTitle: string, 
    pressAction?: any,
    loading?: boolean
}
const BottomButton: React.FC<BottomButtonProps> = ({buttonTitle, pressAction, loading=false}) => {
    return (
        <View style={[ tw`bg-white py-4`,  {width: '100%', borderTopEndRadius: 24, borderTopStartRadius: 24} ]}>
            <View style={[ tw`px-30 my-3` ]}>
                <Divider />
            </View>
            <View style={tw`px-4`}>
                <Button mode='contained-tonal' loading={loading} buttonColor='#F4F4F4' onPress={pressAction} style={tw`rounded-sm p-2`}>{buttonTitle}</Button>
                {/* <TouchableOpacity
                    onPress={pressAction}
                    style={[ tw`p-2 rounded-md border border-slate-300`, {}]}>
                    <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>{buttonTitle}</Text>
                </TouchableOpacity> */}
            </View>    
        </View>
    )
}

interface ItineraireViewProps {
    navigation: any,
    route: any
}
const ItineraireView: React.FC<ItineraireViewProps> = ({ navigation, route }) => {

    const mapRef = useRef();
    const markerRef = useRef();
    const flatRef = useRef(null);

    const {disponibilite_course, disponibilite_reservation} = useSelector((state: any) => state.init);

    const [visible, setVisible] = useState({
        modal: false,
        description_start: false,
        description_end: false
    });

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const { category } = route.params;

    const [course, setCourse] = useState(route.params.course);

    const stateCourse = course.etat_course;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const dialog = useSelector((state: any) => state.dialog.covoiturage);

    const init = useSelector((state:any) => state.init);

    const [startFetch, setStartFetch] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [startAddress, setStartAddress] = useState(course.adresse_depart);

    const [endAddress, setEndAddress] = useState(course.adresse_arrive);

    const [distance, setDistance] = useState('0 m');

    const [duration, setDuration] = useState('0 s');

    const [currentCoords, setCurrentCoords] = useState({});
    // curLoc: {latitude: 0,longitude: 0},coordinate: null

    const [state, setState] = useState({
        // startingCords: {
        //     latitude: 6.355457,
        //     longitude: 2.406693
        // },
        startingCords: {},
        destinationCords: {},
        coordinate: new AnimatedRegion({
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        isLoading: false
    });
    const {startingCords, destinationCords, isLoading, coordinate} = state;

    const [layoutHeight, setLayoutHeight] = useState(100);
    const [panelIsActive, setPanelIsActive] = useState(false)
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const closePanel = () => setPanelIsActive(false)
    const openPanel = () => setPanelIsActive(true)

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
        console.log('Data: ', data);
        if(data.hasOwnProperty('pickupCords') && Object.keys(data.pickupCords).length > 0) {
            setState(state => ({
                ...state,
                startingCords: {
                    ...data.pickupCords
                },
                coordinate: new AnimatedRegion({
                    ...coordinate,
                    ...data.pickupCords
                }),
            }));
            setStartAddress(data.pickupCords.address);
            onCenter();
        }
        if(data.hasOwnProperty('destinationCords') && Object.keys(data.destinationCords).length > 0) {
            setState(state => ({
                ...state,
                destinationCords: {
                    ...data.destinationCords
                }
            }));
            setEndAddress(data.destinationCords.address);
        }
    }

    const getCoordonates = async () => {
        await Geocoder.from(startAddress)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('StartCoords: ', location);
            fetchValues({pickupCords: {latitude: location.lat, longitude: location.lng, address: startAddress}});
            // setStartFetch(true);
        })
        .catch(error => {
            console.warn('Error1: ', error)
        });

        await Geocoder.from(endAddress)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('EndCoords: ', location);
            fetchValues({destinationCords: {latitude: location.lat, longitude: location.lng, address: endAddress}});
            // setEndFetch(true);
        })
        .catch(error => {
            console.warn('Error2: ', error)
        });
    }

    const setCf = (action: string, response: any) => {
        if(action == 'start') {
            if(category == 'reservation') {
                dispatch(addReservation({[course.slug]: {origin: response}}))
            } else if(category == 'ci') {
                dispatch(addCourse({ [course.slug]: { origin: response } }))
            }
        } else if(action == 'end') {
            if(category == 'reservation') {
                dispatch(setReservation({[course.slug]: {end: response}}))
            } else if(category == 'ci') {
                dispatch(setCourseSlice({ [course.slug]: { end: response } }))
            }
        }

        if(category == 'ci') {
            dispatch(refreshCourse());
        } else if(category == 'reservation') {
            dispatch(refreshReservation());
        } else if(category == 'covoiturage') {
            dispatch(refreshCovoiturage());
        }
    }

    const onStateCourse = async (action: string) => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            setVisible(state => ({...state, modal: true}));
            const current_location_response = await getCurrentLocation();

            // if(action == 'start') {
            //     if(category == 'reservation') {
            //         dispatch(addReservation({[course.slug]: {origin: current_location_response}}))
            //     } else if(category == 'ci') {
            //         dispatch(addCourse({ [course.slug]: { origin: current_location_response } }))
            //     }
            // } else if(action == 'end') {
            //     if(category == 'reservation') {
            //         dispatch(setReservation({[course.slug]: {end: current_location_response}}))
            //     } else if(category == 'ci') {
            //         dispatch(setCourseSlice({ [course.slug]: { end: current_location_response} }))
            //     }
            // }

            const formData = new FormData();
            formData.append('js', null);
            if(category == 'reservation') {
                formData.append('upd-state-reservation', action);
            } else if(category == 'ci') {
                formData.append('upd-state-course', action);
            } else if(category == 'covoiturage') {
                formData.append('upd-state-covoiturage', action);
            }
            formData.append('token', user.slug);
            formData.append('course', course.slug);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async json => {
                setVisible(state => ({...state, modal: false}));
                if(json.success) {
                    // if(category == 'ci') {
                    //     dispatch(refreshCourse());
                    // } else if(category == 'reservation') {
                    //     dispatch(refreshReservation());
                    // } else if(category == 'covoiturage') {
                    //     dispatch(refreshCovoiturage());
                    // }

                    await Promise.all([
                        setCf(action, current_location_response)
                    ])

                    setCourse((state: any) => ({...state, ...json.course}));
                    if(action == 'end') {
                        if(category == 'covoiturage') {
                            navigation.goBack();
                        } else {
                            if(category == 'ci') {
                                dispatch(setDisponibiliteCourse(true));
                            } else if(category == 'reservation') {
                                dispatch(setDisponibiliteReservation(true));
                            }
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{name: 'DashFinition', params: {course: course, category: category}}]
                                })
                            )
                        }
                    } else if(category == 'reservation' && action == 'start') {
                        dispatch(setDisponibiliteReservation(false));
                    }
                    // setCourse((state: any) => ({...state, ...json.course}));
                    // dispatch(setReload());
                } else {
                    const errors = json.errors;
                    console.log(errors);
                    const txt = getErrorsToString(errors);
                    toast('DANGER', txt, false);
                }
            })
            .catch(error => {
                setVisible(state => ({...state, modal: false}));
                console.log(error)
            })
        }
    }

    const onAcceptCourse = () => {
        setVisible(state => ({...state, modal: true}));
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        if(category == 'ci') {
            formData.append('accept-course', null);
            formData.append('course', course.slug);
        } else if(category == 'reservation') {
            formData.append('accept-reservation', null);
            formData.append('reservation', course.slug);
        }
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setVisible(state => ({...state, modal: false}));
            if(json.success) {
                setCourse((state: any) => ({...state, ...json.course}));
                if(category == 'ci') {
                    dispatch(setDisponibiliteCourse(false));
                    dispatch(refreshCourse());
                } else if(category == 'reservation') {
                    dispatch(refreshReservation());
                    setTimeout(() => {
                        navigation.goBack();
                    }, 2000);
                }
            } else {
                const errors = json.errors;
                console.log(errors);
                const txt = getErrorsToString(errors);
                toast('DANGER', txt, false);
            }
        })
        .catch(error => {
            setVisible(state => ({...state, modal: false}));
            console.log(error)
        })
    }

    const currentCoordonates = async () => {
        const locPermissionDenied = await locationPermission()
        if(locPermissionDenied) {
            const response = await getCurrentLocation();
            // console.log('Response: ', response);
            const {latitude, longitude, heading} = response;
            animate(latitude, longitude);
            if(Object.keys(currentCoords).length == 0) {
                setCurrentCoords({
                    heading: heading,
                    curLoc: {latitude, longitude},
                    // @ts-ignore
                    coordinate: new AnimatedRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    })
                })
            } else {
                // console.log('Yak');
                const newCoordinate = {latitude, longitude};
                if(Platform.OS == 'android') {
                    // @ts-ignore
                    markerRef.current?.animateMarkerToCoordinate(newCoordinate, 7000)
                } else {
                    // @ts-ignore
                    currentCoords.coordinate.timing(newCoordinate).start();
                }
            }
        }
    }

    useEffect(() => {
        if(true) {
            timer.setInterval('current-coordonates', currentCoordonates, 1000);
        }
        console.log('state: ', stateCourse);
        return () => {
            if(timer !== null) {
                timer.clearInterval('current-coordonnates');
            }
        }
    }, [])

    useEffect(() => {
        getCoordonates();
        return () => {
            setStartFetch(false);
            setEndFetch(false);
            // @ts-ignore
            setState(prevState => ({
                ...prevState,
                startingCords: {},
                destinationCords: {},
                isLoading: false
            }))
        }
    }, [])

    useEffect(() => {
        if(Object.keys(startingCords).length > 0 && Object.keys(destinationCords).length > 0) {
            setStartFetch(true);
            setEndFetch(true);
            // setState({
            //     ...state,
            //     isLoading: true
            // })
        }
        if(startFetch && endFetch) {
            setState({
                ...state,
                isLoading: true
            })
        }
    }, [startingCords, destinationCords])

    return (
        <Base>
            <ModalValidationForm showModal={visible.modal} />

            {startFetch && endFetch
            ?
                <>
                <View style={{flex: 1}}>
                    <MapView
                        // mapType='standard'
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
                        onPress={(e) => {
                            setVisible((state) => ({...state, description_start: false, description_end: false}))
                            // @ts-ignore
                            // setCurrentCoords(e.nativeEvent.coordinate)
                            // currentCoordonates();
                            // const {latitude, longitude} = e.nativeEvent.coordinate
                        }}
                    >
                        {Object.keys(currentCoords).length !== 0 && (
                            <Marker.Animated
                                ref={markerRef}
                                tracksViewChanges={true}
                                // @ts-ignore
                                coordinate={currentCoords.coordinate}
                                // coordinate={startingCords}
                                opacity={category == 'covoiturage' ? (stateCourse == 1 ? 1 : 0) : (stateCourse == 10 || stateCourse == 11 ? 1 : 0)}
                            >
                                <RNMarker src={require('../../../assets/images/icons8-street-view-100.png')} />
                            </Marker.Animated>
                        )}

                        <Marker.Animated
                            // ref={markerRef}
                            // image={imageMapPath.icUser}
                            // @ts-ignore
                            coordinate={coordinate}
                            // coordinate={startingCords}
                            // title={'Départ'}
                            // description={startAddress}
                            onPress={() => setVisible((state) => ({...state, description_start: !visible.description_start}))}
                        >
                            <RNMarker visible={visible.description_start} title='Départ' description={startAddress} src={require("../../../assets/images/localisation-user.png")} />

                        </Marker.Animated>

                        { Object.keys(destinationCords).length > 0 && (
                            <>
                                <Marker 
                                    tracksInfoWindowChanges={true}
                                    // image={imageMapPath.icCar}
                                    // @ts-ignore
                                    coordinate={destinationCords}
                                    // title={'Destination'} 
                                    // description={endAddress}
                                    onPress={() => setVisible((state) => ({...state, description_end: !visible.description_end}))}
                                >
                                    <RNMarker visible={visible.description_end} title='Arrivé' description={endAddress} src={require("../../../assets/images/epingle-carte.png")} />
                                </Marker>

                                {/* <Polyline coordinates={[{latitude: startingCords.} startingCords, destinationCords]} /> */}

                                {/* @ts-ignore */}
                                <MapViewDirections
                                    origin={startingCords}
                                    // @ts-ignore
                                    destination={destinationCords}
                                    apikey={ google_maps_apikey }
                                    language='fr'
                                    optimizeWaypoints={true}
                                    mode='DRIVING' //'WALKING'
                                    precision='high'
                                    strokeWidth={5}
                                    strokeColor="hotpink"
                                    lineDashPattern={[0]}
                                    onStart={params => {
                                        console.log('Params', params);
                                        // {origin, destination, waypoints} = params
                                    }}
                                    // lineCap=''
                                    onReady={result => {
                                        const {distance, duration, coordinates, legs} = result
                                        const data = legs[0];

                                        const steps = data.steps;
                                        // for(let k in steps) {
                                        //     console.log(k, steps[k]);
                                        // }

                                        console.log('Result MapDirection: ', result);
                                        for (const key in result) {
                                            // @ts-ignore
                                            console.log('result MapDirection '+key+': ', result[key]);
                                        }

                                        for(let j=0;j<steps.length;j++) {
                                            console.log(`Result MapDirection step${j}: `, steps[j]);
                                        }
                                        
                                        // console.log('Result MapDirection steps: ', data.steps);
                                        // console.log('Result MapDirection traffic_speed_entry: ', data.traffic_speed_entry);
                                        // console.log('Result MapDirection via_waypoint: ', data.via_waypoint);

                                        // setStartAddress(data.start_address);
                                        // setEndAddress(data.end_address);
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
                    <TouchableOpacity
                        onPress={onCenter}
                        style={[ tw`absolute rounded bottom-1 right-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Image 
                            source={imageMapPath.icMapCenter}
                            style={{width: 25, height: 25}} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>navigation.goBack()}
                        style={[ tw`absolute rounded top-1 left-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Icon type='ant-design' name='arrowleft' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={openPanel}
                        style={[ tw`absolute rounded top-1 right-1 p-3`, {backgroundColor: 'rgba(255, 255, 255, 0.5)'} ]}>
                        <Icon type='ionicon' name='ios-locate' />
                    </TouchableOpacity>
                </View>

                {category == 'ci'
                ?
                    // stateCourse == 0 && user.disponibilite == 0
                    stateCourse == 0
                    ?
                        init.disponibilite_course && init.disponibilite_reservation
                        ?
                            <BottomButton buttonTitle='Accepter la course' pressAction={onAcceptCourse} loading={visible.modal} />
                        :
                            <View style={tw`p-3`}>
                                <View style={[ tw`px-30 my-3` ]}>
                                    <Divider />
                                </View>
                                <Text style={tw`text-black text-center`}>Verrouillée</Text>
                            </View>
                    : 
                        stateCourse == 1
                        ?
                            <BottomButton buttonTitle='Démarrer la course' pressAction={() => onStateCourse('start')} loading={visible.modal} />
                        : 
                            stateCourse == 10
                            ?
                                <BottomButton buttonTitle='Course Terminée' pressAction={() => onStateCourse('end')} loading={visible.modal} />
                            : null
                :
                    category == 'reservation'
                    ?
                        stateCourse == 0
                        ?
                            <BottomButton buttonTitle='Accepter la course' pressAction={onAcceptCourse} loading={visible.modal} />
                        : 
                            stateCourse == 1
                            ?
                                <BottomButton buttonTitle='Démarrer la course' pressAction={() => onStateCourse('start')} loading={visible.modal} />
                            : 
                                stateCourse == 10
                                ?
                                    <BottomButton buttonTitle='Course Terminée' pressAction={() => onStateCourse('end')} loading={visible.modal} />
                                : null
                    :
                        category == 'covoiturage'
                        ?
                            stateCourse == 0
                            ?
                                <BottomButton buttonTitle='Démarrer la course' pressAction={() => onStateCourse('start')} loading={visible.modal} />
                            : 
                                stateCourse == 1
                                ?
                                    <BottomButton buttonTitle='Course Terminée' pressAction={() => onStateCourse('end')} loading={visible.modal} />
                                : null
                        : null
                }
                <SwipeablePanel 
                    {...panelProps} 
                    smallPanelHeight={100}
                    // onlySmall
                    onlyLarge
                    isActive={panelIsActive}
                    style={[tw``, {height: layoutHeight + 80}]}
                    // openLarge
                    showCloseButton={false}
                    scrollViewProps={{
                        scrollEnabled: false
                    }}
                    onClose={closePanel}
                    closeOnTouchOutside={true}
                >
                    <View 
                        onLayout={(event) => {
                            setLayoutHeight(event.nativeEvent.layout.height)
                            console.log('HHeight: ', event.nativeEvent.layout.height)
                        }} 
                        style={[ tw`bg-white p-2`, {minHeight: 100} ]}
                    >
                        <View style={[ tw`flex-row items-start` ]}>
                            <TouchableOpacity
                                onPress={closePanel}
                                style={[ tw`rounded p-3 px-2`, {backgroundColor: 'transparent'} ]}>
                                <Icon type='ant-design' name='arrowleft' size={20} />
                            </TouchableOpacity>

                            <View style={[ tw`flex-1 flex-row px-3` ]}>
                                <View style={[ tw`justify-around mr-1` ]}>
                                    <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`mt-2`} />
                                    <Icon type='material-community' name='dots-vertical' size={20} color={'silver'} />
                                    <Icon type='material-community' name='map-marker-outline' size={20} color={'red'} containerStyle={tw`mb-2`} />
                                </View>
                                <View style={[ tw`flex-1` ]}>
                                    <View style={[ tw`border border-slate-200 rounded-md mb-2 bg-gray-200` ]}>
                                        <Text style={[ tw`p-3 text-slate-600`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{startAddress}</Text>
                                    </View>
                                    <View style={[ tw`border border-slate-200 rounded-md bg-gray-200` ]}>
                                        <Text style={[ tw`p-3 text-slate-600`, {} ]} numberOfLines={1} ellipsizeMode='tail'>{endAddress}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                {endFetch && startFetch && (
                                    <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                )}
                                <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{distance}</Text>
                            </View>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                {endFetch && startFetch && (
                                    <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                )}
                                <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{duration}</Text>
                            </View>
                        </View>
                    </View>
                </SwipeablePanel>

                </>
            :
                <ActivityLoading loadingText='Chargement de la carte en cours...' navigation={navigation} goBack={true} />
            }
        </Base>
    )
}

export default ItineraireView;