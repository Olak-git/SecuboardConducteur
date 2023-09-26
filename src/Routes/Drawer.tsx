import { View, Text, Pressable, Image, useWindowDimensions, StatusBar, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer';
import HelpView from '../view/Dashboard/HelpView/HelpView';
import HomeView from '../view/Dashboard/HomeView/HomeView';
import MyAccountView from '../view/Dashboard/MyAccountView/MyAccountView';
import ParametresView from '../view/Dashboard/ParametresView/ParametresView';
import PortefeuilleView from '../view/Dashboard/PortefeuilleView/PortefeuilleView';
import { Icon } from '@rneui/base';
import tw from 'twrnc';
import { ColorsEncr } from '../assets/styles';
import { fetchUri, getCurrency, toast, windowWidth } from '../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { LogoDark, Wallet } from '../assets';
import { ActivityIndicator, Badge, Switch as SwitchPaper } from 'react-native-paper';
import { DrawerActions } from '@react-navigation/native';
import CustomSideMenu from './components/CustomSideMenu';
import HistoriqueCoursesView from '../view/Dashboard/HistoriqueCoursesView/HistoriqueCoursesView';
import { setDisponibilite } from '../feature/init.slice';
import { getErrorsToString } from '../functions/helperFunction';

const HomeHeader: React.FC<{navigation: any, user: any, notifs: number}> = ({navigation, user, notifs}) => {

    const dispatch = useDispatch();
    const disponibilite = useSelector((state: any) => state.init.disponibilite);
    const [disabled, setDisabled] = useState(false);

    const onHandlePicker = (value: boolean): void => {
        setDisabled(true);
        const formData = new FormData()
        formData.append('js', null);
        formData.append('update-state', null);
        formData.append('value', value);
        formData.append('token', user.slug)
        console.log('FormData: ', formData);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                dispatch(setDisponibilite(value));
                // let image = json.user.img;
                // const data = clone(json.user);
                // if(data.img) {
                //     data.img = `${baseUri}/assets/avatars/${image}`;
                // }
                // dispatch(setUser({...data}));
                // let c = 0;
                // const notifications = json.notifications;
                // notifications.map((v: any) => {
                //     if(notifies.indexOf(v.id) == -1) {
                //         c++;
                //     }
                // })
                // setCountNotifs(c);
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
                toast('DANGER', getErrorsToString(errors));
            }
            setDisabled(false);
        })
        .catch(e => {
            setDisabled(false);
            console.warn(e)
        })
    }
    
    useEffect(() => {
        console.log('notifs: ', notifs);
    }, [notifs])

    return (
        <View style={[tw`flex-row justify-between items-center`, {width: Platform.OS == 'android' ? '100%' : (windowWidth - 90)}]}>
            {/* <LogoDark /> */}
            <Text></Text>
            <Text style={[tw`uppercase text-center text-black text-lg mr-2`, { maxWidth: windowWidth - 100 }]}>{disponibilite ? 'en service' : 'hors service'}</Text>
            {/* <Text style={[tw`text-black uppercase`, { fontSize: 40, fontFamily: Platform.OS == 'android' ? 'ShadowsIntoLight-Regular' : 'PatrickHand-Regular', lineHeight: Platform.OS == 'android' ? 55 : 48 }]}>Secu<Text style={{ color: ColorsEncr.main }}>board</Text></Text> */}
            <Pressable onPress={() => navigation.navigate('DashNotifications')} style={tw`relative flex-row`}>
                {/* <Icon type='ionicon' name='ios-notifications-sharp' size={30} /> */}
                {/* <Badge children={notifs} visible={notifs !== 0} style={tw`absolute left-4`} /> */}
                {disabled && (
                    <ActivityIndicator size={18} color='#CCC' />
                )}
                <SwitchPaper disabled={user.compte_business == 1 && user.actif == 0 ? true : disabled} value={disponibilite} onValueChange={(value) => onHandlePicker(value)} />
            </Pressable>
        </View>
    )
}

const Drawer: React.FC<{navigation: any}> = ({navigation}) => {
    const Drawer = createDrawerNavigator();
    const user = useSelector((state: any) => state.user.data);
    const src = user.img ? {uri: user.img} : require('../assets/images/user-1.png');
    const notifs = useSelector((state: any) => state.notifications.count)
    
    const [countNotifs, setCountNotifs] = useState(0);

    const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

    const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

    return (
        <Drawer.Navigator initialRouteName='DashHome'
            drawerContent={(props) => <CustomSideMenu {...props} user={user} navigation={navigation} notifs={notifs} />}
            screenOptions={{
                drawerType: 'front',
                headerTintColor: 'black',
                headerStatusBarHeight: Platform.OS == 'android' ? StatusBar.currentHeight : 30
                // headerShown: false,
                // headerShadowVisible: false
            }}
        >
            <Drawer.Screen  name='DashHome' component={HomeView} options={{
                drawerLabel: () => <View style={[ tw`justify-center items-center border`, {height: 120, width: '100%'} ]}>
                                        <Pressable onPress={() => navigation.navigate('DashMyAccount')} style={tw`mb-2 rounded-full`}>
                                            <Image
                                                defaultSource={require('../assets/images/user-1.png')}
                                                source={src}
                                                style={[tw`rounded-full`, {height: 70, width: 70}]}
                                            />
                                        </Pressable>
                                        <Text style={[ tw`text-white font-semibold text-center px-3`, {width: '100%'} ]} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.prenom}</Text>
                                    </View>,
                drawerActiveBackgroundColor: '#fff',
                drawerItemStyle: [tw`p-0 m-0`, {backgroundColor: ColorsEncr.main, borderRadius: 0}],
                drawerLabelStyle: [tw`bg-red-500 p-0 m-0`],
                // title: () => <HomeHeader navigation={navigation} countNotifs={countNotifs} />,
                headerTitle: () => <HomeHeader navigation={navigation} user={user} notifs={notifs} />,
            }} />
            <Drawer.Screen  name='DashPortefeuille' component={PortefeuilleView} options={{
                headerShown: false,
                drawerLabel: () => <View style={[ tw`px-4` ]}>
                    <Text style={[ tw`text-gray-800` ]}>Portefeuille</Text>
                    <Text style={[ tw`text-black font-bold text-xl` ]}>{ getCurrency(user.portefeuille) } F</Text>
                </View>,
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='font-awesome-5' name='wallet' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashMyAccount' component={MyAccountView} options={{
                headerShown: false,
                drawerType: 'slide',
                drawerLabel: 'Mon compte',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='material' name='account-circle' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashHistoriqueCourses' component={HistoriqueCoursesView} options={{
                headerShown: false,
                drawerLabel: 'Mes courses',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='font-awesome-5' name='car-alt' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashParametres' component={ParametresView} options={{
                headerShown: false,
                drawerLabel: 'Paramètres',
                drawerItemStyle: [tw`border-b border-slate-50`],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='ionicon' name='ios-settings-sharp' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
            <Drawer.Screen  name='DashHelp' component={HelpView} options={{
                headerShown: false,
                drawerLabel: 'Aide',
                drawerItemStyle: [tw``],
                drawerLabelStyle: [tw`text-lg text-gray-500`],
                drawerIcon: () => <Icon type='entypo' name='help' color={ColorsEncr.main} size={25} containerStyle={tw``} />
            }} />
        </Drawer.Navigator>
    )
}

export default Drawer