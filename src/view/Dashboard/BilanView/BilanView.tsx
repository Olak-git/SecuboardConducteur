import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { Divider, Icon } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUri, getCurrency, windowWidth } from '../../../functions/functions';
import { ActivityLoading } from '../../../components/ActivityLoading';
import Chart from './components/Chart';
import Chartjs from './components/Chartjs';
import { setStopped } from '../../../feature/init.slice';

interface BilanViewProps {
    navigation: any
}
const BilanView: React.FC<BilanViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const reload = useSelector((state: any) => state.reload.value);

    const [endFetch, setEndFetch] = useState(false);

    const MONTH = ['Jan', 'Fev', 'Ma', 'Avr', 'Mai', 'Ju', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [chart, setChart] = useState({
        data: [],
        labels: [],
        year: '0000'
    })

    const getChartData = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('chart', null)
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                // console.log('Chart: ', json.chart);
                const chartData = new Array();
                const chartLabels = new Array();
                let chartYear = '';
                for(let i in json.chart.current) {
                    let keys = i.split('-');
                    let val = parseInt(keys[0])
                    if(chartYear == '') {
                        chartYear = keys[1];
                    }
                    chartData.push(json.chart.current[i])
                    chartLabels.push(MONTH[val - 1])
                }
                setChart((prevState: any) => ({...prevState, data: chartData, labels: chartLabels, year: chartYear}))
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
            }
            setEndFetch(true)
        })
        .catch(e => {
            console.log('BilanView Error: ', e)
            setEndFetch(true)
        })
    }

    useEffect(() => {
        if(Platform.OS == 'android') {
            setEndFetch(true);
        } else {
            getChartData();
        }
    }, [reload])

    useEffect(() => {
        dispatch(setStopped(true))
        return () => {
            dispatch(setStopped(false))
        }
    }, [])

    return (
        <Base>
            <Header navigation={navigation} headerTitle='Bilan' />
            {endFetch
            ?
                Platform.OS == 'android'
                    ?
                        <Chartjs token={user.slug} />
                    :
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={tw`items-center mt-10`}>
                                <Chart chart={chart} />
                            </View>
                        </ScrollView>
            :
                <ActivityLoading />
            }
        </Base>
    )
}

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: ColorsEncr.main_sm
    },

    underlineStyleHighLighted: {
        // borderColor: "#03DAC6",
        borderColor: ColorsEncr.main_sm,
    },


    svgWrapper: {
        width: windowWidth - 20,
        height: 400,
        backgroundColor: '#fb8c00',
        borderRadius: 20
    },
    container: {},
    svgStyle: {
        // backgroundColor: '#fb8c00'
    }
});

export default BilanView;