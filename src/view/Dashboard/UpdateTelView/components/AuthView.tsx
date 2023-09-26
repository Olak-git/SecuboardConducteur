import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, Platform } from 'react-native';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../../assets/styles';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUri } from '../../../../functions/functions';
import { setUser } from '../../../../feature/user.slice';
import { Logo } from '../../../../assets';
import InputForm from '../../../../components/InputForm';
import { Button } from 'react-native-paper';
import { account } from '../../../../data/data';

interface AuthViewProps {
    setConfirm: any,
    errors: any,
    handleError: any,
    inputs: any,
    handleOnChange: any,
}
const AuthView:React.FC<AuthViewProps> = ({ setConfirm, errors, handleError, inputs, handleOnChange }) => {

    // const [otp, setOtp] = useState(route.params.code);

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [disable, setDisable] = useState(false);

    const [loading, setLoading] = useState(false);

    const [test, setTest] = useState(3);

    const auth = () => {
        let valide = true;
        if(!inputs.password) {
            handleError('password', 'Mot de passe obligatoire.');
            valide = false;
        } else {
            handleError('password', null);
        }
        if(valide) {
            setLoading(true);
            setDisable(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('signin[account]', account);
            formData.append('signin[password]', inputs.password);
            formData.append('signin[tel]', user.tel);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setLoading(false);
                setDisable(false);
                if(json.success) {
                    const user = json.user;
                    if(user) {
                        setConfirm(true);
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
                setLoading(false);
                setDisable(false);
                console.log('UpdateAuthView Error: ', error)
            })
        }
    }

    return (
            <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                <View style={[ tw`px-3` ]}>
                    <View style={[ tw`items-center my-10` ]}>
                        {/* <Logo /> */}
                        <Text style={[tw`text-black uppercase`, {fontSize: 45, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>Secu<Text style={{color: ColorsEncr.main}}>board</Text></Text>
                    </View>
                    <Text style={[ tw`text-center px-5 text-black font-normal text-base mb-5` ]}>Veuillez confirmer votre mot de passe.</Text>
                    
                    <View style={[ tw`bg-white px-3` ]}>

                        <InputForm 
                            placeholder='Entrez votre mot de passe'
                            placeholderTextColor={'#ccc'}
                            maxLength={16}
                            password
                            containerStyle={tw`mb-5`}
                            inputParentStyle={tw``}
                            inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                            inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                            value={inputs.password}
                            onChangeText={(text: any) => handleOnChange('password', text)}
                            error={errors.password}
                        />

                        <Button
                            onPress={auth}
                            color={ColorsEncr.main}
                            mode='contained'
                            contentStyle={[tw`p-2`,{}]}
                            loading={loading}
                            style={[tw`mt-5 mb-10`,{borderRadius:0}]}
                        >valider</Button>

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
        // borderColor: "#03DAC6",
        borderColor: ColorsEncr.main_sm,
    },
});

export default AuthView;