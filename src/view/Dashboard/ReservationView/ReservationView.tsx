import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Icon } from '@rneui/base';

const data = [
    {
        nom: 'Amoussou',
        prenom: 'Jojo',
        image: 'https://photo-cdn2.icons8.com/P6nu4n0aT8zU9tJNiBaddksSF5viQwCSgGeg3vKsMAk/rs:fit:1072:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNjgzLzk4Yzdl/MjJlLWQ3NTctNDUx/MS04ZjU3LTA3ZTIz/YTZkZjI4Mi5qcGc.jpg',
        from: 'Djrèrègbé',
        to: 'Cotonou',
        dat: '23/07/2022',
        hour: '10h',
        place: 2,
        valide: true
    },
    {
        nom: 'Johnson',
        prenom: 'Filbert',
        image: 'https://photo-cdn2.icons8.com/S8zcNsZHX1yY1L9snXB4XJJadRHckWtNon03VI0qtWk/rs:fit:288:431/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvMTUvMmYxZmRj/NjgtNzBiNi00NGRk/LTkzNzMtYTk4MTAy/ZGI4ZmEyLmpwZw.jpg',
        from: 'Avrankou',
        to: 'Porto-Novo',
        dat: '24/07/2022',
        hour: '11h',
        place: 3,
        valide: false
    },
    {
        nom: 'Bonou',
        prenom: 'Ulérich',
        image: 'https://photo-cdn2.icons8.com/9rUjxGuYpnlA1qr7NsAunVIpVp6na8_WbjK5dU3uKCM/rs:fit:288:432/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNDg2LzBjNjY0/OGIwLTc5NTgtNDU0/My05YjI2LWQ4ODE3/M2RjMTlmZS5qcGc.jpg',
        from: 'Porto-Novo',
        to: 'Pobè',
        dat: '21/06/2022',
        hour: '08h',
        place: 4,
        valide: false
    },
    {
        nom: 'Ahouand',
        prenom: 'Rose',
        image: 'https://photo-cdn2.icons8.com/DM-UEYJwMYtyAGc1tDDlByyE0q-zXsqJE9neJTv8na0/rs:fit:288:432/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvOTkxLzZhYmQw/ZTk3LTliOGItNGM5/Mi05ZGI4LTcxMmQ1/MjNlYTFlOS5qcGc.jpg',
        from: 'Porto-novo, Dowa',
        to: 'Porto-Novo, Ouando',
        dat: '30/07/2022',
        hour: '15h',
        place: 3,
        valide: true
    }
];

interface ReservationViewProps {
    navigation: any
}
const ReservationView: React.FC<ReservationViewProps> = ({ navigation }) => {

    const [refList, setRefList] = useState(null);

    useEffect(() => {
        if(refList) {
            // console.log(refList);
        }
    }, [refList])

    // @ts-ignore
    const renderItem = ({item}) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('DashDetailsReservation', {course: item})}
            style={[ tw`flex-row mb-3 p-2` ]}>
            <Image
                source={{ uri: item.image}}
                style={[ tw`rounded-full`, {height: 60, width: 60} ]} />
            <View style={[ tw`flex-1 flex-row items-center justify-between ml-3` ]}>
                <View style={[ tw`flex-1` ]}>
                    <Text style={[ tw`text-black text-base` ]} numberOfLines={1} ellipsizeMode='tail'>{ item.prenom + ' ' + item.nom }</Text>
                    <Text style={[ tw`text-gray-600` ]} numberOfLines={1} ellipsizeMode='tail'>{ item.from + ' - ' + item.to }</Text>
                    <Text style={[ tw``, {color: ColorsEncr.main} ]} numberOfLines={1} ellipsizeMode='tail'>{ item.dat + ' - ' + item.hour }</Text>
                </View>
                { item.valide ?
                    <Icon 
                        type='antdesign'
                        name='checkcircle'
                        color={ 'green' } />
                    :
                    <Icon 
                        type='entypo'
                        name='dots-three-horizontal'
                        color={ ColorsEncr.main } />
                }
            </View>
        </TouchableOpacity>        
    )
    
    return (
        <Base>
            <Header navigation={navigation} headerTitle='Réservations' />
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
        </Base>
    )

}

export default ReservationView;