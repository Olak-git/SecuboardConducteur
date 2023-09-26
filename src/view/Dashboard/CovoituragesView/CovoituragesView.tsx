import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';
import SearchBar from '../../../components/SearchBar';
import { useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import BottomButton from '../../../components/BottomButton';
import { WtCar1 } from '../../../assets';
import { getLocalDate, getLocalTimeStr } from '../../../functions/helperFunction';
import RenderItemCourseCovoiturage from '../../../components/RenderItemCourseCovoiturage';
import { REFRESH_CONTROL_COLOR } from '../../../data/data';


interface CovoituragesViewProps {
    navigation: any
}
const CovoituragesView: React.FC<CovoituragesViewProps> = ({ navigation }) => {

    const user = useSelector((state: any) => state.user.data);

    // const reload = useSelector((state: any) => state.reload.value);
    const refresh = useSelector((state: any) => state.refresh.historique_covoiturages);

    const refList = useRef(null);

    const [visible, setVisible] = useState(false);
    const [covoiturages, setCovoiturages] = useState<any>([]);
    const [masterCovoiturages, setMasterCovoiturages] = useState<any>([]);
    const [covoiturageEmptyText, setCovoiturageEmptyText] = useState('Aucune course disponible dans votre historique');
    const [searchItem, setSearchItem] = useState('');
    const [endFetch, setEndFetch] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(false);

    const getCovoiturages = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('covoiturages', null);
        formData.append('token', user.slug);
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
                setMasterCovoiturages([...json.covoiturages]);
                setCovoiturages([...json.covoiturages]);
                setEndFetch(true);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => console.log('CovoituragesView Error: ', error))
    }

    const filterItemFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterCovoiturages.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.adresse_depart} ${item.adresse_arrive}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setCovoiturageEmptyText('Aucun résultat trouvé');
            setCovoiturages(newData);
            setSearchItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setCovoiturages(masterCovoiturages);
            setSearchItem(text);
            setCovoiturageEmptyText('Aucune discussion');
            setLoading(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getCovoiturages();
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        return (
            <RenderItemCourseCovoiturage key={index.toString()} navigation={navigation} item={item} />
        )
    }

    useEffect(() => {
        getCovoiturages();
    }, [refresh])
    
    return (
        <Base>
            <Header
                navigation={navigation} 
                headerTitle='Covoiturages'
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
                            <Text style={tw`px-4 text-lg text-black`}>Covoiturages</Text>
                            <Pressable onPress={() => setVisible(true)}>
                                <Icon type="ant-design" name="search1" />
                            </Pressable>
                        </View>
                }
            />
            {endFetch
            ?
                <>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                colors={REFRESH_CONTROL_COLOR}
                                refreshing={refreshing} 
                                onRefresh={onRefresh} />
                        }
                        removeClippedSubviews={true}
                        initialNumToRender={covoiturages.length - 1}
                        keyboardDismissMode='none'
                        ListEmptyComponent={ 
                            <View>
                                <Text style={tw`text-gray-400`}>{ covoiturageEmptyText }</Text>
                            </View>
                        }
                        data={covoiturages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ref={refList}
                        contentContainerStyle={[ tw`px-4 pt-2 pb-10` ]}
                    />
                    
                    {/* {course.nb_place_restante > 0 && ( */}
                        <BottomButton reverse title='Programmer un nouveau voyage' navigation={navigation} route='DashCreateLocationCovoiturage' />
                    {/* )} */}
                </>
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default CovoituragesView;