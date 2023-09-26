import { View, Text, StatusBar, Platform, Image, Pressable, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { ColorsEncr } from '../../assets/styles'
import { Icon } from '@rneui/base'
import { Accueil, Accueil1, Accueil2, Destination } from '../../assets'
import { format_size, getCurrency, windowHeight, windowWidth } from '../../functions/functions'
import DrawerMenu, { DrawerMenuText } from '../../view/Dashboard/HomeView/components/DrawerMenu'
import { Wave, Wave1, Wave2, Wave3, Wave4 } from '../../assets';
import { Badge } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { setStopped } from '../../feature/init.slice'
import { deleteUser } from '../../feature/user.slice'
import { resetCoords } from '../../feature/course.slice'
import { ModalValidationForm } from '../../components/ModalValidationForm'
import { Rating } from 'react-native-ratings'

const timer = require('react-native-timer');

interface CustomSideMenuProps {
    user: any,
    navigation: any,
    notifs: number
}
const CustomSideMenu: React.FC<CustomSideMenuProps> = ({user, navigation, notifs}) => {
    const src = user.img ? {uri: user.img} : require('../../assets/images/user-1.png');
    const {height} = useWindowDimensions();
    
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false)

    const data = useSelector((state:any) => state.user);
    const total_km = useSelector((state:any) => state.user.total_km);
    const total_course = useSelector((state:any) => state.user.total_course);
    const scores = useSelector((state:any) => state.user.scores);

    const onSignOut = async () => {
        await dispatch(setStopped(true));
        setVisible(true);
        setTimeout(async () => {
            setVisible(false);
            await dispatch(resetCoords());
            await dispatch(deleteUser());
        }, 5000)
    }

    useEffect(() => {
        console.log('data: ', data)
        console.log('total_course: ', total_course)
        console.log('total_km: ', total_km)
    }, [])

    return (
        <>
        <ModalValidationForm showModal={visible} />
        <View style={[ tw`relative`, {height: '100%', paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0} ]}>
            <View style={[tw`px-4 py-3`,{minHeight: 120, backgroundColor: ColorsEncr.main}]}>
                <View style={tw`flex-row items-center`}>
                    <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`rounded-full`}>
                    <Image
                        defaultSource={require('../../assets/images/user-1.png')}
                        resizeMode='contain'
                        source={src} style={[tw`rounded-full border-2 border-neutral-50`, {height:70, width:70}]}
                    />
                    </Pressable>
                    <View style={tw`flex-1 ml-3`}>
                        <Text style={[ tw`text-white font-semibold text-base`, {} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
                        <View style={tw`flex-row mt-2`}>
                            <View style={[tw`flex-row rounded-3xl items-center justify-center bg-white py-1 px-3`,{minWidth: 100}]}>
                                <Rating readonly startingValue={scores/5} ratingCount={1} imageSize={16} ratingColor={ColorsEncr.main} />
                                <Text style={tw`font-semibold text-yellow-400 ml-1`}>Conducteur</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={tw`flex-row justify-between items-center mt-4`}>
                    <View style={tw`items-center`}>
                        <Icon type='ant-design' name='dashboard' color='#FFFFFF' size={22} />
                        <Text style={tw`text-white font-bold text-sm mt-1`}>{parseFloat(total_km)>=1000?format_size(parseFloat(total_km)):total_km} km</Text>
                        <Text style={tw`text-white text-xs`}>Distance Total</Text>
                    </View>
                    <View style={tw`items-center`}>
                        <Icon type='simple-line-icon' name='notebook' color='#FFFFFF' size={22} />
                        <Text style={tw`text-white font-bold text-sm mt-1`}>{parseInt(total_course)>=1000?format_size(parseInt(total_course)):total_course.toString().padStart(3, '0')}</Text>
                        <Text style={tw`text-white text-xs`}>Course Total</Text>
                    </View>
                </View>
            </View>

            {/* <View style={[ tw`justify-center items-center`, {height: 120, backgroundColor: ColorsEncr.main} ]}>
                <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
                    <Image
                        defaultSource={require('../../assets/images/user-1.png')}
                        source={src}
                        style={[tw`rounded-full`, {height: 70, width: 70}]}
                    />
                </Pressable>
                <Text style={[ tw`text-white font-semibold text-center px-3`, {width: '100%'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
            </View> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                <View style={[ tw`px-4 py-3` ]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DashPortefeuille')}
                        style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50 mb-2` ]}>
                        <Icon type="font-awesome-5" name="wallet" size={22} color='#CCCCCC' />
                        <View style={[ tw`px-4` ]}>
                            <DrawerMenuText text='Portefeuille' textStyle={tw`text-sm px-0`} />
                            <Text style={[ tw`text-black font-bold text-xl` ]}>{ getCurrency(user.portefeuille) } F</Text>
                        </View>
                    </TouchableOpacity>
                    <DrawerMenu navigation={navigation} screenName='DashMyAccount' iconType='font-awesome-5' iconName='user-alt' textMenu='Mon compte' />
                    <DrawerMenu disabled={user.compte_business == 1 && user.actif == 0 ? true : false} navigation={navigation} screenName='DashHistoriqueCourses' iconType='fontisto' iconName='car' textMenu='Mes courses' />

                    <TouchableOpacity
                        onPress={() => navigation.navigate('DashNotifications')}
                        style={[ tw`flex-row items-center py-2 px-3 border-b border-slate-50 border-b-0 mb-2` ]}>
                        <View style={tw`relative`}>
                            <Icon type='ionicon' name='ios-notifications-sharp' color='#CCCCCC' />
                            <Badge children={notifs} visible={notifs !== 0} style={tw`absolute left-3 bottom-3`} />
                        </View>
                        <DrawerMenuText text='Notifications' />
                    </TouchableOpacity>
                    <DrawerMenu navigation={navigation} screenName='DashParametres' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                    <DrawerMenu navigation={navigation} screenName='DashHelp' iconType='entypo' iconName='help' textMenu='Aide' />
                    <TouchableOpacity
                        onPress={onSignOut}
                        style={[ tw`flex-row items-center py-2 px-3` ]}>
                        <Icon type="font-awesome-5" name="power-off" size={22} color='#CCCCCC' />
                        <DrawerMenuText text='Déconnexion' textStyle={tw`text-red-600`} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {height === windowHeight && (
                <View style={{position: 'absolute', zIndex:-2, bottom: 0, left: 0, width: '100%'}}>
                    <Accueil2 width='100%' height={200} opacity={0.2} />
                    {/* <Accueil width='100%' opacity={0.2} /> */}
                </View>
            )}
            <View style={[tw``,{position: 'absolute', bottom: -15, left: -5, width: '101.8%', height: 90, transform: [{rotateX: '180deg'}]}]}>
                <Wave1 opacity={1} />
            </View>
        </View>
        </>
    )
}

export default CustomSideMenu