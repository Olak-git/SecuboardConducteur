import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { ColorsEncr } from '../../../../assets/styles'
import InputForm from '../../../../components/InputForm'
import tw from 'twrnc'

interface FormProps {
    text: string,
    label: string,
    placeholder: string,
    errors: any,
    inputs: any,
    index: string,
    handleOnChange: (a:string, b:any) => void,
    onHandle: () => void,
    buttonText: string,
    helperLeftText: string
}
const Form: React.FC<FormProps> = ({text, label, placeholder, errors, inputs, index, handleOnChange, onHandle, buttonText, helperLeftText}) => {

    useEffect(()=>{
        console.log('key: ', index)
    },[errors])

    return (
        <>
            <View style={[tw`my-3`]}>
                <Text style={[tw`text-center font-semibold text-black text-xl mb-10`]}>{text}</Text>
                <InputForm
                    containerStyle={tw`px-10`}
                    label={label}
                    labelStyle={[tw`text-lg mb-2`]}
                    placeholder={placeholder}
                    keyboardType={'numeric'}
                    formColor='rgb(209, 213, 219)'
                    error={errors[index]}
                    value={inputs[index]}
                    onChangeText={(text: string) => handleOnChange(index, text)}
                    inputContainerStyle={[tw`border rounded border-0 bg-neutral-50 px-2`, { height: 45 }]}
                    constructHelper={
                        <View style={[tw`flex-row justify-between items-center mt-1`]}>
                            <Text style={[tw`text-gray-600`]}>{helperLeftText}:</Text>
                            <Text style={[tw`text-gray-600`]}>500 F</Text>
                        </View>
                    }
                />
            </View>
            <View style={[tw`justify-center px-10 mb-5`, { height: 80 }]}>
                <TouchableOpacity
                    // disabled
                    onPress={onHandle}
                    activeOpacity={0.5}
                    style={[tw`py-3 px-4 rounded`, { backgroundColor: ColorsEncr.main }]}>
                    <Text style={[tw`ml-2 text-white text-base text-center`]}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Form