import { View, Text, Pressable, StyleSheet, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CountryFlag } from 'react-native-flag-creator';
import tw from 'twrnc';
import InputForm from './InputForm';
import { Icon } from '@rneui/base';
// @ts-ignore
import CardView from 'react-native-cardview';
import { fetchUri } from '../functions/functions';

interface FilterCountryProps {
    visible?: boolean,
    onClose: any,
    data: any,
    selectedValue?: any
}
const FilterCountry: React.FC<FilterCountryProps> = ({data, onClose, visible, selectedValue}) => {
    const [countries, setCountries] = useState(data);
    const [masterCountries, setMasterCountries] = useState(data);
    const [searchItem, setSearchItem] = useState('');
    const [emptyText, setEmptyText] = useState('');

    const onSelected = (item: any) => {
        if(selectedValue) {
            console.log('Item: ', item)
            selectedValue(item)
        }
        onClose()
    }

    const getCountries = () => {
        const formData = new FormData()
        formData.append('js', null);
        formData.append('country_auth', null);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(json => {
            if(json.success) {
                setCountries(json.countries);
                setMasterCountries(json.countries);
            }
        })
        .catch(e => console.log('Error: ', e))
    }

    useEffect(() => {
        // getCountries();
    }, [])
    
    // @ts-ignore
    const renderItem= ({item}) => (
        <Pressable onPress={()=>onSelected(item)} key={item.toString()} style={[tw`flex flex-row mb-5`]}>
            <CountryFlag countryCode={item.country_code} style={[tw`mr-3 rounded-sm`, {height:30,width: 40,backgroundColor: 'gray',}]} />
            <Text style={[styles.pickerTitleStyle]}>{item.country_name}({item.calling_code})</Text>
        </Pressable>
    )

    const filterItemFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterCountries.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.country_code} ${item.country_name} ${item.calling_code}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setEmptyText('Aucun résultat trouvé');
            setCountries(newData);
            setSearchItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setCountries(masterCountries);
            setSearchItem(text);
            setEmptyText('Aucune discussion');
        }
    }

    return (
        <Modal
            animationType='slide'
            presentationStyle='fullScreen'
            visible={visible}
            // statusBarTranslucent={true}
        >
            <CardView
                cardElevation={5}
                cardMaxElevation={8}
                cornerRadius={0}>
                <InputForm
                    placeholder='Search...'
                    value={searchItem}
                    // error={errors.nom}
                    onChangeText={(text: any) => filterItemFunction(text)}
                    containerStyle={tw`mb-0`}
                    inputParentStyle={tw``}
                    inputContainerStyle={[tw`px-3`, {height: 55}]}
                    inputStyle={[ tw`py-0` ]} 
                    leftComponent={<Pressable onPress={onClose} style={tw`mr-2`}>
                            <Icon type='antdesign' name='arrowleft' />
                        </Pressable>
                    }
                    rightContent={<Icon type='evilicon' name='search' />}
                />
            </CardView>
            <View style={tw`mt-5 px-5`}>
                <FlatList
                    removeClippedSubviews={true}
                    // initialNumToRender={covoiturages.length - 1}
                    keyboardDismissMode='none'
                    ListEmptyComponent={ 
                        <View>
                            <Text style={tw`text-gray-400`}>Aucun résultat trouvé.</Text>
                        </View>
                    }
                    data={countries}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    // ref={refList}
                    contentContainerStyle={[ tw`pt-2` ]}
                />
            </View>

        </Modal>
    )
}

export default FilterCountry

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	titleText: {
		color: "#000",
		fontSize: 25,
		marginBottom: 25,
		fontWeight: "bold",
	},
	pickerTitleStyle: {
        color: "#000000",
		justifyContent: "center",
		flexDirection: "row",
		alignSelf: "center",
		fontWeight: "bold",
	},
	pickerStyle: {
		height: 54,
		width: 150,
		marginVertical: 10,
		borderColor: "#303030",
		alignItems: "center",
		marginHorizontal: 10,
		padding: 10,
		backgroundColor: "white",
		borderRadius: 5,
		borderWidth: 2,
		fontSize: 16,
		color: "#000",
	},
	selectedCountryTextStyle: {
		paddingLeft: 5,
		color: "#000",
		textAlign: "right",
	},

	countryNameTextStyle: {
		paddingLeft: 10,
		color: "#000",
		textAlign: "right",
	},

	searchBarStyle: {
		flex: 1,
	},
    countryFlag: {
        height: 40,
        width: 60,
        // borderRadius: 20,
        backgroundColor: 'gray',
    }
});