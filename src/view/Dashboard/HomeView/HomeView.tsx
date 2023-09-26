import { Header, Icon } from '@rneui/base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DrawerLayoutAndroid, Image, Pressable, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Switch as RNESwitch } from '@rneui/base';
import Base from '../../../components/Base';
import LogoDark from '../../../assets/images/svgImages/LogoDark.svg';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import ButtonMenu from './components/ButtonMenu';
import DrawerMenu from './components/DrawerMenu';
import { baseUri, fetchUri, getCurrency, toast, windowHeight, windowWidth } from '../../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { Accueil } from '../../../assets';
import { deleteUser, setScores, setTotalCourse, setTotalKm, setUser } from '../../../feature/user.slice';
import { clone, getErrorsToString, openUrl } from '../../../functions/helperFunction';
import { ActivityIndicator, Badge, Switch as SwitchPaper } from 'react-native-paper';
import { RNPModal } from '../../../components/RNPModal';
import Spinner from 'react-native-spinkit';
import { deleteCourse, deleteReservation, resetCoords } from '../../../feature/course.slice';
import { resetNotifications, setCount } from '../../../feature/notifications.slice';
import { setDisponibilite, setStopped } from '../../../feature/init.slice';
import { Divider } from '@rneui/themed';
import { google_maps_apikey, REFRESH_CONTROL_COLOR, secuboard_infos } from '../../../data/data';
import Geocoder from 'react-native-geocoding';
import { ModalValidationForm } from '../../../components/ModalValidationForm';

const timer = require('react-native-timer');

Geocoder.init(google_maps_apikey, {language : "fr"});

interface RenderNavigationDrawerProps {
    navigation: any,
    user: any
}
const RenderNavigationDrawer: React.FC<RenderNavigationDrawerProps> = ({ navigation, user }) => {
    const src = user.img ? {uri: user.img} : require('../../../assets/images/user-1.png');
    const {height} = useWindowDimensions();

    return (
        <View style={[ tw`flex-1` ]}>
            <View style={[ tw`justify-center items-center`, {height: 120, backgroundColor: ColorsEncr.main} ]}>
                <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
                    <Image
                        defaultSource={require('../../../assets/images/user-1.png')}
                        source={src}
                        style={[tw`rounded-full`, {height: 70, width: 70}]}
                    />
                </Pressable>
                <Text style={[ tw`text-white font-semibold text-center px-3`, {width: '100%'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
            </View>
            <ScrollView>
                <View style={[ tw`px-4 py-3` ]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DashPortefeuille')}
                        style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50` ]}>
                        <Icon
                            type="font-awesome-5"
                            name="wallet"
                            size={25}
                            color={ ColorsEncr.main }/>
                        <View style={[ tw`px-4` ]}>
                            <Text style={[ tw`text-gray-800` ]}>Portefeuille</Text>
                            <Text style={[ tw`text-black font-bold text-xl` ]}>{ getCurrency(user.portefeuille) } F</Text>
                        </View>
                    </TouchableOpacity>
                    <DrawerMenu navigation={navigation} screenName='DashMyAccount' iconType='material' iconName='account-circle' textMenu='Mon compte' />
                    <DrawerMenu disabled={user.compte_business == 1 && user.actif == 0 ? true : false} navigation={navigation} screenName='DashHistoriqueCourses' iconName='car-alt' textMenu='Mes courses' />
                    <DrawerMenu navigation={navigation} screenName='DashParametres' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                    <DrawerMenu navigation={navigation} screenName='DashHelp' iconType='entypo' iconName='help' textMenu='Aide' containerStyle={[ tw`border-b-0` ]} />
                </View>
            </ScrollView>
            {height === windowHeight && (
                <Accueil width='100%' opacity={0.2} />
            )}
        </View>
    )
}

interface HomeViewProps {
    navigation: any,
    route: any
}
const HomeView: React.FC<HomeViewProps> = ({navigation, route}) => {

    const dispatch = useDispatch();

    const stopped = useSelector((state: any) => state.init.stopped);

    const disponibilite = useSelector((state: any) => state.init.disponibilite);

    const reload = useSelector((state: any) => state.reload.value);

    const notifies = useSelector((state: any) => state.notifications.data);

    // console.log('notifies => ', notifies);

    const [countNotifs, setCountNotifs] = useState(0);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [disabled, setDisabled] = useState(false);

    const user = useSelector((state: any) => state.user.data);

    const {height} = useWindowDimensions();

    const [refresh, setRefresh] = useState(false);

    const [end, setEnd] = useState(false);

    const [geo, setGeo] = useState<any>('');

    const [fullNewCourses, setFullNewCourses] = useState(0);
    const [newCourses, setNewCourses] = useState(0);
    const [newReservations, setNewReservations] = useState(0);

    const [visible, setVisible] = useState(false)

    const onSignOut = async () => {
        await dispatch(setStopped(true));
        setVisible(true);
        setTimeout(async () => {
            setVisible(false);
            await dispatch(resetCoords());
            await dispatch(deleteUser());
        }, 5000)
    }

    const onHandlePicker = (value: boolean): void => {
        setDisabled(true);
        const formData = new FormData()
        formData.append('js', null);
        formData.append('update-state', null);
        formData.append('value', value);
        formData.append('token', user.slug)
        console.log('FormData: ', formData);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                dispatch(setDisponibilite(value));
                // let image = json.user.img;
                // const data = clone(json.user);
                // if(data.img) {
                //     data.img = `${baseUri}/assets/avatars/${image}`;
                // }
                // dispatch(setUser({...data}));
                // let c = 0;
                // const notifications = json.notifications;
                // notifications.map((v: any) => {
                //     if(notifies.indexOf(v.id) == -1) {
                //         c++;
                //     }
                // })
                // setCountNotifs(c);
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
                toast('DANGER', getErrorsToString(errors));
            }
            setDisabled(false);
        })
        .catch(e => {
            setDisabled(false);
            console.warn('HomeView Error1: ', e)
        })
    }

    const getData = (): void => {
        if(!stopped) {
            // console.log('BODO-BODO')
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`refresh`, null)
            formData.append('token', user.slug)
            // console.log('formdata: ', formData)
            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                // console.log('JSON: ', json)
                if(json.success) {
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
                    dispatch(setTotalCourse(json.total_course));
                    dispatch(setTotalKm(json.total_km));
                    dispatch(setScores(json.ratings));

                    if(data.disponibilite == 1) {
                        dispatch(setDisponibilite(true))
                    } else if(data.disponibilite == 0) {
                        dispatch(setDisponibilite(false));
                    }
                    let c = 0;
                    const notifications = json.notifications;
                    notifications.map((v: any) => {
                        if(notifies.indexOf(v.id) == -1) {
                            c++;
                        }
                    })
                    dispatch(setCount(c))
                    setCountNotifs(c);
                    
                    if(data.disponibilite == 1) {
                        if(json.new_courses != undefined) setNewCourses(json.new_courses);
                        if(json.new_reservations != undefined) setNewReservations(json.new_reservations);
                        if(json.full_new_courses != undefined) setFullNewCourses(json.full_new_courses);
                    } else if(data.disponibilite == 0) {
                        setNewCourses(0);
                        setNewReservations(0);
                        setFullNewCourses(0);
                    }
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    toast('DANGER', getErrorsToString(errors));
                }
                setRefresh(false);
                setEnd(true);
            })
            .catch(e => {
                setRefresh(false);
                console.warn('HomeView Error2: ', e)
            })
        }
    }

    const getCoordonates = async () => {
        await Geocoder.from(secuboard_infos.address)
        .then(json => {
            let location = json.results[0].geometry.location;
            console.log('StartCoords: ', location);
            setGeo(`${location.lat},${location.lng}`);
        })
        .catch(error => {
            console.warn('HomeView Error3: ', error)
        });
    }

    const onRefresh = (): void => {
        if(stopped) {
            dispatch(setStopped(false))
        }
        setRefresh(true);
        getData();
    }

    useEffect(() => {
        timer.setInterval('home', getData, 5000)
        return () => {
            timer.clearInterval('home')
        }
    }, [notifies, stopped])

    useEffect(() => {
        if(timer.intervalExists('get-countries')) timer.clearInterval('get-countries')
        if(timer.intervalExists('get-countries2')) timer.clearInterval('get-countries2')
        getCoordonates();
        getData();
    }, [reload])

    return (
        <Base containerStyle={tw`pt-0`}>
            
            <ModalValidationForm showModal={visible} />

            {(user.compte_business == 1 && user.actif == 0 && !visible) && (
                <RNPModal showModal={true}>
                    <View style={[tw`rounded-lg p-3 bg-white`, { width: 300 }]}>
                        <View style={tw`items-center mb-3`}>
                            <Spinner isVisible={true} size={100} color={ColorsEncr.main} type='ChasingDots' />
                        </View>

                        <Text style={[tw`text-black font-bold mb-2`, { lineHeight: 18 }]}>Vous avez besoin de ample explications?</Text>
                        <Text style={tw`text-black`}>Veuillez vous rendre à notre agence.</Text>

                        {/* <Text style={[tw`text-black font-bold mb-2`, { lineHeight: 18 }]}>Veuillez vous rendre à l'agence pour finaliser votre inscription.</Text>
                        <Text style={tw`text-black mb-2`}>Soyez muni des pièces:</Text>
                        <Text style={tw`text-black`}>- Carte nationale d'identité (ou passeport);</Text>
                        <Text style={tw`text-black`}>- Carte grise;</Text>
                        <Text style={tw`text-black mb-2`}>- Permis de conduire.</Text>
                        <Text style={tw`text-black font-bold`}>NB: Venez avec votre véhicule.</Text> */}

                        <Divider color='#ddd' style={tw`my-3`} />
                        <View style={tw`flex-row items-center mb-1`}>
                            <Icon type='material-icon' name='location-pin' color={ColorsEncr.main} />
                            <Text style={tw`flex-1 text-black ml-2`} onPress={() => openUrl(`geo:${geo}`)}>{secuboard_infos.address}</Text>
                        </View>
                        <View style={tw`flex-row items-center mb-1`}>
                            <Icon type='material-community' name='email-newsletter' color={ColorsEncr.main} />
                            <Text style={tw`flex-1 text-black ml-2`} onPress={() => openUrl(`mailto:${secuboard_infos.email}`)}>{secuboard_infos.email}</Text>
                        </View>
                        <View style={tw`flex-row items-center`}>
                            <Icon type='material-icon' name='phone' color={ColorsEncr.main} />
                            <Text style={tw`flex-1 text-black ml-2`} onPress={() => openUrl(`tel:${secuboard_infos.phone}`)}>{secuboard_infos.phone}</Text>
                        </View>
                        <Divider color='#ddd' style={tw`my-3`} />
                        <TouchableOpacity onPress={onSignOut}><Text style={tw`text-center font-semibold text-red-600`}>Me déconnecter</Text></TouchableOpacity>
                    </View>
                </RNPModal>
            )}

            {/* <View style={[tw`flex-row justify-center items-center mt-2`]}>
                <View style={tw`flex-row mr-2`}>
                    <Text style={[tw`uppercase text-center text-black text-lg mr-2`, { maxWidth: windowWidth - 100 }]}>{disponibilite ? 'Arreter le travail' : 'Commencer le travail'}</Text>
                    {disabled && (
                        <ActivityIndicator size='small' color={ColorsEncr.main} />
                    )}
                </View>
                <SwitchPaper disabled={user.compte_business == 1 && user.actif == 0 ? true : disabled} value={disponibilite} onValueChange={(value) => onHandlePicker(value)} />
            </View> */}

            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={REFRESH_CONTROL_COLOR}
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        progressBackgroundColor='#ffffff'
                    />
                }
                contentContainerStyle={[tw``, { minHeight: height - 116 - 98.5 }]}>
                <View style={[tw`${user.compte_business == 1 ? 'flex-1 justify-around' : ''} py-3`]}>
                    {user.compte_business == 1 && user.actif == 0 && (
                        <Text style={tw`text-center text-black px-3 mb-2`}>Votre compte est momentanément désactivé. Il sera activé après vérification et confirmation des informations soumises. Merci.</Text>
                        // <Text style={tw`text-center text-black px-3 mb-2`}>Votre compte est momentanément désactivé. Veuillez vous rendre dans notre agence pour compléter votre inscription. Merci.</Text>
                    )}
                    {fullNewCourses > 0
                        ? <Text style={[tw`mx-5 p-3 rounded-md bg-red-200 text-base text-red-800 mb-2`,{}]}>De nouvelles courses sont disponibles. <Text style={tw`font-bold`}>{fullNewCourses.toString().padStart(2,'0')}</Text> courses en attente.</Text>
                        : (newCourses > 0 || newReservations > 0) && (
                            <Text style={[tw`mx-5 p-3 rounded-md bg-red-200 text-base text-red-800 mb-2`,{}]}>De nouvelles courses sont disponibles. 
                                {newCourses > 0 && (
                                    <><Text style={tw`font-bold`}> {newCourses.toString().padStart(2,'0')}</Text> course(s) instantanée(s) </>
                                )}
                                {(newCourses > 0 && newReservations > 0) && (
                                    <> et </>
                                )}
                                {newReservations > 0 && (
                                    <><Text style={tw`font-bold`}> {newReservations.toString().padStart(2,'0')}</Text> réservation(s) </>
                                )}
                                en attente.
                            </Text>
                        )
                    }
                    
                    {user.compte_business == 1
                        ?
                        <View style={[tw`flex-1 justify-center`]}>
                            <View style={[tw`flex-row justify-center items-start px-5 mb-4`, { height: 200 }]}>
                                <ButtonMenu disabled={user.actif == 0} navigation={navigation} route='DashCoursesDispos' iconName='car-alt' caption='Courses Disponibles' />
                                {/* <Text style={[tw`mx-2`]}></Text> */}
                                {/* <ButtonMenu disabled={user.actif == 0} navigation={navigation} route='DashCovoiturages' iconName='user-friends' caption="Covoiturage" /> */}
                            </View>
                            <View style={[tw`flex-row justify-center items-start px-5`, { height: 200 }]}>
                                <ButtonMenu disabled={user.actif == 0} navigation={navigation} route='DashReservations' iconName='calendar-alt' caption='Réservation' />
                                <Text style={[tw`mx-2`]}></Text>
                                <ButtonMenu navigation={navigation} route='DashBilan' disabled={user.actif == 0} iconName='chart-bar' caption='Bilan' />
                            </View>
                        </View>
                        :
                        <View style={[tw`flex-1 justify-center mt-5`]}>
                            <View style={[tw`flex-row justify-center items-start px-5 mb-4`, { height: 200 }]}>
                                <ButtonMenu navigation={navigation} route='DashCovoiturages' iconName='user-friends' caption="Covoiturage" containerStyle={tw`rounded-lg`} />
                                <Text style={[tw`mx-2`]}></Text>
                                <ButtonMenu navigation={navigation} route='DashBilan' iconName='chart-bar' caption='Bilan' containerStyle={tw`rounded-lg`} />
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>

            <View style={[tw`px-5 py-2`]}>
                <View style={[tw`bg-slate-300 rounded-lg py-2 px-3 flex-row justify-between`, { height: 80 }]}>
                    <Pressable
                        onPress={() => navigation.navigate('DashPortefeuille2')}
                        style={[tw`flex-1 flex-row items-center`]}>
                        <Icon type="font-awesome-5" name="wallet" size={30} />
                        <View style={[tw`ml-3`]}>
                            <Text style={[tw`text-gray-800`]}>Portefeuille</Text>
                            <Text style={[tw`text-black font-bold text-2xl`]}>{getCurrency(user.portefeuille)} F</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate('DashTransactions')}
                        style={[tw`justify-center items-center`]}>
                        <Icon type="font-awesome-5" name="history" size={30} />
                        <Text style={[tw`text-black`]}>Transactions</Text>
                    </Pressable>
                </View>
            </View>
        </Base>
    )
}

export default HomeView;