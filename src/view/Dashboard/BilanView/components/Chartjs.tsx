import { View, Text, Platform, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import { baseUri, windowHeight, windowWidth } from '../../../../functions/functions';
import tw from 'twrnc';
import { ActivityLoading } from '../../../../components/ActivityLoading';

interface ChartjsProps {
    token: String
}
const Chartjs: React.FC<ChartjsProps> = ({token}) => {
    const webviewRef = useRef(null);

    const [visible, setVisible] = useState(true);

    const sendToken = () => {
        // console.log(token);
        // @ts-ignore
        webviewRef?.current?.injectJavaScript('getChart(' + JSON.stringify(token) + ')');
    }

    const onMessage = (event: any) => {
        console.log('RN: ' + event.nativeEvent.data);
        const msg = JSON.parse(event.nativeEvent.data);
        if(msg.hasOwnProperty('pdf')) {
            
        }
    }

    const runFirst = `
        window.isNativeApp = true;
        true; // note: this is required, or you'll sometimes get silent failures
        `;

    useEffect(() => {
        sendToken();
    })

    return (
        <>
            <WebView
                ref={webviewRef}
                source={{uri: `${baseUri}/app/chart/index.html`}}
                originWhitelist={['*']}
                // onLoadStart={() => setVisible(true)}
                onLoadEnd={() => setVisible(false)}
                injectedJavaScriptBeforeContentLoaded={runFirst}
                androidHardwareAccelerationDisabled={true} // for prevent crash
                onScroll={(event) => {
                    const {y} = event.nativeEvent.contentOffset;
                    // if(y == 0) {
                    //     setRefresh(true);
                    // } else {
                    //     setRefresh(false);
                    // }
                }}
                onNavigationStateChange={event => {
                    console.log('Location: ', event.url);
                }}
                onError={() => console.error('An error has occurred')}
                onHttpError={() => console.error('An HTTP error has occurred')}
                onMessage={onMessage}
                showsVerticalScrollIndicator={false}
                javaScriptEnabled
                style={[tw`mt-5`, {paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0}]}
                containerStyle={tw`mt-2`}
                cacheEnabled={false}
                // scalesPageToFit={true}
            />
            {visible && (
                <View style={[tw`absolute left-0 bottom-0`, {width: windowWidth, height: windowHeight - 80, backgroundColor: '#FFFFFF', justifyContent: 'center'}]}>
                    <ActivityLoading />
                </View>
            )}
        </>
    )
}

export default Chartjs