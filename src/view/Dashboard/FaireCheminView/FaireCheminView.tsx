import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';

const data = [
    {
        nom: 'Amoussou',
        prenom: 'Jojo',
        from: 'Djrèrègbé',
        to: 'Cotonou',
        status: 'En attente',
        prix: 4500,
        dat: '12/12/2022',
        place: 4,
        place_dispo: 4
    },
    {
        nom: 'Johnson',
        prenom: 'Filbert',
        from: 'Avrankou',
        to: 'Porto-Novo',
        status: 'En attente',
        prix: 2500,
        dat: '12/11/2022',
        place: 4,
        place_dispo: 4
    },
    {
        nom: 'Bonou',
        prenom: 'Ulérich',
        from: 'Porto-Novo',
        to: 'Pobè',
        status: 'Clôturé',
        prix: 3000,
        dat: '01/11/2022',
        place: 4,
        place_dispo: 4
    },
    {
        nom: 'Ahouand',
        prenom: 'Rose',
        from: 'Porto-novo, Dowa',
        to: 'Porto-Novo, Ouando',
        status: 'En attente',
        prix: 3500,
        dat: '08/08/2022',
        place: 4,
        place_dispo: 2
    }
];

interface FaireCheminViewProps {
    navigation: any
}
const FaireCheminView: React.FC<FaireCheminViewProps> = ({ navigation }) => {

    const [refList, setRefList] = useState(null);

    useEffect(() => {
        if(refList) {
            // console.log(refList);
        }
    }, [refList])

    // @ts-ignore
    const renderItem = ({item}) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('DashDetailsFaireChemin', {course: item})}
            style={[ tw`flex-row mb-3` ]}>
            <Icon
                type='font-awesome-5'
                name='car-alt'
                color={ ColorsEncr.main }
                size={ 35 } />
            <View style={[ tw`flex-1 flex-row items-center justify-between ml-3` ]}>
                <View style={[ tw`flex-1` ]}>
                    <Text style={[ tw`text-sm`, {color: ColorsEncr.main} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.from + ' - ' + item.to }</Text>
                    <Text style={[ tw`text-gray-300 italic` ]} numberOfLines={1} ellipsizeMode='tail'>{ item.status }</Text>
                </View>
                <Text style={[ tw`font-bold text-base text-green-600 ml-3` ]}>{ item.prix } F</Text>
            </View>
        </TouchableOpacity>        
    )
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Covoiturage' />
            <FlatList 
                removeClippedSubviews={true}
                initialNumToRender={data.length - 1}
                keyboardDismissMode='none'
                ListEmptyComponent={ 
                    <View>
                        <Text>Empty</Text>
                    </View>
                }
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ref={(ref) => {
                    // @ts-ignore
                    setRefList(ref)
                }}
                contentContainerStyle={[ tw`px-4 pt-2` ]}
            />
            <View style={[ tw`border-t border-slate-200 justify-center items-center`, {height: 60} ]}>
                <Pressable
                    onPress={() => navigation.navigate('DashProgramChemin')}
                    style={[ tw`flex-row items-center py-2 px-4 rounded`, {backgroundColor: ColorsEncr.main} ]}>
                    <Icon 
                        type='ant-design'
                        name='plus'
                        color='#FFFFFF'
                        size={20}/>
                    <Text style={[ tw`ml-2 text-white text-base` ]}>Ajouter un voyage</Text>
                </Pressable>
            </View>
        </Base>
    )

}

export default FaireCheminView;