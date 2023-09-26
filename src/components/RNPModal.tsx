import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, Text, TouchableWithoutFeedbackComponent, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import tw from 'twrnc';

export const RNPModal: React.FC<{showModal: boolean, onClose?: any, cotainerStyle?: StyleProp<ViewStyle>}> = (props) => {

    const { showModal, onClose, cotainerStyle } = props;

    return (
        <Modal
            visible={showModal}
            animated
            animationType='fade'
            presentationStyle='overFullScreen'
            transparent
            onShow={(event) => console.log('Modal Visible')}
            onRequestClose={() => {
                console.log('Badge')
                // Alert.alert("Modal has been closed.");
                // setModalVisible(!modalVisible);
            }}
            // onDismiss={() => console.log('Badge')}
        >
            {onClose
            ?
                <Pressable onPress={onClose} style={[tw`flex-1`]}>
                    <View style={[ tw`flex-1 justify-center items-center`, {backgroundColor: 'rgba(0,0,0,.5)'}, cotainerStyle ]}>
                        {props.children}
                    </View>
                </Pressable>
            :
                <View style={[ tw`flex-1 justify-center items-center`, {backgroundColor: 'rgba(0,0,0,.5)'}, cotainerStyle ]}>
                    {props.children}
                </View>
            }
        </Modal>
    )
}