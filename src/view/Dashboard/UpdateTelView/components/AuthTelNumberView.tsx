import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, Platform } from 'react-native';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import InputForm from '../../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUri, toast } from '../../../../functions/functions';
import { setUser } from '../../../../feature/user.slice';
import { getErrorsToString } from '../../../../functions/helperFunction';
import { Icon } from '@rneui/base';
import { account } from '../../../../data/data';
import { ActivityIndicator, Button } from 'react-native-paper';
import CountryPicker from '../../../../components/CountryPicker';

const timer = require('react-native-timer');

interface AuthTelNumberViewProps {
    navigation: any,
    errors: any,
    handleError: any,
    inputs: any,
    handleOnChange: any,
    setVisible: any
}
const AuthTelNumberView:React.FC<AuthTelNumberViewProps> = ({ navigation, setVisible, errors, handleError, inputs, handleOnChange }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [phoneError, setPhoneError] = useState<null|string>(null);

    const [countriesAuth, setCountriesAuth] = useState([])

    const [loading, setLoading] = useState(false)

    const [isOk, setIsOk] = useState(false);

    const onSelectCountry = (country: any) => {
        handleOnChange('country_code', country.country_code)
        handleOnChange('country_name', country.country_name)
        handleOnChange('calling_code', country.calling_code)
    }

    const goBack = () => {
        navigation.goBack();
    }

    const onHandle = () => {
        setVisible(true);
        setLoading(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('update-tel', null);
        formData.append('token', user.slug);
        formData.append('account', account);
        formData.append('country', inputs.country_name);
        formData.append('country_code', inputs.country_code);
        formData.append('calling_code', inputs.calling_code);
        formData.append('tel', inputs.calling_code+inputs.phone);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(async json => {
            setVisible(false);
            setLoading(false);
            if(json.success) {
                await dispatch(setUser({tel: json.user.tel, portefeuille: json.user.portefeuille}));
                toast('SUCCESS', 'Votre numéro de téléphone a été modifié.', true, 'Succès');
                setTimeout(goBack, 2000);
            } else {
                const errors = json.errors;
                console.log(errors);
                toast('DANGER', getErrorsToString(errors), true, 'Erreur');
            }
        })
        .catch(error => {
            setVisible(false);
            setLoading(false);
            console.log('UpdateAuthTelNumberView Error1: ', error)
        })
    }
    // End

    const onHandleValidateTelNumber = async () => {
        let valide = true;
        const regExp = /^[0-9]+/g;
        // const regExp = /^[0-9]{8}/;
        if(inputs.phone) {
            if(!regExp.test(inputs.phone)) {
                valide = false;
                setPhoneError('Format numéro de téléphone incorrect.');
                toast('DANGER', 'Format numéro de téléphone incorrect.', true, 'Erreur');
            }
        } else {
            valide = false;
            handleError('phone', 'Veuillez indiquer votre numéro de téléphone.');
            toast('DANGER', 'Veuillez indiquer votre numéro de téléphone.', true, 'Erreur');
        }

        if(valide) {
            handleError('phone', null);
            setPhoneError(null);
            // setErrors(null);
            onHandle();
        }
    }

    const getCountries = () => {
        const formData = new FormData()
        formData.append('js', null);
        formData.append('country_auth', null);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(json => {
            if(json.success) {
                setIsOk(true)
                const data = json.countries;
                setCountriesAuth(data);
                if(!inputs.country_code) {
                    handleOnChange('country_code', data[0].country_code)
                }
                if(!inputs.country_name) {
                    handleOnChange('country_name', data[0].country_name)
                }
                if(!inputs.calling_code) {
                    handleOnChange('calling_code', data[0].calling_code)
                }
            }
        })
        .catch(e => console.log('UpdateAuthTelNumberView Error2: ', e))
    }

    useEffect(() => {
        if(!isOk) {
            timer.setInterval('get-countries', getCountries, 5000)
        } else {
            timer.clearInterval('get-countries')
        }
        return () => {
            timer.clearInterval('get-countries')
        }
    }, [isOk])

    // useEffect(() => {
    //     console.log('User: ', user)
    // }, [user])

    return (
        <ScrollView nestedScrollEnabled={true}>
            <View style={[ tw`px-3` ]}>
                <View style={[ tw`` ]}>
                    <View style={[ tw`items-center my-10` ]}>
                        {/* <Logo /> */}
                        <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>Secu<Text style={{color: ColorsEncr.main}}>board</Text></Text>
                    </View>
                    <Text style={[ tw`text-lg text-black text-center px-5 mb-5` ]}>Veuillez entrer un nouveau numéro de téléphone mobile</Text>
                    <View style={[ tw`mt-5 mb-4` ]}>

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
                            value={inputs.phone}
                            onChangeText={(text: string) => handleOnChange('phone', text)}
                            error={phoneError}
                        />

                        <Button
                            onPress={onHandleValidateTelNumber}
                            color={ColorsEncr.main}
                            mode='contained'
                            contentStyle={[tw`p-2`,{}]}
                            loading={loading}
                            style={[tw`mt-5 mb-10`,{borderRadius:0}]}
                        >valider</Button>

                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: ColorsEncr.main_sm
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});

export default AuthTelNumberView;