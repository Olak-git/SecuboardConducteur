import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';
import SearchBar from '../../../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import BottomButton from '../../../components/BottomButton';
import { WtCar1 } from '../../../assets';
import RenderItemCourseInstantane from '../../../components/RenderItemCourseInstantane';
import { REFRESH_CONTROL_COLOR } from '../../../data/data';
import { setStopped } from '../../../feature/init.slice';

const timer = require('react-native-timer');

interface ReservationsViewProps {
    navigation: any
}
const ReservationsView: React.FC<ReservationsViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();
    
    const user = useSelector((state: any) => state.user.data);

    const disponibilite = useSelector((state: any) => state.init.disponibilite);

    const reload = useSelector((state: any) => state.reload.value);
    const refresh = useSelector((state: any) => state.refresh.historique_reservations);

    const refList = useRef(null);

    const [visible, setVisible] = useState(false);
    const [reservations, setReservations] = useState<any>([]);
    const [masterReservations, setMasterReservations] = useState<any>([]);
    const [reservationEmptyText, setReservationEmptyText] = useState('Aucune réservation disponible dans votre historique');
    const [searchItem, setSearchItem] = useState('');
    const [endFetch, setEndFetch] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(false);

    const getReservations = () => {
        if(!visible) {
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('reservations-course', null);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async json => {
                // console.log('Réservations => ', json.reservations);
                console.log('Réservations => ', json.reservations.length);
                setRefreshing(false);
                if(json.success) {
                    const newData = await json.reservations.filter(function (item: any) {
                        return item.conducteur || (!item.conducteur && disponibilite);
                        //  !(!item.conducteur && !disponibilite)
                    });
                    setReservations([...newData]);
                    setMasterReservations([...newData]);
                    setEndFetch(true);
                } else {
                    const errors = json.errors;
                    console.log(errors);
                }
            })
            .catch(error => console.log('ReservationsView Error: ', error))
        }
    }

    const filterItemFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterReservations.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setReservationEmptyText('Aucun résultat trouvé');
            setReservations(newData);
            setSearchItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setReservations(masterReservations);
            setSearchItem(text);
            setReservationEmptyText('Aucune discussion');
            setLoading(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getReservations();
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        return (
            <RenderItemCourseInstantane key={index.toString()} navigation={navigation} routeName='DashDetailsReservation' item={item} />
        )      
    }

    DeviceEventEmitter.addListener("event.cleartimer", (eventData) => {
        timer.clearInterval('reservations-course');
    });

    useEffect(() => {
        timer.setInterval('reservations-course', getReservations, 5000);
        return () => {
            timer.clearInterval('reservations-course');
            DeviceEventEmitter.removeAllListeners("event.cleartimer");
        }
    }, [visible])

    useEffect(() => {
        getReservations();
    }, [refresh])

    useEffect(() => {
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle='Réservations'
                contentLeft={
                    visible
                    ?
                        <Pressable onPress={() => setVisible(false)}>
                            <Icon
                                type='ant-design'
                                name='arrowleft'
                                size={30} />
                        </Pressable>
                    :
                        undefined
                } 
                content={
                    visible
                    ?
                        <SearchBar 
                            iconSearchColor='grey'
                            iconSearchSize={20}
                            loadingColor='grey'
                            containerStyle={[ tw`flex-1 px-3 rounded-lg border-0 bg-gray-200` ]}
                            inputContainerStyle={tw`border-b-0`}
                            placeholder='Rechercher'
                            value={searchItem}
                            showLoading={loading}
                            onChangeText={filterItemFunction}
                            onEndEditing={() => setLoading(false)}
                        />
                    :
                        <View style={tw`flex-1 flex-row items-center justify-between`}>
                            <HeaderTitle title='Réservations' />
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />
            {endFetch
            ?
                <>
                    {!disponibilite && (
                        <Text style={tw`rounded-md bg-red-200 text-red-800 text-center mx-3 mt-2 mb-4 text-red-600 font-bold p-3`}>Vous êtes hors service. Vous ne pouvez pas voir les courses en attente.</Text>
                    )}
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                colors={REFRESH_CONTROL_COLOR}
                                refreshing={refreshing} 
                                onRefresh={onRefresh} />
                        }
                        removeClippedSubviews={true}
                        initialNumToRender={reservations.length - 1}
                        keyboardDismissMode='none'
                        ListEmptyComponent={ 
                            <View>
                                <Text style={tw`text-gray-400`}>{ reservationEmptyText }</Text>
                            </View>
                        }
                        data={reservations}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ref={refList}
                        contentContainerStyle={[ tw`px-4 pt-2 pb-10 mt-2` ]}
                    />
                </>
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default ReservationsView;