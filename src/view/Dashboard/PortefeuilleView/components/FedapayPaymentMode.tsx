import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import WebView from 'react-native-webview';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import { baseUri } from '../../../../functions/functions';

interface FedapayPaymentModeProps{
    onMessage: (a: any) => void,
    active: boolean,
    closeWindow: () => void,
    amount: number|undefined
}
const FedapayPaymentMode: React.FC<FedapayPaymentModeProps> = ({onMessage, active, closeWindow, amount}) => {
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const webviewRef = useRef(null);
    const {height} = useWindowDimensions();

    const onSendAmount = () => {
        // @ts-ignore
        webviewRef?.current?.injectJavaScript('getAmount(' + JSON.stringify({mnt: amount}) + ')');
    }
    
    const runFirst = `
        window.isNativeApp = true;
        true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
        <View style={[ tw`flex-1` ]}>
            <View style={styles.wbHead}>
                <TouchableOpacity
                    style={{ padding: 13 }}
                    onPress={closeWindow}>
                    <Icon type='feather' name='x' color='#000000' size={24} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#00457C' }}>GateWay</Text>
                <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                    <ActivityIndicator size={24} color={ progClr } />
                </View>
            </View>
            <WebView
                ref={webviewRef}
                source={{uri: `${baseUri}/app/fedapay-pay/index.html`}}
                originWhitelist={['*']}
                onLoadStart={() => {
                    setProg(true);
                    setProgClr('#000');
                }}
                onLoadProgress={() => {
                    setProg(true);
                    setProgClr('#00457C');
                }}
                onLoadEnd={() => {
                    setProg(false);
                    onSendAmount()
                }}
                onLoad={() => {
                    setProg(false);
                }}
                onError={() => console.error('An error has occurred')}
                onHttpError={() => console.error('An HTTP error has occurred')}
                onMessage={onMessage}
                injectedJavaScriptBeforeContentLoaded={runFirst}
                javaScriptEnabled
                style={[tw``]}
            />
            {!active && (
                <View style={[ StyleSheet.absoluteFill, {height: height - 50.5, marginTop: 50.5} ]}>
                    <ActivityLoading loadingText='Chargement en cours...' />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: 'rgb(4,28,84)',
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 18,
        fontFamily: 'serif'
    },
    paragraph: {
        color: 'rgb(4,28,84)',
        lineHeight: 20,
        textAlign: 'justify',
        fontFamily: 'sans-serif'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
    btnCon: {
        height: 45,
        width: '70%',
        elevation: 1,
        backgroundColor: '#00457C',
        borderRadius: 3,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTxt: {
        color: '#fff',
        fontSize: 18,
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        // zIndex: 25,
        elevation: 2,
    }
})

export default FedapayPaymentMode