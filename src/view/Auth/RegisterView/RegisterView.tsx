import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, Keyboard, Modal, PixelRatio, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { baseUri, fetchUri, format_size, toast, validateEmail, validatePassword, windowHeight, windowWidth } from '../../../functions/functions';
import FilePicker, { types } from 'react-native-document-picker';
import InputForm from '../../../components/InputForm';
import { Icon } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { clone, storagePermission } from '../../../functions/helperFunction';
import { setUser } from '../../../feature/user.slice';
import { DATA_COUNTRY, otp_authentication } from '../../../data/data';
import { setDisponibiliteCourse, setDisponibiliteReservation, setStopped } from '../../../feature/init.slice';
import { ActivityIndicator, Button } from 'react-native-paper';
import CountryPicker from '../../../components/CountryPicker';
// @ts-ignore
import CardView from 'react-native-cardview';
import SwipeablePanelFile from '../../../components/SwipeablePanelFile';

const timer = require('react-native-timer');

interface RegisterViewProps {
    navigation: any,
    route: any
}
const RegisterView:React.FC<RegisterViewProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const {width} = useWindowDimensions();

    // const {tel: telephone, country, countryCode} = route.params;

    const [isOk, setIsOk] = useState(false);

    const [countriesAuth, setCountriesAuth] = useState([])

    const [inputs, setInputs] = useState({
        profil: {},
        nom: '',
        prenom: '',
        email: '',
        country_code: 'bj',
        country_name: 'Benin',
        calling_code: '+229',
        tel: '',
        password: '',
        confirmation: '',
        permis: '',
        file_permis: {},
        cip: '',
        file_cip: {},
        carte_grise: '',
        file_carte_grise: {},
        imgs_car: [],
        business: 1,
    })

    const [errors, setErrors] = useState({
        profil: null,
        nom: null,
        prenom: null,
        email: null,
        tel: null,
        password: null,
        confirmation: null,
        cov_nom: null,
        cov_prenom: null,
        permis: null,
        file_permis: null,
        cip: null,
        file_cip: null,
        carte_grise: null,
        file_carte_grise: null,
        imgs_car: null
    });

    const [passwordHelperIsVisible, setPasswordHelperIsVisible] = useState(false);

    const [visible, setVisible] = useState(false);

    const [isPanelActive, setIsPanelActive] = useState(false);

    const [labelActive, setLabelActive] = useState('profil');

    const [swipOptions, setSwipOptions] = useState({
        showCameraLaunch: true,
        showGaleryLauch: true,
        showFilePicker: true,
        imageMultipleSelection: false
    })

    const handleSwipOptionsOnChange = (input: string, text: boolean) => {
        setSwipOptions(prevState => ({ ...prevState, [input]: text }))
    }
    
    const openPanel = (label: string) => {
        setLabelActive(label)
        setIsPanelActive(true);
    };
    const closePanel = () => {
        setIsPanelActive(false);
    };

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

    const goBack = () => {
        if(navigation.canGoBack()) {
            navigation.goBack()
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'Auth'}
                    ]
                })
            )
        }
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const removeFile = (index: number) => {
        const jh = [...inputs.imgs_car];
        jh.splice(index, 1);
        handleOnChange('imgs_car', jh)
    }

    const onSelectCountry = (country: any) => {
        setInputs((state:any) => ({
            ...state, 
            country_code: country.country_code, 
            country_name: country.country_name, 
            calling_code: country.calling_code 
        }))
    }

    const getFileName = (type: string) => {
        // @ts-ignore
        if(inputs[type] && inputs[type].name) {
            // @ts-ignore
            return inputs[type].name + ' (' + format_size(inputs[type].size) + ')';
        }
        return 
    }

    const getResponse = (resp: any) => {
        console.log('Label active: ', labelActive);
        let data = null;
        if(labelActive=='imgs_car') {
            const imgs = [];
            for (let index = 0; index < resp.length; index++) {
                imgs.push({
                    "name": resp[index].fileName, 
                    "size": resp[index].fileSize, 
                    "type": resp[index].type, 
                    "uri": resp[index].uri
                }); 
            }
            data = imgs;
        } else {
            data = {
                "fileCopyUri": null, 
                "name": resp.fileName, 
                "size": resp.fileSize, 
                "type": resp.type, 
                "uri": resp.uri
            }
        }
        return data;
    }

    const onHandleCaptureImage = async (resp: any) => {
        console.log('Capture Response: ', resp)
        const data = await getResponse(resp);
        console.log('Capture Response Data: ', data)
        setInputs((prevState: any) => ({
            ...prevState,
            [labelActive]: data
        }))
        // setInputs((prevState: any) => ({
        //     ...prevState,
        //     [labelActive]: labelActive=='imgs_car' ? resp : {
        //         "fileCopyUri": null, 
        //         "name": resp.fileName, 
        //         "size": resp.fileSize, 
        //         "type": resp.type, 
        //         "uri": resp.uri
        //     }
        // }))
    }

    const onHandleSelectedImage = async (resp: any) => {
        console.log('Selected Response: ', resp);
        const data = await getResponse(resp);
        console.log('Selected Response Data: ', data)
        setInputs((prevState: any) => ({
            ...prevState,
            [labelActive]: data
        }))
        // setInputs((prevState: any) => ({
        //     ...prevState,
        //     [labelActive]: labelActive=='imgs_car' ? resp : {
        //         "fileCopyUri": null, 
        //         "name": resp.fileName, 
        //         "size": resp.fileSize, 
        //         "type": resp.type, 
        //         "uri": resp.uri
        //     }
        // }))
    }

    const handleFilePicker = async (file: any) => {
        handleOnChange(labelActive, file)
        // const permissionStorage = await storagePermission();
        // if(permissionStorage) {
        //     try {
        //         const response = await FilePicker.pick({
        //             presentationStyle: 'pageSheet',
        //             type: [types.images],
        //             transitionStyle: 'coverVertical',
        //         })
        //         FilePicker.isCancel((err: any) => {
        //             console.log(err);
        //         })
        //         if(file == 'profil')
        //             setAvatar({uri: response[0].uri})
        //         // @ts-ignore
        //         // console.log(response[0].name + '(' + format_size(response[0].size) + ')');
        //         handleOnChange(file, response[0])

        //     } catch(e) {
        //         console.log(e)
        //     }
        // }
    }

    const onHandle = () => {
        let valide = true;
        if(!inputs.nom) {
            handleError('nom', 'est requis.');
            valide = false;
        } else if(!inputs.nom.trim()) {
            handleError('nom', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('nom', null);
        }

        if(!inputs.prenom) {
            handleError('prenom', 'est requis.');
            valide = false;
        } else if(!inputs.prenom.trim()) {
            handleError('prenom', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('prenom', null);
        }

        if(inputs.email && !validateEmail(inputs.email)) {
            handleError('email', 'email non valide.');
            valide = false;
        } else {
            handleError('email', null);
        }

        if(!inputs.tel) {
            handleError('tel', 'est requis.');
            valide = false;
        } else if(!inputs.tel.trim()) {
            handleError('tel', 'ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('tel', null);
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

        // if(!inputs.confirmation) {
        //     handleError('confirmation', 'est requis.');
        //     valide = false;
        // } else if(inputs.password && inputs.confirmation !== inputs.password) {
        //     handleError('confirmation', 'Non conforme.');
        //     valide = false;
        // } else {
        //     handleError('confirmation', null);
        // }
        if(!inputs.permis) {
            handleError('permis', 'Veuillez entrer le N° d\'identification de l\'acte.');
            valide = false;
        } else if(!inputs.permis.trim()) {
            handleError('permis', 'Le champ ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('permis', null);
        }

        if(Object.keys(inputs.file_permis).length == 0) {
            handleError('file_permis', 'Ajouter en pièce jointe l\'acte.');
            valide = false;
        } else {
            handleError('file_permis', null);
        }

        if(!inputs.cip) {
            handleError('cip', 'Veuillez entrer le N° d\'identification personnel de l\'acte.');
            valide = false;
        } else if(!inputs.cip.trim()) {
            handleError('cip', 'Le champ ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('cip', null);
        }

        if(Object.keys(inputs.file_cip).length == 0) {
            handleError('file_cip', 'Ajouter en pièce jointe l\'acte.');
            valide = false;
        } else {
            handleError('file_cip', null);
        }

        if(!inputs.carte_grise) {
            handleError('carte_grise', 'Veuillez entrer le N° d\'immatriculation de l\'acte.');
            valide = false;
        } else if(!inputs.carte_grise.trim()) {
            handleError('carte_grise', 'Le champ ne peut pas être en blanc.');
            valide = false;
        } else {
            handleError('carte_grise', null);
        }

        if(Object.keys(inputs.file_carte_grise).length == 0) {
            handleError('file_carte_grise', 'Ajouter en pièce jointe l\'acte.');
            valide = false;
        } else {
            handleError('file_carte_grise', null);
        }

        let length = inputs.imgs_car.length;
        if(length == 0) {
            handleError('imgs_car', 'Veuillez fournir des images de votre voiture.');
            valide = false;
        } else {
            handleError('imgs_car', null);
        }

        if(valide) {
            Keyboard.dismiss();
            setVisible(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('signup[business]', inputs.business);
            formData.append('signup[nom]', inputs.nom);
            formData.append('signup[prenom]', inputs.prenom);
            formData.append('signup[email]', inputs.email);
            formData.append('signup[country]', inputs.country_name);
            formData.append('signup[country_code]', inputs.country_code);
            formData.append('signup[calling_code]', inputs.calling_code);
            formData.append('signup[tel]', inputs.calling_code+inputs.tel);
            formData.append('signup[password]', inputs.password);

            formData.append('signup[num_permis]', inputs.permis);
            formData.append('permis', inputs.file_permis);
            formData.append('signup[num_cni]', inputs.cip);
            formData.append('cni', inputs.file_cip);
            formData.append('signup[num_carte_grise]', inputs.carte_grise);
            formData.append('carte_grise', inputs.file_carte_grise);

            for (let i = 0 ; i < length ; i++) {
                formData.append("imgs_car[]", inputs.imgs_car[i]);
            }

            if(Object.keys(inputs.profil).length > 0) {
                formData.append('img', inputs.profil);
            }

            console.log('FormData:', formData);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(async json => {
                console.log(json)
                setVisible(false);
                if(json.success) {
                    if(json.user) {
                        const $user = json.user
                        let image = $user.img;
                        const data = clone($user);
                        if(data.img) {
                            data.img = `${baseUri}/assets/avatars/${image}`;
                        }
                        await Promise.all([
                            dispatch(setDisponibiliteCourse(true)),
                            dispatch(setDisponibiliteReservation(true)),
                            dispatch(setStopped(false))
                        ])
                        dispatch(setUser({...data}));
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
                console.log('RegisterView Error1: ', error)
            })
        } else {
            toast('WARNING', 'Des erreurs identifiées.');
        }
    }

    const getErrors = (e1: string|null, e2: string|null) => {
        let err = null;
        if(e1)
            err = e1;
        if(err && e2) 
            err += '\n' + e2;
        else if(e2)
            err = e2;
        return err;
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
                setIsOk(true);
                const data = json.countries;
                setCountriesAuth(data);
                handleOnChange('country_code', data[0].country_code)
                handleOnChange('country_name', data[0].country_name)
                handleOnChange('calling_code', data[0].calling_code)
            }
        })
        .catch(e => console.log('RegisterView Error2: ', e))
    }

    useEffect(() => {
        if(!isOk) {
            timer.setInterval('get-countries2', getCountries, 5000)
        } else {
            timer.clearInterval('get-countries2')
        }
        return () => {
            if(timer.intervalExists('get-countries2')) timer.clearInterval('get-countries2')
        }
    }, [isOk])

    useEffect(() => {
        if(Object.keys(user).length > 0) {
            if(timer.intervalExists('get-countries2')) timer.clearInterval('get-countries2')
            goDashboard();
        }
    }, [user])

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <ScrollView nestedScrollEnabled={true} style={[ tw`` ]}>
                <View style={[tw`mb-5 relative`, {backgroundColor: ColorsEncr.main, borderBottomStartRadius: 480, borderBottomEndRadius: 580, width: windowWidth, height: 220}]}>
                    <ImageBackground source={require('../../../assets/images/DIGI-LEG-LOGO-2022-2.png')} style={{width:'100%', height:'95%', opacity:0.5}} />
                    <Image source={require('../../../assets/images/Untitled-design-24-980x551.png')} style={[ tw``, {position: 'absolute', right: 0, width: PixelRatio.getPixelSizeForLayoutSize(100), height: PixelRatio.getPixelSizeForLayoutSize(100), resizeMode: 'center'} ]} />
                </View>

                <Text style={[tw`text-center text-black text-2xl p-2 mt-3 mb-3`,{fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular'}]}>Inscrivez-vous</Text>
                
                <View style={tw`p-3 px-5`}>

                    {/* <CardView
                        cardElevation={3}
                        cardMaxElevation={8}
                        cornerRadius={1}>
                        <View style={tw`p-2 bg-zinc-200`}>
                            <View style={tw`flex-1 mr-1 relative`}>
                                {Object.keys(inputs.profil).length !== 0 && (
                                    <Icon type='evilicons' name='close' onPress={() => {
                                        handleOnChange('profil', {});
                                        handleError('profil', null);                                    
                                    }} size={35} containerStyle={[tw`rounded-full`, {position: 'absolute', right: 0, top: 0}]} />
                                )}
                                {errors.profil && (
                                    <Text style={tw`text-orange-700 text-sm`}>{errors.profil}</Text>
                                )}
                            </View>

                            <View style={tw`items-center`}>
                            <Pressable 
                                onPress={() => {
                                    openPanel('profil')
                                    handleSwipOptionsOnChange('showFilePicker', false)
                                    handleSwipOptionsOnChange('imageMultipleSelection', false)
                                }} 
                                style={[tw`justify-center items-center`, {height: 120, width: 120}]}
                            >
                                {Object.keys(inputs.profil).length !== 0 
                                ?
                                    // @ts-ignore
                                    <Image source={{uri: inputs.profil.uri}} style={{height: PixelRatio.getPixelSizeForLayoutSize(45), width: PixelRatio.getPixelSizeForLayoutSize(100)}} />
                                :
                                    <Icon type='feather' name='camera' size={40} reverse />
                                    // <Icon type='ant-design' name='user' size={40} reverse />
                                }
                            </Pressable>
                            </View>
                        </View>
                    </CardView> */}

                    <View style={[tw`mt-3 rounded-3xl justify-center items-center`, {backgroundColor: ColorsEncr.main, height: 230}]}>
                        <View style={{position:'relative', width:PixelRatio.getPixelSizeForLayoutSize(70), height:PixelRatio.getPixelSizeForLayoutSize(70)}}>
                            {Object.keys(inputs.profil).length !== 0
                                ? 
                                    <>
                                        <Image
                                            resizeMode='center'
                                            // @ts-ignore 
                                            source={{uri: inputs.profil.uri}} style={[tw`rounded-3xl border-2 border-white`,{height:'100%', width:'100%'}]} />
                                        <Icon type='ionicon' name='camera' size={30} color='#FFFFFF' 
                                            onPress={() => {
                                                openPanel('profil')
                                                handleSwipOptionsOnChange('showFilePicker', false)
                                                handleSwipOptionsOnChange('imageMultipleSelection', false)
                                            }} containerStyle={[tw`rounded-full p-1 border-l-2 border-t-2 border-white absolute right-1 bottom-1`,{backgroundColor: ColorsEncr.main}]} 
                                        />
                                        <Icon type='evilicons' name='close' onPress={() => {
                                                handleOnChange('profil', {});
                                                handleError('profil', null);                 
                                            }} size={35} color='#FFFFFF' containerStyle={[tw`rounded-full`, {position: 'absolute', right: 0, top: 0}]} />
                                    </>
                                : <TouchableOpacity 
                                        onPress={() => {
                                            openPanel('profil')
                                            handleSwipOptionsOnChange('showFilePicker', false)
                                            handleSwipOptionsOnChange('imageMultipleSelection', false)
                                        }} style={[tw`border rounded-full items-center justify-center border-2 border-white`,{width:'100%', height:'100%'}]}
                                    >
                                        <Icon type='fontawesome' name='camera' size={120} color='#FFFFFF' />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {errors.profil && (
                        <Text style={tw`text-orange-700 text-sm`}>{errors.profil}</Text>
                    )}

                    <InputForm
                        placeholder='Saisissez votre Nom'
                        value={inputs.nom}
                        error={errors.nom}
                        onChangeText={(text: any) => handleOnChange('nom', text)}
                        containerStyle={tw`mb-5 mt-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]} 
                    />
                    <InputForm
                        placeholder='Saisissez votre Prénom'
                        value={inputs.prenom}
                        error={errors.prenom}
                        onChangeText={(text: any) => handleOnChange('prenom', text)}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]} 
                    />
                    <InputForm
                        placeholder='Entrez votre e-mail'
                        value={inputs.email}
                        error={errors.email}
                        keyboardType='email-address'
                        onChangeText={(text: any) => handleOnChange('email', text)}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]}
                        helper='Optionnel *'
                        helperStyle={tw`text-orange-500`}
                        // leftComponent={<Icon type="material-community" name="email" size={35} color='silver' />}
                    />

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
                        error={errors.tel}
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
                        inputStyle={[ tw`text-base text-black py-0 ${Platform.OS == 'android' ? '' : 'pb-2'}` ]}    
                        onChangeText={(text: any) => handleOnChange('password', text)}
                        error={errors.password}
                        onFocus={()=>setPasswordHelperIsVisible(true)}
                        onBlur={()=>setPasswordHelperIsVisible(false)}
                        // leftComponent={<Icon type="material-community" name="key-variant" size={30} color='silver' />}
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

                    <Text style={[tw`text-black font-medium text-lg mt-2`]}>Document d'identification</Text>
                    <Text style={[tw`text-slate-400 mb-5`]}>Veuillez joindre les documents d'identification</Text>
                    <InputForm
                        label='Permis de conduire'
                        labelStyle={[tw`uppercase`]}
                        placeholder="Entrez le N° d'identification"
                        rightContent={
                            <Pressable onPress={() => {
                                    openPanel('file_permis')
                                    handleSwipOptionsOnChange('showFilePicker', true)
                                    handleSwipOptionsOnChange('imageMultipleSelection', false)
                            }}>
                                <Icon
                                    type='ant-design'
                                    name='pluscircle'
                                    color={Object.keys(inputs.file_permis).length > 0 ? 'rgb(22, 101, 52)' : '#F4F4F4'}/>
                            </Pressable>
                        }
                        helper={getFileName('file_permis')}
                        helperStyle={[tw`text-gray-500`]}
                        value={inputs.permis}
                        error={getErrors(errors.permis, errors.file_permis)}
                        onChangeText={(text: any) => handleOnChange('permis', text)}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]} 
                    />
                    <InputForm
                        label='cip'
                        labelStyle={[tw`uppercase`]}
                        placeholder="N° d'identification personnelle"
                        rightContent={
                            <Pressable onPress={() => {
                                    openPanel('file_cip')
                                    handleSwipOptionsOnChange('showFilePicker', true)
                                    handleSwipOptionsOnChange('imageMultipleSelection', false)
                                }}>
                                <Icon
                                    type='ant-design'
                                    name='pluscircle'
                                    color={Object.keys(inputs.file_cip).length > 0 ? 'rgb(22, 101, 52)' : '#F4F4F4'}/>
                            </Pressable>
                        }
                        helper={getFileName('file_cip')}
                        helperStyle={[tw`text-gray-500`]}
                        value={inputs.cip}
                        error={getErrors(errors.cip, errors.file_cip)}
                        onChangeText={(text: any) => handleOnChange('cip', text)}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]} 
                    />
                    <InputForm
                        label='Carte grise'
                        labelStyle={[tw`uppercase`]}
                        placeholder="N° d'immatriculation"
                        rightContent={
                            <Pressable onPress={() => {
                                    openPanel('file_carte_grise')
                                    handleSwipOptionsOnChange('showFilePicker', true)
                                    handleSwipOptionsOnChange('imageMultipleSelection', false)
                                }}>
                                <Icon
                                    type='ant-design'
                                    name='pluscircle'
                                    color={Object.keys(inputs.file_carte_grise).length > 0 ? 'rgb(22, 101, 52)' : '#F4F4F4'}/>
                            </Pressable>
                        }
                        helper={getFileName('file_carte_grise')}
                        helperStyle={[tw`text-gray-500`]}
                        value={inputs.carte_grise}
                        error={getErrors(errors.carte_grise, errors.file_carte_grise)}
                        onChangeText={(text: any) => handleOnChange('carte_grise', text)}
                        containerStyle={tw`mb-5`}
                        inputParentStyle={tw``}
                        inputContainerStyle={[tw`rounded-t-md border-b border-black bg-zinc-200 px-3`, {height: 55, borderBottomWidth: 1, borderColor: 'blue'} ]}
                        inputStyle={[ tw`py-0` ]} 
                    />

                    <TouchableOpacity 
                        onPress={() => {
                            openPanel('imgs_car')
                            handleSwipOptionsOnChange('showFilePicker', false)
                            handleSwipOptionsOnChange('imageMultipleSelection', true)
                        }}
                        activeOpacity={0.5} 
                        style={tw`flex-row justify-between items-center rounded-3xl p-4 ${inputs.imgs_car.length==0?'bg-neutral-200':'bg-yellow-400'}`}>
                        <Text style={tw` ${inputs.imgs_car.length==0?'text-black':'text-white'}`}>Image(s) de voiture</Text>
                        <Icon type='ant-design' name='pluscircle' color='#000000' />
                    </TouchableOpacity>
                    <View style={tw`mt-3 mb-5`}>
                        {inputs.imgs_car.length==0
                            ? <Text style={tw`text-black`}>Aucune image uploadée</Text>
                            : inputs.imgs_car.map((item: any, index: number) => (
                                <View key={index.toString()} style={tw`flex-row justify-between mb-2`}>
                                    <View style={tw`flex-row`}>
                                        <Image source={{uri: item.uri}} style={[tw`rounded-lg`,{height: PixelRatio.getPixelSizeForLayoutSize(22), width: PixelRatio.getPixelSizeForLayoutSize(22)}]} />
                                        <Text style={tw`text-black font-semibold ml-2`}>{format_size(item.size)}</Text>
                                    </View>
                                    <Pressable onPress={() => removeFile(index)}>
                                        <Icon type='antdesign' name='close' />
                                    </Pressable>
                                </View>
                            ))
                        }
                        {errors.imgs_car && (
                            <Text style={tw`text-orange-700 text-sm`}>{errors.imgs_car}</Text>
                        )}
                    </View>

                    <Button
                        onPress={onHandle}
                        color={ColorsEncr.main}
                        mode='contained'
                        loading={visible}
                        contentStyle={[tw`p-2`,{}]}
                        style={[tw`mt-5`,{borderRadius:0}]}
                    >Inscription</Button>

                    <Text style={[tw`text-center text-lg text-black my-10`, {fontFamily: Platform.OS == 'android' ? 'Raleway-VariableFont_wght' : 'PatrickHand-Regular'}]}>J'ai déjà un compte ? <Text style={tw`font-semibold border-b text-blue-400`} onPress={()=> navigation.canGoBack()?navigation.goBack():navigation.navigate('Auth')}>Je me connecte</Text>.</Text>
                </View>

            </ScrollView>

            <SwipeablePanelFile
                visible={isPanelActive}
                closePanel={closePanel}
                onCameraPickerSelected={onHandleCaptureImage}
                onPickerLibraryImage={onHandleSelectedImage}
                onFilePicker={handleFilePicker}
                {...swipOptions}
            />
        </Base>
    )
}

export default RegisterView;


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
    countryFlag: {
        height: 40,
        width: 60,
        // borderRadius: 20,
        backgroundColor: 'gray',
    }
});