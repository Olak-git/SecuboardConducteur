import { View, Text, Modal, Pressable, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'
import { setStopped } from '../../../../feature/init.slice'
import { resetCoords } from '../../../../feature/course.slice'
import { deleteUser } from '../../../../feature/user.slice'
import { Button } from 'react-native-paper'

interface SignoutProps {
    visible: boolean,
    setVisible: any,
    setVisibleValidationFormModal: any
}
const Signout: React.FC<SignoutProps> = ({visible, setVisible, setVisibleValidationFormModal}) => {

    const dispatch = useDispatch();
    
    const onSignOut = async() => {
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
                        <Icon type='material-community' name='account-off' color='red' size={40} containerStyle={tw`mb-3`} />
                        
                        <Text style={[ tw`text-center px-10 text-gray-700 font-normal text-sm mb-5` ]}>Souhaitez-vous vous déconnecter ?</Text>
                        
                        <View style={[ tw`flex-row justify-between items-center`, {} ]}>

                            <Button onPress={onSignOut} textColor='red' mode='outlined' style={tw`flex-1`}>Oui</Button>
                            <View style={tw`mx-2`}></View>
                            <Button onPress={() => setVisible(false)} mode='outlined' style={tw`flex-1`}>Annuler</Button>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default Signout