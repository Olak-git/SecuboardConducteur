import React, { useCallback, useEffect, useRef, useState } from 'react';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { locationPermission, storagePermission, readPhonePermission, clone } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { Image, ImageBackground, Modal, PixelRatio, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { baseUri, fetchUri, toast, windowWidth } from '../../../functions/functions';
import { ColorsEncr } from '../../../assets/styles';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { Icon } from '@rneui/base';
// @ts-ignore
import CardView from 'react-native-cardview';
import InputForm from '../../../components/InputForm';
import { ActivityIndicator, Button } from 'react-native-paper';
import CountryPicker from '../../../components/CountryPicker';
import { account, DATA_COUNTRY } from '../../../data/data';
import { setDisponibiliteCourse, setDisponibiliteReservation, setStopped } from '../../../feature/init.slice';

const timer = require('react-native-timer');

interface AuthViewProps {
    navigation: any
}
const AuthView:React.FC<AuthViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [visible, setVisible] = useState(false);

    const [countriesAuth, setCountriesAuth] = useState([])

    const [isOk, setIsOk] = useState(false);

    const [inputs, setInputs] = useState({
        country_code: 'bj',
        country_name: 'Benin',
        calling_code: '+229',
        tel: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        tel: null,
        email: null,
        password: null
    });

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onSelectCountry = (country: any) => {
        setInputs((state:any) => ({
            ...state, 
            country_code: country.country_code, 
            country_name: country.country_name, 
            calling_code: country.calling_code 
        }))
    }

    const signIn = () => {
        let valide = true;
        
        handleError('user', null);
        if(!inputs.tel) {
            handleError('tel', 'Mot de passe obligatoire.');
            valide = false;
        } else {
            handleError('tel', null);
        }
        if(!inputs.password) {
            handleError('password', 'Mot de passe obligatoire.');
            valide = false;
        } else {
            handleError('password', null);
        }
        if(valide) {
            setVisible(true);
            const formData = new FormData();
            formData.append('js', 1);
            formData.append('signin[account]', account);
            formData.append('signin[password]', inputs.password);
            formData.append('signin[tel]', inputs.calling_code+inputs.tel);
            console.log('FormData: ', formData)
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // 'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setVisible(false);
                if(json.success) {
                    const _user = json.user;
                    if(_user) {
                        let image = _user.img;
                        const data = clone(_user);
                        if(data.img) {
                            data.img = `${baseUri}/assets/avatars/${image}`;
                        }

                        if(json.disponibilite_course != undefined) {
                            console.log('disponibilite_course: ', json.disponibilite_course)
                            dispatch(setDisponibiliteCourse(json.disponibilite_course))
                        }
                        if(json.disponibilite_reservation != undefined) {
                            console.log('disponibilite_reservation: ', json.disponibilite_reservation)
                            dispatch(setDisponibiliteReservation(json.disponibilite_reservation))
                        }
                        dispatch(setStopped(false))
                        dispatch(setUser({...data}));
                    } else {
                        // registerScreen();
                    }
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                setVisible(false);
                console.log('AuthView Error1: ', error)
            })
        } else {
            toast('WARNING', 'Veuillez remplir les champs.')
        }
    }

    const getPermissions = async () => {
        const permissionLocation = await locationPermission();
        // const permissionAccessPhoneInfos = await readPhonePermission();
    }

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Drawer'}
                ]
            })
        )
    }

    const getCountries = () => {
        console.log('g-c')
        const formData = new FormData()
        formData.append('js', null);
        formData.append('country_auth', null);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(json => {
            // console.log('JSON: ', json);
            if(json.success) {
                setIsOk(true)
                const data = json.countries;
                setCountriesAuth(data);
                handleOnChange('country_code', data[0].country_code)
                handleOnChange('country_name', data[0].country_name)
                handleOnChange('calling_code', data[0].calling_code)
            }
        })
        .catch(e => {
            console.log('AuthView Error2: ', e)
        })
    }

    useEffect(() => {
        if(!isOk) {
            timer.setInterval('get-countries', getCountries, 5000)
        } else {
            if(timer.intervalExists('get-countries')) timer.clearInterval('get-countries')
        }
        return () => {
            if(timer.intervalExists('get-countries')) timer.clearInterval('get-countries')
        }
    }, [isOk])

    useEffect(() => {
        if(Object.keys(user).length > 0) {
            if(timer.intervalExists('get-countries')) {
                timer.clearInterval('get-countries')
            }
            goDashboard();
        } else {
            getPermissions();
        }
    }, [user]);

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                <View style={[tw`mb-5 relative`, {backgroundColor: ColorsEncr.main, borderBottomStartRadius: 480, borderBottomEndRadius: 580, width: windowWidth, height: 220}]}>
                    <ImageBackground source={require('../../../assets/images/DIGI-LEG-LOGO-2022-2.png')} style={{width:'100%', height:'95%', opacity:0.5}} />
                    <Image source={require('../../../assets/images/Untitled-design-24-980x551.png')} style={[ tw``, {position: 'absolute', right: 0, width: PixelRatio.getPixelSizeForLayoutSize(100), height: PixelRatio.getPixelSizeForLayoutSize(100), resizeMode: 'center'} ]} />
                </View>

                <Text style={[tw`text-center text-black text-2xl p-2 mt-3 mb-3`,{fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>Connectez-vous</Text>

                {/* @ts-ignore */}
                {(errors.hasOwnProperty('user') && errors.user) && (
                    <View style={tw`m-3 mx-5`}>
                        <CardView
                            cardElevation={2}
                            cardMaxElevation={8}
                            cornerRadius={1}>
                            <View style={[tw`flex-row items-center p-2 bg-zinc-200`, {backgroundColor: 'rgba(253,186,116,.6)'}]}>
                                <Icon type='antdesign' name='bulb1' size={35} color='rgb(251, 146, 60)' containerStyle={tw`mr-2`} />
                                {/* @ts-ignore */}
                                <Text style={tw`text-base text-red-700 flex-1 leading-tight`}>{errors.user}</Text>
                            </View>
                        </CardView>
                    </View>
                )}

                {/* @ts-ignore */}
                {(inputs.tel != '' && inputs.password != '' && (errors.tel || errors.password)) && (
                    <View style={tw`m-3`}>
                        <CardView
                            cardElevation={2}
                            cardMaxElevation={8}
                            cornerRadius={1}>
                            <View style={[tw`flex-row items-center p-2 bg-zinc-200`, {backgroundColor: 'rgba(253,186,116,.6)'}]}>
                                <Icon type='antdesign' name='bulb1' size={35} color='rgb(251, 146, 60)' containerStyle={tw`mr-2`} />
                                <Text style={tw`text-base text-red-700 flex-1 leading-tight`}>Erreur d'authentification. Mot de passe ou numéro de téléphone incorrect.</Text>
                            </View>
                        </CardView>
                    </View>
                )}

                <View style={tw`p-3 px-5`}>

                    <InputForm 
                        placeholder='Numero de téléphone'
                        placeholderTextColor={'#ccc'}
                        keyboardType='number-pad'
                        maxLength={16}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                        leftComponent={
                            <View style={[ tw`mr-0 flex-row items-center`, {} ]}>
                                {countriesAuth.length == 0
                                ?
                                    <ActivityIndicator size={25} color='#F4F4F4' />
                                :
                                    <CountryPicker 
                                        countryCode={inputs.country_code}
                                        callingCode={inputs.calling_code}
                                        data_country={countriesAuth} 
                                        selectedValue={onSelectCountry}
                                    />
                                }
                            </View>
                        }
                        value={inputs.tel}
                        onChangeText={(text: string) => handleOnChange('tel', text)}
                        // error={errors.tel}
                    />
                    <InputForm 
                        placeholder='Entrez votre mot de passe'
                        placeholderTextColor={'#ccc'}
                        // keyboardType=''
                        maxLength={16}
                        password
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                        value={inputs.password}
                        onChangeText={(text: any) => handleOnChange('password', text)}
                        // error={errors.password}
                        // leftComponent={<Icon type="material-community" name="key-variant" />}
                    />

                    <Button
                        onPress={signIn}
                        color={ColorsEncr.main}
                        mode='contained'
                        contentStyle={[tw`p-2`,{}]}
                        loading={visible}
                        style={[tw`mt-5`,{borderRadius:0}]}
                    >Connexion</Button>

                    <Text style={[tw`text-center text-lg text-black my-10`, {fontFamily: Platform.OS == 'android' ? 'Raleway-VariableFont_wght' : 'PatrickHand-Regular'}]}>Je suis nouveau ? <Text style={tw`font-semibold border-b text-blue-400`} onPress={()=>navigation.navigate('Register')}>Je m'inscris</Text>.</Text>
                </View>

            </ScrollView>
        </Base>
    )
}

export default AuthView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	titleText: {
		color: "#000",
		fontSize: 25,
		marginBottom: 25,
		fontWeight: "bold",
	},
	pickerTitleStyle: {
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: "center",
		fontWeight: "bold",
	},
	pickerStyle: {
		height: 54,
		width: 150,
		marginVertical: 10,
		borderColor: "#303030",
		alignItems: "center",
		marginHorizontal: 10,
		padding: 10,
		backgroundColor: "white",
		borderRadius: 5,
		borderWidth: 2,
		fontSize: 16,
		color: "#000",
	},
	selectedCountryTextStyle: {
		paddingLeft: 5,
		color: "#000",
		textAlign: "right",
	},

	countryNameTextStyle: {
		paddingLeft: 10,
		color: "#000",
		textAlign: "right",
	},

	searchBarStyle: {
		flex: 1,
	},
});