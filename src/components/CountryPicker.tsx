import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { CountryFlag } from 'react-native-flag-creator'
import tw from 'twrnc'
import FilterCountry from './FilterCountry'
import { Icon } from '@rneui/base'

interface CountryPickerProps {
    countryCode: string,
    showFlag?: boolean,
    callingCode: string,
    data_country: any,
    selectedValue?: any,
    showDropDownIcon?: boolean
}
const CountryPicker: React.FC<CountryPickerProps> = ({countryCode, showFlag = true, callingCode, data_country, selectedValue, showDropDownIcon = true}) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <FilterCountry data={data_country} visible={visible} onClose={()=>setVisible(false)} selectedValue={selectedValue} />
            <Pressable onPress={()=>setVisible(true)} style={tw`flex flex-row items-center mr-3`}>
                {showFlag && (
                    <CountryFlag countryCode={countryCode} style={[tw`mr-1 rounded`, {height:24,width:32,backgroundColor:'gray',}]} />
                )}
                <Text style={tw`text-black`}>{callingCode}</Text>
                {showDropDownIcon && (
                    <Icon type='material-community' name='chevron-down' containerStyle={tw``} />
                )}
            </Pressable>
        </>
    )
}

export default CountryPicker