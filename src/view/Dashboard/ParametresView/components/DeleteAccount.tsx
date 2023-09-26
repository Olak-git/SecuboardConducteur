import { View, Text, Modal, Pressable, TouchableOpacity, Platform, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { Icon } from '@rneui/base'
import tw from 'twrnc';
import { useDispatch } from 'react-redux';
import { resetCoords } from '../../../../feature/course.slice';
import { setStopped } from '../../../../feature/init.slice';
import { deleteUser } from '../../../../feature/user.slice';
import { fetchUri } from '../../../../functions/functions';
import { ActivityIndicator, Button } from 'react-native-paper';

interface DeleteAccountProps {
    visible: boolean,
    setVisible: any,
    setVisibleValidationFormModal: any,
    user: any
}
const DeleteAccount: React.FC<DeleteAccountProps> = ({visible, setVisible, setVisibleValidationFormModal, user}) => {
    const dispatch = useDispatch();

    const [accept, setAccept] = useState(false);

    const onSignOut = async () => {
        await dispatch(setStopped(true));
        setVisibleValidationFormModal(true);
        setVisible(false);
        setTimeout(async () => {
            // setVisible(false);
            setVisibleValidationFormModal(false)
            await dispatch(resetCoords());
            await dispatch(deleteUser());
        }, 5000)
    }

    const onHandleDeleteAccount = () => {
        setAccept(true);
        const formData = new FormData();
        formData.append('js', null);
        formData.append('delete-account', null);
        formData.append('token', user.slug);
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
            if(json.success) {
                onSignOut();
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
            }
        })
        .catch(error => {
            setAccept(false);
            console.log(error)
        })
    }

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <View style={[ tw`flex-1 justify-center items-center`, {backgroundColor: 'rgba(0, 0, 0, 0.5)'} ]}>
                <Pressable
                    onPress={() => setVisible(false)}
                    // @ts-ignore
                    style={[tw`absolute right-5`, {top: Platform.OS == 'android' ? StatusBar.currentHeight + 5 : 5}]}>
                    <Icon type='ant-design' name='close' size={40} color='black' />
                </Pressable>
                <View style={[ tw`bg-white justify-center items-center rounded-2xl p-3`, {height: 300, width: 300} ]}>
                    <View style={tw``}>
                        <Icon type='entypo' name='trash' color='red' size={40} containerStyle={tw`mb-3`} />
                        <Text style={[ tw`text-center px-10 text-gray-700 font-normal text-sm mb-5` ]}>Souhaitez-vous supprimer votre compte ?</Text>
                        {accept
                            ?
                                <ActivityIndicator />
                            :
                                <View style={[ tw`flex-row justify-between items-center`, {} ]}>

                                    <Button onPress={onHandleDeleteAccount} textColor='red' mode='outlined' style={tw`flex-1`}>Oui</Button>
                                    <View style={tw`mx-2`}></View>
                                    <Button onPress={() => setVisible(false)} mode='outlined' style={tw`flex-1`}>Annuler</Button>

                                </View>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteAccount