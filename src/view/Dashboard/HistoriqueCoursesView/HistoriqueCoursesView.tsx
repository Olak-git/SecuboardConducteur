import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import SearchBar from '../../../components/SearchBar';
import { useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { getLocalDate, getLocalTime, getLocalTimeStr } from '../../../functions/helperFunction';
import BottomButton from '../../../components/BottomButton';
import { WtCar1 } from '../../../assets';
import RenderItemCourseInstantane from '../../../components/RenderItemCourseInstantane';
import RenderItemCourseCovoiturage from '../../../components/RenderItemCourseCovoiturage';
import { REFRESH_CONTROL_COLOR } from '../../../data/data';

interface HistoriqueCoursesViewProps {
    navigation: any
}
const HistoriqueCoursesView: React.FC<HistoriqueCoursesViewProps> = ({ navigation }) => {

    const user = useSelector((state: any) => state.user.data);

    const reload = useSelector((state: any) => state.reload.value);

    const refList = useRef(null);

    const [refreshing, setRefreshing] = useState(false);

    const [masterCourses, setMasterCourses] = useState<any>({
        instantanes: [],
        reservations: [],
        covoiturages: []
    });

    const [courses, setCourses] = useState<any>({
        instantanes: [],
        reservations: [],
        covoiturages: []
    });

    const [courseEmptyText, setCourseEmptyText] = useState('Aucune course disponible dans votre historique.');

    const [search, setSearch] = useState<string>('');

    const [endFetch, setEndFetch] = useState(false);

    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);

    const getCourses = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        formData.append('courses', null);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setRefreshing(false);
            if(json.success) {
                // console.log(json);
                // console.log('Inst: ', json.courses_instantanes);
                setCourses((state: any) => ({
                    ...state,
                    instantanes: [...json.courses_instantanes],
                    reservations: [...json.reservations],
                    covoiturages: [...json.covoiturages]
                }));

                setMasterCourses((state: any) => ({
                    ...state,
                    instantanes: [...json.courses_instantanes],
                    reservations: [...json.reservations],
                    covoiturages: [...json.covoiturages]
                }));
                setEndFetch(true);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log('HistoriqueCoursesView Error: ', error)
            setRefreshing(false);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getCourses();
    }

    const filter = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData1 = masterCourses.instantanes.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.passager.nom} ${item.passager.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            const newData2 = masterCourses.reservations.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.passager.nom} ${item.passager.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            const newData3 = masterCourses.covoiturages.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setCourseEmptyText('Aucun résultat trouvé');
            // setCourses(newData);
            setCourses((state: any) => ({
                ...state,
                instantanes: newData1,
                reservations: newData2,
                covoiturages: newData3
            }));
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setCourseEmptyText('Aucune course disponible dans votre historique.');
            setCourses(masterCourses);
            setSearch('');
            setLoading(false);
        }
    }

    // @ts-ignore
    const renderItemCourseInstantane = (item, index) => {
        return (
            <RenderItemCourseInstantane key={'ci-' + index.toString()} navigation={navigation} routeName='DashDetailsCourse' item={item} />
        )
    }

    // @ts-ignore
    const renderItemReservation = (item, index) => {
        return (
            <RenderItemCourseInstantane key={'res-' + index.toString()} navigation={navigation} routeName='DashDetailsReservation' item={item} />
        )      
    }

    // @ts-ignore
    const renderItemCovoiturage = (item, index) => {
        return (
            <RenderItemCourseCovoiturage key={'cov-' + index.toString()} navigation={navigation} item={item} />
        )
    }

    useEffect(() => {
        getCourses();
    }, [reload])
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle='Historique des Courses'
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
                            value={search}
                            onChangeText={filter}
                            showLoading={loading}
                            onEndEditing={() => setLoading(false)}
                        />
                    :
                        <View style={tw`flex-1 flex-row items-center justify-between`}>
                            <Text style={[tw`px-4 text-sm text-black`,{fontFamily: 'Audiowide-Regular'}]}>Historique des Courses</Text>
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />
            {endFetch
            ?
                <>
                    <ScrollView
                        ref={refList}
                        refreshControl={
                            <RefreshControl
                                colors={REFRESH_CONTROL_COLOR}
                                refreshing={refreshing} 
                                onRefresh={onRefresh} />
                        }
                        contentContainerStyle={[ tw`px-4 pt-2 pb-5` ]}                 
                    >
                        {courses.instantanes.length == 0 && courses.reservations.length == 0 && courses.covoiturages.length == 0
                        ?
                            <View>
                                <Text style={tw`text-gray-400`}>{ courseEmptyText }</Text>
                            </View>
                        :
                            user.compte_business == 1
                            ?
                                <>
                                    <View style={[ tw`flex-row items-center mb-5`, {}]}>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                        <Text style={[ tw`text-black text-xs font-bold px-4 border rounded-2xl` ]}>Courses instantanées</Text>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                    </View>
                                    {courses.instantanes.length == 0
                                    ?
                                        <Text style={tw`text-black mb-3`}>Aucune course disponible.</Text>
                                    :
                                        courses.instantanes.map((item: any, index: number) => renderItemCourseInstantane(item, index))
                                    }

                                    <View style={[ tw`flex-row items-center my-5`, {}]}>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                        <Text style={[ tw`text-black text-xs font-bold px-4 border rounded-2xl` ]}>Réservations</Text>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                    </View>
                                    {courses.reservations.length == 0
                                    ?
                                        <Text style={tw`text-black mb-3`}>Aucune course disponible.</Text>
                                    :
                                        courses.reservations.map((item: any, index: number) => renderItemReservation(item, index))
                                    }

                                    {/* <View style={[ tw`flex-row items-center my-5`, {}]}>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                        <Text style={[ tw`text-black text-xs font-bold px-4 border rounded-2xl` ]}>Covoiturages</Text>
                                        <View style={[ tw`flex-1 bg-black`, {height: 1} ]}></View>
                                    </View>
                                    {courses.covoiturages.length == 0
                                    ?
                                        <Text style={tw`text-black mb-3`}>Aucune course disponible.</Text>
                                    :
                                        courses.covoiturages.map((item: any, index: number) => renderItemCovoiturage(item, index))
                                    } */}
                                </>
                            :
                                courses.covoiturages.length == 0
                                ?
                                    <Text style={tw`text-black mb-3`}>Aucune course disponible.</Text>
                                :
                                    courses.covoiturages.map((item: any, index: number) => renderItemCovoiturage(item, index))
                        }
                    </ScrollView>
                </>
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default HistoriqueCoursesView;