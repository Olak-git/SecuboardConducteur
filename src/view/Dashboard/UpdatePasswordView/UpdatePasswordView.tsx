import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import FlashMessage from '../../../components/FlashMessage';
import Header from '../../../components/Header';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { Logo } from '../../../assets';
import { ColorsEncr } from '../../../assets/styles';
import InputForm from '../../../components/InputForm';
import { Button } from 'react-native-paper';
import { baseUri, fetchUri, toast, validatePassword } from '../../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { clone } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';

interface UpdatePasswordViewProps {
    navigation: any
}
const UpdatePasswordView:React.FC<UpdatePasswordViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [passwordHelperIsVisible, setPasswordHelperIsVisible] = useState(false);

    const [inputs, setInputs] = useState({
        recent_password: '',
        password: '',
        confirmation: ''
    });

    const [errors, setErrors] = useState({
        recent_password: null,
        password: null,
        confirmation: null
    });

    const [visible, setVisible] = useState(false);

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const onHandle = () => {
        let valide = true;
        
        if(!inputs.recent_password) {
            handleError('recent_password', 'est requis.');
            valide = false;
        } else {
            handleError('recent_password', null);
        }

        if(!inputs.password) {
            handleError('password', 'est requis.');
            valide = false;
        } else if(!validatePassword(inputs.password)) {
            handleError('password', 'Doit contenir minimum 8 caractères dont des minuscules a-z, des majuscules A-Z et des chiffres 0-9 et/ou des caractères spéciaux(+,=,@,...)');
            valide = false;
        } else {
            handleError('password', null);
        }

        if(!inputs.confirmation) {
            handleError('confirmation', 'est requis.');
            valide = false;
        } else if(inputs.password && inputs.confirmation !== inputs.password) {
            handleError('confirmation', 'Non conforme.');
            valide = false;
        } else {
            handleError('confirmation', null);
        }

        if(valide) {
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('update-password', null);
            formData.append('account', 'conducteur');
            formData.append('token', user.slug);
            formData.append('recent_password', inputs.recent_password);
            formData.append('password', inputs.password);
            formData.append('confirmation', inputs.confirmation);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                setVisible(false);
                if(json.success) {
                    toast('SUCCESS', 'Votre mot de passe a bien été modifié.');
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
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
                console.log('UpdatePasswordView Error: ', error)
            })
        }
    }

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <Header navigation={navigation} headerTitle='Paramètres' />
            <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                <View style={[ tw`px-3` ]}>
                    <View style={[ tw`items-center my-10` ]}>
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
                            onChangeText={(text: any) => handleOnChange('recent_password', text)}
                            value={inputs.recent_password}
                            error={errors.recent_password}
                        />

                        <InputForm 
                            placeholder='Entrez votre nouveau mot de passe'
                            placeholderTextColor={'#ccc'}
                            maxLength={16}
                            password
                            containerStyle={tw`mb-5`}
                            inputParentStyle={tw``}
                            inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                            inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                            onChangeText={(text: any) => handleOnChange('password', text)}
                            value={inputs.password}
                            error={errors.password}
                            onFocus={()=>setPasswordHelperIsVisible(true)}
                            onBlur={()=>setPasswordHelperIsVisible(false)}
                            constructHelper={
                                passwordHelperIsVisible
                                ?
                                <View style={tw`mt-2`}>
                                    <Text style={tw`mb-3 text-base text-black font-bold`}>Le mot de passe doit contenir:</Text>
                                    <Text style={tw`mb-2 text-black ${8<=inputs.password.length?'text-green-500':''}`}><Text style={tw`font-bold`}>8 caractères</Text> minimum</Text>
                                    <Text style={tw`mb-2 text-black ${inputs.password.match(/[a-z]/g)?'text-green-500':''}`}>En lettre <Text style={tw`font-bold`}>minuscule</Text> (a-z)</Text>
                                    <Text style={tw`mb-2 text-black ${inputs.password.match(/[A-Z]/g)?'text-green-500':''}`}>Au moins une lettre <Text style={tw`font-bold`}>majuscule</Text> (A-Z)</Text>
                                    <Text style={tw`mb-2 text-black ${inputs.password.match(/[0-9]/g)?'text-green-500':''}`}>Un nombre <Text style={tw`font-bold`}>minimum</Text> (0-9)</Text>
                                </View>
                                :
                                undefined
                            }
                        />

                        <InputForm 
                            placeholder='Confirmation'
                            placeholderTextColor={'#ccc'}
                            maxLength={16}
                            password
                            containerStyle={tw`mb-5`}
                            inputParentStyle={tw``}
                            inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                            inputStyle={[ tw`text-base text-black px-3 py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}
                            onChangeText={(text: any) => handleOnChange('confirmation', text)}
                            value={inputs.confirmation}
                            error={errors.confirmation}
                        />

                        <Button
                            onPress={onHandle}
                            color={ColorsEncr.main}
                            mode='contained'
                            contentStyle={[tw`p-2`,{}]}
                            loading={visible}
                            style={[tw`mt-5 mb-10`,{borderRadius:0}]}
                        >valider</Button>

                    </View>
                </View>

            </ScrollView>
            
        </Base>
    )
}

export default UpdatePasswordView;