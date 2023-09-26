import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, PixelRatio, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, setUser } from '../../../feature/user.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { baseUri, fetchUri, toast, validateEmail } from '../../../functions/functions';
import { clone, storagePermission } from '../../../functions/helperFunction';
// @ts-ignore
import CardView from 'react-native-cardview';
import SwipeablePanelFile from '../../../components/SwipeablePanelFile';
import { Button } from 'react-native-paper';

const SectionData: React.FC<{
    iconType?: string,
    iconName: string,
    iconSize?: number,
    text: string
}> = ({iconType = 'font-awesome-5', iconName, iconSize = 20, text}) => {
    return (
        <View style={tw`flex-row mb-3 pb-2 border-b border-gray-200`}>
            <Icon type={iconType} name={iconName} size={iconSize} />
            <Text style={tw`text-black ml-2`}>{text}</Text>
        </View>  
    )
}

interface EditMyAccountViewProps {
    navigation: any
}
const EditMyAccountView: React.FC<EditMyAccountViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [showModal, setShowModal] = useState(false);

    const [isPanelActive, setIsPanelActive] = useState(false);

    const [inputs, setInputs] = useState({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        img: {}
    })

    const [errors, setErrors] = useState({
        nom: null,
        prenom: null,
        email: null,
        img: null
    })

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const openPanel = () => {
        setIsPanelActive(true);
    };
    const closePanel = () => {
        setIsPanelActive(false);
    };

    const getFileData = (r: any) => {
        return {
            "fileCopyUri": null, 
            "name": r.fileName, 
            "size": r.fileSize, 
            "type": r.type, 
            "uri": r.uri
        }
    }

    const onHandleCaptureImage = (resp: any) => {
        console.log('Capture Response: ', resp)
        setInputs((prevState: any) => ({
            ...prevState,
            img: getFileData(resp)
        }))
    }

    const onHandleSelectedImage = (resp: any) => {
        console.log('Selected Response: ', resp);
        setInputs((prevState: any) => ({
            ...prevState,
            img: getFileData(resp)
        }))
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

        if(valide) {
            Keyboard.dismiss();
            setShowModal(true);
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('profil[nom]', inputs.nom);
            formData.append('profil[prenom]', inputs.prenom);
            formData.append('profil[email]', inputs.email == null ? '' : inputs.email);
            if(Object.keys(inputs.img).length > 0) {
                formData.append('img', inputs.img);
            }
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
                setShowModal(false);
                if(json.success) {
                    console.log('User: ', json.user)
                    let image = json.user.img;
                    const data = clone(json.user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
                    toast('SUCCESS', 'Compte modifié');
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                }
            })
            .catch(error => {
                setShowModal(false);
                console.log('EditMyAccountView Error: ', error)
            })
        }
    }

    useEffect(() => {

    }, [])
    
    return (
        <Base>
            <ModalValidationForm showModal={showModal} />

            <Header navigation={navigation} headerTitle='Compte' />

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* <View style={[tw`rounded-b-3xl justify-center items-center`, { backgroundColor: ColorsEncr.main, height: 230 }]}>
                    <View style={tw`absolute left-0 top-0`}>
                        <Pressable onPress={() => navigation.goBack()} style={tw`p-2`}>
                            <Icon type='ant-design' name='arrowleft' size={30} color='#FFFFFF' />
                        </Pressable>
                    </View>
                    <View style={{ position: 'relative', width: PixelRatio.getPixelSizeForLayoutSize(50), height: PixelRatio.getPixelSizeForLayoutSize(50) }}>
                        {Object.keys(inputs.img).length !== 0
                            // @ts-ignore
                            ?
                            <>
                                <Image 
                                    // @ts-ignore
                                    source={{ uri: inputs.img.uri }} style={[tw`rounded-full border-2 border-white`, { height: '100%', width: '100%' }]} />
                                <Icon type='ionicon' name='camera' size={30} color='#FFFFFF' onPress={openPanel} containerStyle={[tw`rounded-full p-1 border-l-2 border-t-2 border-white absolute right-1 bottom-1`, { backgroundColor: ColorsEncr.main }]} />
                            </>
                            : user.img
                                ?
                                <>
                                    <Image source={{ uri: user.img }} style={[tw`rounded-full border-2 border-white`, { height: '100%', width: '100%' }]} />
                                    <Icon type='ionicon' name='camera' size={30} color='#FFFFFF' onPress={openPanel} containerStyle={[tw`rounded-full p-1 border-l-2 border-t-2 border-white absolute right-1 bottom-1`, { backgroundColor: ColorsEncr.main }]} />
                                </>
                                :
                                <TouchableOpacity onPress={openPanel} style={[tw`border rounded-full items-center justify-center border-2 border-white`, { width: '100%', height: '100%' }]}>
                                    <Icon type='fontawesome' name='camera' size={120} color='#FFFFFF' />
                                </TouchableOpacity>
                        }
                    </View>
                    <Text style={[tw`text-white text-lg mt-2`,{fontFamily:'Rajdhani-SemiBold'}]}>Modifier votre photo de profil</Text>
                </View> */}

                <View style={[ tw`mt-8 mb-3 px-5` ]}>

                    <View style={[tw`rounded-3xl justify-center items-center`, {backgroundColor: ColorsEncr.main, height: 230}]}>
                        <View style={{position:'relative', width:PixelRatio.getPixelSizeForLayoutSize(50), height:PixelRatio.getPixelSizeForLayoutSize(50)}}>
                            {Object.keys(inputs.img).length !== 0
                                ? 
                                    <>
                                        <Image
                                            resizeMode='center'
                                            // @ts-ignore 
                                            source={{uri: inputs.img.uri}} style={[tw`rounded-full border-2 border-white`,{height:'100%', width:'100%'}]} />
                                        <Icon type='ionicon' name='camera' size={30} color='#FFFFFF' onPress={openPanel} containerStyle={[tw`rounded-full p-1 border-l-2 border-t-2 border-white absolute right-1 bottom-1`,{backgroundColor: ColorsEncr.main}]} />
                                    </>
                                : user.img
                                    ? 
                                        <>
                                            <Image source={{uri: user.img}} style={[tw`rounded-full border-2 border-white`,{height:'100%', width:'100%'}]} />
                                            <Icon type='ionicon' name='camera' size={30} color='#FFFFFF' onPress={openPanel} containerStyle={[tw`rounded-full p-1 border-l-2 border-t-2 border-white absolute right-1 bottom-1`,{backgroundColor: ColorsEncr.main}]} />
                                        </>
                                    : 
                                        <TouchableOpacity onPress={openPanel} style={[tw`border rounded-full items-center justify-center border-2 border-white`,{width:'100%', height:'100%'}]}>
                                            <Icon type='fontawesome' name='camera' size={120} color='#FFFFFF' />
                                        </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {errors.img && (
                        <Text style={tw`text-orange-700 text-sm`}>{errors.img}</Text>
                    )}

                    {/* <Text style={tw`text-black text-center text-lg mb-8`}>Editer votre compte</Text> */}

                    {/* <CardView
                        cardElevation={3}
                        cardMaxElevation={8}
                        cornerRadius={1}>
                        <View style={tw`p-2 bg-zinc-200`}>
                            <View style={tw`flex-1 mr-1 relative`}>
                                {Object.keys(inputs.img).length !== 0 && (
                                    <Icon type='evilicons' name='close' onPress={() => {
                                        handleOnChange('img', {});
                                        handleError('img', null);                                    
                                    }} size={35} containerStyle={[tw`rounded-full`, {position: 'absolute', right: 0, top: 0}]} />
                                )}
                                {errors.img && (
                                    <Text style={tw`text-orange-700 text-sm`}>{errors.img}</Text>
                                )}
                            </View>

                            <View style={tw`items-center`}>
                            <Pressable 
                                onPress={openPanel} 
                                style={[tw`justify-center items-center`, {height: 120, width: 120}]}
                            >
                                {Object.keys(inputs.img).length !== 0
                                    // @ts-ignore
                                    ? <Image source={{uri: inputs.img.uri}} style={{height: PixelRatio.getPixelSizeForLayoutSize(45), width: PixelRatio.getPixelSizeForLayoutSize(100)}} />
                                    : user.img
                                        ? <Image source={{uri: user.img}} style={{height: PixelRatio.getPixelSizeForLayoutSize(45), width: PixelRatio.getPixelSizeForLayoutSize(100)}} />
                                        : <Image source={require('../../../assets/images/user-1.png')} style={{height: PixelRatio.getPixelSizeForLayoutSize(45), width: PixelRatio.getPixelSizeForLayoutSize(100)}} />
                                }
                            </Pressable>
                            </View>
                        </View>
                    </CardView> */}

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
                    />

                    <Button
                        onPress={onHandle}
                        color={ColorsEncr.main}
                        mode='elevated'
                        loading={showModal}
                        contentStyle={[tw`p-2`,{}]}
                        style={[tw`mt-5`,{borderRadius:0}]}
                        labelStyle={tw`uppercase font-medium`}
                    >Enregistrer</Button>

                </View>

            </ScrollView>

            <SwipeablePanelFile
                visible={isPanelActive}
                closePanel={closePanel}
                onCameraPickerSelected={onHandleCaptureImage}
                onPickerLibraryImage={onHandleSelectedImage}
                // onFilePicker={handleFilePicker}
                showFilePicker={false}
            />
        </Base>
    )

}

export default EditMyAccountView;