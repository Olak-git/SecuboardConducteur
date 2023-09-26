import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, Pressable, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { CheckBox, Divider, Icon } from '@rneui/base';
// import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { GestureHandlerRootView, TouchableWithoutFeedback, ScrollView as GHScrollView, FlatList as GHFlatlist } from 'react-native-gesture-handler';
import { fetchUri, getCurrency } from '../../../functions/functions';
import { CommonActions } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import InputForm from '../../../components/InputForm';
import { RNDivider } from '../../../components/RNDivider';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import FlashMessage from '../../../components/FlashMessage';
import RNBottomSheet, { BottomSheetRefProps } from '../../../components/RNBottomSheet';
import { getErrorsToString, getSqlFormatDate, getSqlFormatDateTime, getSqlFormatTime } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { Button, Dialog, ListItem, Avatar } from '@rneui/themed';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

interface CovoituragePlusInfosViewProps {
    navigation: any,
    route: any
}
const CovoituragePlusInfosView: React.FC<CovoituragePlusInfosViewProps> = ({ navigation, route }) => {

    const { start_address, end_address, distance, duration, action } = route.params;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const ref = useRef<BottomSheetRefProps>(null);

    const { width: useWindowWidth, height: useWindowHeight } = useWindowDimensions();

    const [typeVoitures, setTypeVoitures] = useState<any>([]);

    const [endFetch, setEndFetch] = useState(true);

    const [openDatePicker, setOpenDatePicker] = useState(false);

    const [openTimePicker, setOpenTimePicker] = useState(false);

    const minimumDate = new Date();

    const [course, setCourse] = useState({
        adresse_depart: start_address, 
        adresse_arrive: end_address, 
        nb_km: distance,
        nb_place: '1',
        date_depart: new Date(),
        heure_depart: new Date(),
        prix: '1',
        duration: duration
    });

    const [errors, setErrors] =  useState({
        nb_place: null,
        prix: null,
        date_depart: null,
        heure_depart: null
    });

    const [dateTime, setDateTime] = useState({
        date: course.date_depart.toLocaleDateString(),
        time: course.date_depart.toLocaleTimeString()
    });

    const distance_converted = parseFloat(distance.replace(',', '.'));

    const [visible, setVisible] = useState({
        modal: false,
        dialog: false
    });

    const goHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Drawer',
                    }
                ]
            })
        )
    }

    const conversionToSqlDate = (date?: string) => {
        let new_date = null;
        if(date) {
            let array_date = date?.split('/');
            array_date?.reverse();
            new_date = array_date?.join('-');
        }
        return new_date;
    }

    const toggleVisible = (input: string, value: boolean) => {
        setVisible(prevState => ({...prevState, [input]: value}))
    }

    const handleOnChange = (text: any, input: string) => {
        setCourse(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (text: any, input: string) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if(isActive) {
            console.log('ACTIVE !!!');
            ref?.current?.scrollTo(0)
        } else {
            console.log('NO !!!');
            ref?.current?.scrollTo(-100)
        }
        // setIndex(0);
    }, [])

    const onHandlePlace = (text: any) => {
        handleOnChange(text, 'nb_place');
        if(!text) {
            handleError('veuillez préciser le nombre de places à prévoir.', 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: 'veuillez préciser le nombre de places à prévoir.'}));
        } else if(text<0 || text > 4) {
            handleError('veuillez rester dans la tranche de 1 - 4', 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: 'veuillez rester dans la tranche de 1 - 4'}));
        } else {
            handleError(null, 'nb_place');
            // @ts-ignore
            // setErrors(prevState => ({...prevState, nb_place: null}));
        }
    }

    const callFnc = (formData: any) => {
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            toggleVisible('modal', false)
            if(json.success) {
                // @ts-ignore
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    // title: 'Notification',
                    textBody: 'Votre course de covoiturage a bien été enregistrée.',
                })
                // if(action == 'reservation') {
                //     // @ts-ignore
                //     const portefeuille = user.portefeuille - course.type_voiture.frais_reservation;
                //     dispatch(setUser({portefeuille: portefeuille}));
                // }
                // setTimeout(() => {
                //     toggleVisible('dialog', true);
                // }, 2000);

                toggleVisible('dialog', true);
            } else {
                const errors = json.errors;
                const txt = getErrorsToString(errors);
                console.log('Err: ', txt);
                // @ts-ignore
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    // title: 'Notification',
                    textBody: txt,
                })
                console.log('Errors: ', errors);
            }
        })
        .catch(error => {
                toggleVisible('modal', false)
                console.log('CovoituragePlusInfosView Error: ', error)
        });
    }

    const onHandle = () => {
        Keyboard.dismiss();

        let valide = true;
        let invalidText = '';
        if(!course.adresse_depart) {
            valide = false;
            invalidText += '-Veuillez préciser votre point de départ';
        }
        if(!course.adresse_arrive) {
            valide = false;
            if(invalidText) invalidText += '\n';
            invalidText += '-Veuillez préciser votre point d\'arrivé';
        }

        if(!course.date_depart) {
            valide = false;
            if(invalidText) invalidText += '\n';
            invalidText += '-Veuillez préciser la date de départ';
        }
        if(!course.heure_depart) {
            valide = false;
            if(invalidText) invalidText += '\n';
            invalidText += '-Veuillez préciser l\'heure de départ';
        }

        if(action == 'reservation') {
            // if(!course.nb_jour || course.nb_jour == 0) {
            //     valide = false;
            //     if(invalidText) invalidText += '\n';
            //     invalidText += '-Veuillez préciser le nombre de jours pendant lesquels vous souhaitez diposer de la voiture de votre choix';
            // }
        }

        if(!valide) {
            console.log('Error: ', invalidText);
            // @ts-ignore
            Toast.show({
                type: ALERT_TYPE.DANGER,
                // title: 'Notification',
                textBody: invalidText,
            })
        } else {
            toggleVisible('modal', true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('new-covoiturage', null);
            formData.append(`course[adresse_depart]`, course.adresse_depart);
            formData.append(`course[adresse_arrive]`, course.adresse_arrive);
            formData.append(`course[nb_km]`, distance_converted);
            formData.append(`course[mnt]`, course.prix);
            formData.append('course[date_course]', getSqlFormatDate(course.date_depart));
            formData.append('course[heure_course]', getSqlFormatTime(course.heure_depart));
            formData.append('course[nb_place_dispo]', course.nb_place);
            callFnc(formData);

            console.log('FormData: ', formData);
        }
    }

    useEffect(() => {
        return () => {
            setOpenDatePicker(false);
            setOpenTimePicker(false);
        }
    }, [])
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Course' />
            <ModalValidationForm showModal={visible.modal} />
            <Dialog
                isVisible={visible.dialog}
                onBackdropPress={() => toggleVisible('dialog', false)}
                >
                <Dialog.Title title="Success" titleStyle={tw`text-black`}/>
                <Text style={tw`text-gray-600`}>Votre course de covoiturage a bien été enregistrée.</Text>
                <Dialog.Actions>
                    {/* <Dialog.Button title="ACTION 1" onPress={() => console.log('Primary Action Clicked!')}/> */}
                    <Dialog.Button title="HOME" onPress={goHome}/>
                </Dialog.Actions>
            </Dialog>
            {endFetch
            ?
                <ScrollView>

                    <View style={[ tw`bg-white p-3 px-5`, {} ]}>

                        <View style={[ tw`` ]}>
                            <View style={[ tw`flex-row items-start mb-2` ]}>
                                <Icon type='font-awesome' name='circle-thin' size={18} containerStyle={tw`pt-1 pl-1 pr-2`} />
                                <View style={[ tw`ml-2` ]}>
                                    <Text style={tw`text-gray-500`}>Point de départ</Text>
                                    <Text style={[ tw`text-black`, {} ]}>{start_address}</Text>
                                </View>
                            </View>
                            <View style={[ tw`flex-row items-start mb-2` ]}>
                                <Icon type='material-community' name='map-marker-outline' size={25} color={'red'} containerStyle={tw`pt-1`} />
                                <View style={[ tw`ml-2` ]}>
                                    <Text style={tw`text-gray-500`}>Point d'arrivé</Text>
                                    <Text style={[ tw`text-black`, {} ]}>{end_address}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[ tw`flex-row justify-between px-2 mt-3` ]}>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='font-awesome-5' name='car-alt' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{distance}</Text>
                            </View>
                            <View style={[ tw`flex-row items-center bg-orange-100 rounded-2xl py-1 px-3` ]}>
                                <Icon type='material-community' name='approximately-equal' size={20} iconStyle={{ color: ColorsEncr.main }} containerStyle={[ tw`mr-1` ]} />
                                <Icon type='material-community' name='run' size={20} iconStyle={{ color: ColorsEncr.main }} />
                                <Text style={[ tw`text-xs`, {color: ColorsEncr.main} ]}>{duration}</Text>
                            </View>
                        </View>

                        <View style={tw`mt-5 px-10`}>
                            <Divider color='gray' />
                        </View>

                        <View style={[tw`mt-6`]}>
                            <View style={tw`flex-row justify-between items-start`}>
                                <View style={tw``}>
                                    <Text onPress={() => setOpenDatePicker(!openDatePicker)} style={tw`border border-gray-400 rounded-lg p-3 text-black`}>Date de départ</Text>
                                    {dateTime.date && (
                                        <Text style={tw`mt-1 text-black font-bold text-center border-b border-gray-300`}>{ dateTime.date }</Text>
                                    )}
                                </View>
                                <View style={tw``}>
                                    <Text onPress={() => setOpenTimePicker(!openTimePicker)} style={tw`border border-gray-400 rounded-lg p-3 text-black`}>Heure de départ</Text>
                                    {dateTime.time && (
                                        <Text style={tw`mt-1 text-black font-bold text-center border-b border-gray-300`}>{ dateTime.time }</Text>
                                    )}
                                </View>
                            </View>
                            <DatePicker
                                modal
                                open={openDatePicker}
                                date={course.date_depart}
                                onConfirm={(date) => {
                                    setOpenDatePicker(false)
                                    handleOnChange(date, 'date_depart');
                                    setDateTime((state: any) => ({
                                        ...state,
                                        date: date.toLocaleDateString()
                                    }));
                                }}
                                onCancel={() => {
                                    setOpenDatePicker(false)
                                }}
                                minimumDate={minimumDate}
                                mode='date'
                                // timeZoneOffsetInMinutes={-7*60}
                            />
                            <DatePicker
                                modal
                                open={openTimePicker}
                                date={course.heure_depart}
                                onConfirm={(date) => {
                                    setOpenTimePicker(false)
                                    handleOnChange(date, 'heure_depart');
                                    setDateTime((state: any) => ({
                                        ...state,
                                        time: date.toLocaleTimeString()
                                    }));
                                }}
                                onCancel={() => {
                                    setOpenTimePicker(false)
                                }}
                                mode='time'
                            />
                        </View>
                            
                            
                            {/* <Divider width={1} color={'grey'} /> */}

                        <View>
                            <InputForm
                                label='Places disponibles'
                                labelStyle={tw`text-gray-600 mb-2 text-center`}
                                defaultValue='1'
                                // placeholder='Maximum 4'
                                keyboardType='numeric'
                                value={course.nb_place}
                                onChangeText={(text: string) => handleOnChange(text, 'nb_place')}
                                error={errors.nb_place}
                                containerStyle={tw`mt-5`}
                                inputContainerStyle={[ tw`border rounded border-gray-300 border-b-gray-300`, {height: 45} ]}
                                inputStyle={tw`px-3`}
                                constructHelper={
                                    <View style={[ tw`flex-row justify-between items-center mt-1` ]}>
                                        <Text style={[ tw`text-gray-600 text-xs font-extrabold` ]}>Minimum:</Text>
                                        <Text style={[ tw`text-gray-600 text-xs font-extrabold` ]}>1</Text>
                                    </View>
                                }
                            />
                            <View style={tw`mt-5 px-10`}>
                                <Divider color='gray' />
                            </View>

                            <InputForm
                                label='Tarif course'
                                labelStyle={tw`text-gray-600 mb-2 text-center`}
                                defaultValue='1'
                                // placeholder='Maximum 4'
                                keyboardType='numeric'
                                value={course.prix}
                                onChangeText={(text: string) => handleOnChange(text, 'prix')}
                                error={errors.prix}
                                containerStyle={tw`mt-5`}
                                inputContainerStyle={[ tw`border rounded border-gray-300 border-b-gray-300`, {height: 45} ]}
                                inputStyle={tw`px-3`}
                            />
                        </View>
                            
                        <View style={tw`mt-5 px-10`}>
                            <Divider color='gray' />
                        </View>
                        <View style={[ tw`justify-center mt-2`, {height: 80} ]}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onHandle}
                                style={[ tw`justify-center items-center bg-orange-100 rounded py-4 px-5`, {height: 60} ]}
                            >
                                <Text style={[ tw`uppercase text-center font-medium text-black` ]}>Valider ma course</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={tw`text-center text-slate-500`}>Après validation, il vous sera prélevé les frais de réservation de votre portefeuille.</Text>

                    </View>

                </ScrollView>
            :
            <ActivityLoading />
            }
        </Base>
    )
}

export default CovoituragePlusInfosView;