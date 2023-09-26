import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header, { HeaderTitle } from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency, windowWidth } from '../../../functions/functions';
import { WtCar1 } from '../../../assets';
import { Icon } from '@rneui/themed';
import { getLocalDate, getLocalTime } from '../../../functions/helperFunction';
import SearchBar from '../../../components/SearchBar';
import { ActivityLoading } from '../../../components/ActivityLoading';
import RenderItemCourseInstantane from '../../../components/RenderItemCourseInstantane';
import { refreshHistoriqueCoures } from '../../../feature/refresh.slice';
import { Skeleton } from '@rneui/base';
import LinearGradient from 'react-native-linear-gradient';

const timer = require('react-native-timer');

import RenderHtml from 'react-native-render-html';
import { REFRESH_CONTROL_COLOR } from '../../../data/data';
import { setStopped } from '../../../feature/init.slice';

interface CoursesDisposViewProps {
    navigation: any
}
const CoursesDisposView: React.FC<CoursesDisposViewProps> = ({ navigation }) => {

    const user = useSelector((state: any) => state.user.data);

    const dispatch = useDispatch();

    const disponibilite = useSelector((state: any) => state.init.disponibilite);

    // const reload = useSelector((state: any) => state.reload.value);
    const refresh = useSelector((state: any) => state.refresh.historique_courses);

    const [refList, setRefList] = useState(null);

    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [courseEmptyText, setCourseEmptyText] = useState('Aucune course disponible pour le moment.');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [endFetch, setEndFetch] = useState(false);

    const [masterCourses, setMasterCourses] = useState<any>([]);
    const [courses, setCourses] = useState<any>([]);
    const [configuration, setConfiguration] = useState<any>(null);

    const getCourses = () => {
        if(!visible) {
            // console.log('Holla Refresh');
            const formData = new FormData();
            formData.append('js', null);
            formData.append('token', user.slug);
            formData.append('courses-dispo', null);
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
                    const newData = json.courses.filter(function (item: any) {
                        return item.conducteur ||  (!item.conducteur && disponibilite);
                        //  !(!item.conducteur && !disponibilite)
                    });
                    setCourses([...newData]);
                    setMasterCourses([...newData]);
                    setConfiguration(json.configuration);
                    setEndFetch(true);
                } else {
                    const errors = json.errors;
                    console.log(errors);
                }
            })
            .catch(error => {
                console.log('SoursesDisposView Error: ', error)
                setRefreshing(false);
            })
        } else {
            console.log('Rater');
        }
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
            const newData = masterCourses.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.passager.nom} ${item.passager.prenom} ${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setCourseEmptyText('Aucun résultat trouvé');
            setCourses(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setCourseEmptyText('Aucune course disponible pour le moment.');
            setCourses(masterCourses);
            setSearch('');
            setLoading(false);
        }
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        let disabled = false;
        let mnt = (configuration.commission_course * item.prix) / 100;
        if(user.portefeuille < mnt) {
            disabled = true;
        }
        return (
            <RenderItemCourseInstantane key={index.toString()} disabled={disabled} navigation={navigation} routeName='DashDetailsCourse' item={item} />
        )
    }

    const skeletonRender = () => (
        <View style={tw`flex-row mb-3`}>
            <Skeleton circle animation='wave' LinearGradientComponent={LinearGradient} width={60} height={60} />
            <View style={[ tw`flex-1 flex-row items-start justify-between ml-3` ]}>
                <View style={[ tw`flex-1 border border-white` ]}>
                    <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={14} style={tw`mb-1`} />
                    <View style={[ tw`mb-1` ]}>
                        <View style={tw`flex-row mb-1`}>
                            <Skeleton circle animation='wave' LinearGradientComponent={LinearGradient} width={15} height={15} style={tw`mr-2`} />
                            <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={14} style={tw`flex-1`} />
                        </View>
                        <View style={tw`flex-row`}>
                            <Skeleton circle animation='wave' LinearGradientComponent={LinearGradient} width={15} height={15} style={tw`mr-2`} />
                            <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={14} style={tw`flex-1`} />
                        </View>
                    </View>
                    <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={14} style={tw`mb-1`} />
                    <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={14} style={tw`mb-1`} />
                </View>
                {/* <View style={[ tw`ml-3` ]}>
                    <Skeleton LinearGradientComponent={LinearGradient} animation="wave" width={50} height={14} />
                </View> */}
            </View>
        </View>
    )

    DeviceEventEmitter.addListener("event.cleartimer", (eventData) => {
        timer.clearInterval('courses');
    });

    useEffect(() => {
        timer.setInterval('courses', getCourses, 5000)
        return () => {
            timer.clearInterval('courses');
            DeviceEventEmitter.removeAllListeners("event.cleartimer");
        }
    }, [visible])

    useEffect(() => {
        getCourses();
    }, [refresh])

    useEffect(() => {
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])

    const source = {
        html: `
      <p style='text-align:center;color:red'>
        Hello World!
      </p>
      Tourner à <b>droite</b><div style=\"font-size:0.9em\">Votre destination se trouvera sur la gauche.</div>`
      };
    
    return (
        <Base>
            <Header 
                navigation={navigation} 
                headerTitle='Courses Disponibles'
                contentLeft={
                    visible
                    ?
                        <Pressable onPress={() => {
                            setVisible(false)
                            setSearch('');
                        }}>
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
                            showLoading={loading}
                            onChangeText={filter}
                            onEndEditing={() => setLoading(false)}
                        />
                    :
                        <View style={tw`flex-1 flex-row items-center justify-between`}>
                            <HeaderTitle title='Courses Disponibles' />
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
                    {/* <RenderHtml
                        contentWidth={windowWidth}
                        source={source}
                    /> */}
                    <FlatList 
                        removeClippedSubviews={true}
                        initialNumToRender={courses.length - 1}
                        keyboardDismissMode='none'
                        refreshControl={
                            <RefreshControl
                                colors={REFRESH_CONTROL_COLOR}
                                refreshing={refreshing} 
                                onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={ 
                            <View>
                                <Text style={tw`text-gray-400`}>{courseEmptyText}</Text>
                            </View>
                        }
                        data={courses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ref={(ref) => {
                            // @ts-ignore
                            setRefList(ref)
                        }}
                        contentContainerStyle={[ tw`px-4 pt-2 mt-2 pb-10` ]}
                    />
                </>
            :
                // <FlatList 
                //     removeClippedSubviews={true}
                //     // initialNumToRender={courses.length - 1}
                //     keyboardDismissMode='none'
                //     data={[0,1,2,3,4,5,6,7,8,9]}
                //     keyExtractor={(item, index) => index.toString()}
                //     renderItem={skeletonRender}
                //     ref={(ref) => {
                //         // @ts-ignore
                //         setRefList(ref)
                //     }}
                //     contentContainerStyle={[ tw`px-4 pt-2 flex-1` ]}
                // />
                <ActivityLoading />
            }
        </Base>
    )

}

export default CoursesDisposView;