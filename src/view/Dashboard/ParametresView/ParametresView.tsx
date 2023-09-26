import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrency, toast } from '../../../functions/functions';
import { formatChaineHid } from '../../../functions/helperFunction';
import { deleteUser, setUser } from '../../../feature/user.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { resetCoords } from '../../../feature/course.slice';
import { otp_authentication, phone_number_test } from '../../../data/data';
import Signout from './components/Signout';
import { setStopped } from '../../../feature/init.slice';
import DeleteAccount from './components/DeleteAccount';

const timer = require('react-native-timer');

interface ParamItemProps {
    title?: string,
    titleComponent?: React.ReactElement,
    description?: string,
    onPress?: any,
    hasDivider?: boolean,
    disabled?: boolean
}
const ParamItem: React.FC<ParamItemProps> = ({title, titleComponent, description, onPress=()=>{}, hasDivider = true, disabled}) => {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                touchSoundDisabled
                activeOpacity={0.5}
                style={tw`flex-1 px-3`}
            >
                {titleComponent && (
                    titleComponent
                )}
                {title && (
                    <View style={tw`flex-row`}>
                        <Text style={[tw`text-base mb-1 text-gray-500`, {fontFamily: 'YanoneKaffeesatz-Regular'}]}>{title}</Text>
                    </View>
                )}
                {description && (
                    <Text style={tw`text-xs text-slate-500`}>{description}</Text>
                )}
            </TouchableOpacity>
            {hasDivider && (
                <View style={tw`px-5 my-3`}><Divider /></View>
                // <View style={tw`px-5 my-3`}><Divider color='#ffffff' /></View>
            )}
        </>
    )
}

interface ParametresViewProps {
    navigation: any
}
const ParametresView: React.FC<ParametresViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [dialogAuth, setDialogAuth] = useState(false);

    const [dialogSignOut, setDialogSignOut] = useState(false);

    const [dialogDeleteAccount, setDialogDeleteAccount] = useState(false);

    const [inputCode, setInputCode] = useState('');

    const [visible, setVisible] = useState(false);

    const [disabled, setDisabled] = useState(false);

    const onHandleSetCode = (code: string) => {
        setInputCode(code);
        const regExp = /^[0-9]{6}/g;
    }

    const goUpdateTelScreen = () => {
        navigation.navigate('DashUpdateTel');
    }

    useEffect(() => {
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
            setVisible(false);
            setDialogSignOut(false);
        }
    }, [])

    useEffect(() => {
        // let wt: any | null = null;
        // if(Object.keys(user).length == 0) {
        //     wt = setTimeout(() => {
        //         // navigation.dispatch(
        //         //     CommonActions.reset({
        //         //         index: 0,
        //         //         routes: [
        //         //             {name: 'Auth'}
        //         //         ]
        //         //     })
        //         // )
        //     }, 2000);
        // }

        // return () => {
        //     if(wt) {
        //         clearTimeout(wt);
        //     }
        // }
    }, [user])

    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            <Signout visible={dialogSignOut} setVisible={setDialogSignOut} setVisibleValidationFormModal={setVisible} />
            <DeleteAccount visible={dialogDeleteAccount} setVisible={setDialogDeleteAccount} setVisibleValidationFormModal={setVisible} user={user} />

            <Header navigation={navigation} headerTitle='Paramètres' />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`mt-3`}>
                <View style={tw`px-5`}>
                    <View style={tw`bg-gray-100 rounded-xl p-4`}>

                        <ParamItem title='Changer mon numéro'
                            onPress={goUpdateTelScreen}
                            description='Procéder au changement de votre numéro de téléphone.'
                        />

                        <ParamItem title='Modifier mon mot de passe'
                            onPress={() => navigation.navigate('DashUpdatePassword')}
                            description='Pour des raisons de sécurité, mettez à jour votre mot de passe.'
                        />

                        <ParamItem title='Me déconnecter'
                            onPress={() => setDialogSignOut(true)}
                            description='Procéder à la déconnexion de votre compte. Par mesure de sécurité, il est important de vous déconnecter avant de changer votre téléphone portable.'
                        />

                        <ParamItem title='Supprimer mon compte' hasDivider={false}
                            onPress={() => setDialogDeleteAccount(true)}
                            // onPress={() => navigation.navigate('DashboadSetting', { title: 'A propos', key: 'a-propos', index: 3 })}
                        />
                    </View>
                </View>
                
            </ScrollView>
        </Base>
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

export default ParametresView;