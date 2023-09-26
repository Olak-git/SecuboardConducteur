import { StatusBar } from "react-native";
import { windowHeight, windowWidth } from "../functions/functions";

export const REFRESH_CONTROL_COLOR = ['red', 'blue', 'green'];

export const statusBarHeight = StatusBar.currentHeight;

export const DATA_COUNTRY = [
    {
        country_code: 'bj',
        country_name: 'Bénin',
        calling_code: '+229'
    },
    {
        country_code: 'tg',
        country_name: 'Togo',
        calling_code: '+223'
    },
    {
        country_code: 'sn',
        country_name: 'Sénégal',
        calling_code: '+221'                
    },
    {
        country_code: 'ci',
        country_name: 'Côte d\'ivoire',
        calling_code: '+225'
    }
];

export const imageMapPath = {
    icCar: require('../assets/images/icon-car.png'),
    icUser: require('../assets/images/localisation-user.png'),
    icMapCenter: require('../assets/images/map-center.png')
}

const ASPECT_RATIO = windowWidth / windowHeight;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; //0.0421;

export const secuboard_infos = {
    address: 'Saint Michel, Cotonou, Bénin',
    email: 'contact@secuboard.com',
    phone: '+229 54 61 86 00'
}

const keys = {
    ancien: 'AIzaSyB4DkCBwbk7YKbT8lOGsLeTmWu9DvLUqus',
    nouveau: 'AIzaSyC8ojwypivmsA1N6PXdm7MzuZuSw0J0G7s',
    recent: 'AIzaSyCmIZUIy_dmTlBM-rx8GLRfGz5kewPVO_E'
}
export const google_maps_apikey = keys.ancien;

export const otp_authentication = false;

export const account = 'conducteur';

export const phone_number_test = '41414141';