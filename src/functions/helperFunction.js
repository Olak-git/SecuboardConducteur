// import { Dialog, Toast, ALERT_TYPE, Root } from 'react-native-alert-notification';
import { Platform, PermissionsAndroid, Linking, Alert } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { getRandomInt } from "./functions";

export const generateNewOtpCode = () => new Promise(async (resolve, reject) => {
    resolve(getRandomInt(10000, 99999));
})

export const getErrorsToString = (errors) => {
    let txt = '';
    if(typeof errors == 'object') {
        const l = Object.keys(errors).length - 1;
        let i = 0;
        for(let k in errors) {
            if(txt) txt += '\n';
            txt += (l>0?'-':'')+errors[k];
            // txt += '-' + k.replace(/_/g, ' ').replace(/(nb )|( prov)/g, '').replace(/km/g, 'distance') + ': ' + errors[k];
        }
    } else {
        txt = errors;
    }
    return txt;
}

export const capitalizeFirstLetter = (str) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    
    return capitalized;
} 

export const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum/1000;

    // let myDate = strDate.split("-");
    // var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
    // return newDate.getTime();
}

const MONTH = ['jan', 'fév', 'mar', 'avr', 'mai', 'ju', 'jui', 'août', 'sep', 'oct', 'nov', 'déc'];

export const getLocalDate = (date) => {
    const _date = date.split(' ')[0];
    const explode = _date.split('-');
    const year = explode[0];
    const month = explode[1];
    const dat = explode[2];
    return dat + ' ' + MONTH[parseInt(month) - 1] + ' ' + year;
    return (new Date(date)).toLocaleString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'});
}

export const getLocalTime = (date) => {
    return date.slice(date.split(' ')[0].length + 1, date.length - 3);
    return (new Date(date)).toLocaleString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

export const getLocalTimeStr = (h) => {
    return h.slice(0, h.length - 3);
    return (new Date('2000-00-00 ' + h)).toLocaleString('fr-FR', {hour12: false, hour: '2-digit', minute: '2-digit'});
}

export const getSqlFormatDateTime = (date) => {
    return getSqlFormatDate(date) + ' ' + getSqlFormatTime(date);
}

export const getSqlFormatDate = (date) => {
    return JSON.parse(JSON.stringify(date)).slice(0, 10)
    return (new Date(date)).toLocaleDateString('ko-KR', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/(\. )/g, '/').replace(/\./g, '');
}

export const getSqlFormatTime = (date) => {
    let $time = (new Date(date)).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const reg = /pm/ig;
    const pm = reg.test($time)
    $time = $time.toString().replace(/\s?(am|pm)/ig, '');
    let ar = $time.split(':');
    const hr = pm ? parseInt(ar[0])+12 : ar[0];
    const h = hr.toString().padStart(2, '0');
    const m = ar[1].padStart(2, '0');
    const s = ar[2].padStart(2, '0');
    $time = h+':'+m+':'+s;
    return $time;
}

export const formatChaineHid = (text, face, back) => text.slice(0, face) + text.slice(face, text.length-back).replace(/./g, '*') + text.slice(text.length-back, text.length);


export const clone = (obj) => Object.assign({}, obj);

export const getCurrentLocation = () => 
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position.coords.heading
                };
                resolve(cords);
            },
            error => {
                console.log('Error: ', error)
                reject(error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        )
    })

export const watchCurrentLocation = () => 
    new Promise((resolve, reject) => {
        Geolocation.watchPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                console.log('Error: ', error)
                reject(error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        )
    })

export const locationPermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        try {
            const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
            if(permissionStatus == 'granted') {
                return resolve('granted')
            }
            reject('permission not granted')
        } catch(error) {
            return reject(error)
        }
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Location Permission denied')
    }).catch((error) => {
        console.log('Ask Location permission error: ', error)
    })
})

export const storagePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //     title: 'File',
        //     message:
        //         'App needs access to your Storage Memory... ',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const readPhonePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        {
            title: 'Phone',
            message:
                'App needs access to your Files... ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const cameraPermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Camera Permission denied')
    }).catch((error) => {
        console.log('Ask Camera permission error: ', error)
    })
})

export const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    
    console.log(`Link pressed: ${url}`);

    if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
    } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
    }
}

// const hasPermission = async () => {
//     if(Platform.OS == 'android') {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'File',
//               message:
//                 'App needs access to your Files... ',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             return true;
//         }
//     } else {
//         return true;
//     }
//     return false
// }