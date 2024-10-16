import { CommonActions, StackActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, LogBox, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ColorsEncr } from '../../assets/styles';
import { setPresentation, setWelcome } from '../../feature/init.slice';
import { windowWidth } from '../../functions/functions';
import Item from './components/Item';
import Pagination from './components/Pagination';
import { slides } from './components/slides';
import { Wave } from '../../assets';
import tw from 'twrnc';

const SLIDES = slides;

interface PresentationViewProps {
    navigation: any
}
const PresentationView: React.FC<PresentationViewProps> = ({navigation}) => {

    const {width} = useWindowDimensions();

    const [currentIndex, setCurrentIndex] = React.useState(0)

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);
    
    const { presentation } = init;

    // @ts-ignore
    const renderItem = ({item}) => (
        <Item item={item} />
    )

    const handleOnScroll = (event: any) => {
        // Slide Width
        const slideSize = width;

        // Offset Scroll
        const n = event.nativeEvent.contentOffset.x / slideSize
        const roundIndex = Math.round(n)

        // setCurrentIndex
        if(currentIndex !== roundIndex) {
            setCurrentIndex(roundIndex)
        }
    }

    const dispatchNavigation = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Auth'}
                ]
            })
        )
    }

    const handleOnChange = () => {
        dispatch(setPresentation(true));
    }

    useEffect(() => {
        if(presentation) {
            dispatchNavigation()
        }
    }, [presentation])

    return (
        <SafeAreaView style={[tw``, styles.container]}>
            <StatusBar
                backgroundColor='#fff'
                barStyle='dark-content'
            />
            <FlatList 
                data={ SLIDES }
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={ false }
                pagingEnabled
                onScroll={handleOnScroll}
            />
            {/* @ts-ignore */}
            <Pagination handleOnChange={handleOnChange} index={ currentIndex } data={ SLIDES } />
            <View style={[tw``,{position: 'absolute', bottom: -10, left: -5, width: windowWidth + 10, height: 90}]}>
                <Wave />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative'
    }
})

export default PresentationView;