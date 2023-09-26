import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { google_maps_apikey } from '../../../data/data';
import { ColorsEncr } from '../../../assets/styles';
import AddressPickup from './components/AddressPickup';
import { ALERT_TYPE, Root, Toast } from 'react-native-alert-notification';
import { toast } from '../../../functions/functions';

interface ChooseLocationViewProps {
    navigation: any,
    route: any
}
const ChooseLocationView: React.FC<ChooseLocationViewProps> = ({ navigation, route = () => {} }) => {

    const [state, setState] = useState({
        pickupCords: {},
        destinationCords: {}
    })
    const {pickupCords, destinationCords} = state;

    const onFetch = (index:string, data: any) => {
        setState((prevState) => ({
            ...prevState, [index]: {
                address: data.addr,
                latitude: data.lat,
                longitude: data.lng
            }
        }))        
    }

    const fetchAddressCoords = async (data: any) => {
        onFetch('pickupCords', data)
    }

    const fetchDestinationCoords = async (data: any) => {
        onFetch('destinationCords', data)
    }

    const checkValid = () => {
        if(Object.keys(destinationCords).length === 0) {
            toast('DANGER', 'Please enter your destination Location.')
            // @ts-ignore
            // Toast.show({
            //     type: ALERT_TYPE.DANGER,
            //     // title: 'Notification',
            //     textBody: 'Please enter your destination Location.',
            // })
            return false
        }
        return true;
    }

    console.log('pickupCords ===> ', pickupCords);
    console.log('destinationCords ===> ', destinationCords);

    const onDone = () => {
        const isValid = checkValid()
        if(isValid) {
            route.params.getCordinates({pickupCords, destinationCords})
            navigation.goBack()
        }
    }

    return (
        // <Root theme='dark'>
        <Base>
            <View style={[ tw`flex-1 bg-white mt-5 px-3` ]}>
                <AddressPickup 
                    placeholderText='Pickup Location'
                    fetchAddress={fetchAddressCoords} />
                <View style={[ tw`mb-3` ]} />
                <AddressPickup 
                    placeholderText='Destination Location'
                    fetchAddress={fetchDestinationCoords} />
                
                <View style={[ tw`mt-3` ]}>
                    <TouchableOpacity
                        onPress={onDone}
                        style={[ tw`p-2 rounded border border-slate-100`, {}]}>
                        <Text style={[ tw`text-center font-semibold text-black text-lg` ]}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Base>
        // </Root>
    )
}

export default ChooseLocationView;