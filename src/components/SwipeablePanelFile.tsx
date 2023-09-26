import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { Icon } from '@rneui/base';
import tw from 'twrnc';
import FilePicker, { types } from  'react-native-document-picker';
import { cameraPermission, storagePermission } from '../functions/helperFunction';

interface SwipeablePanelFileProps {
    visible: boolean,
    closePanel: ()=>void,
    onCameraPickerSelected: (a: any)=>void,
    onPickerLibraryImage: (a: any)=>void,
    onFilePicker?: (a: any)=>void,
    imageMultipleSelection?: boolean,
    fileMultipleSelection?: boolean,
    showCameraLaunch?: boolean,
    showGaleryLauch?: boolean,
    showFilePicker?: boolean
}
const SwipeablePanelFile: React.FC<SwipeablePanelFileProps> = ({visible, closePanel, onCameraPickerSelected, onPickerLibraryImage, onFilePicker, imageMultipleSelection = false, fileMultipleSelection = false, showCameraLaunch = true, showGaleryLauch = true, showFilePicker = true}) => {
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });

    let options = {
        // saveToPhotos: true,
        mediaType: 'photo',
        selectionLimit: imageMultipleSelection ? 0 : 1
    }

    const openCamera = async () => {
        const granted = await cameraPermission()
        if(granted) {
            // @ts-ignore
            const result = await launchCamera(options);
            if(result.assets) {
                if(imageMultipleSelection) {
                    onCameraPickerSelected&&onCameraPickerSelected(result.assets)
                } else {
                    onCameraPickerSelected&&onCameraPickerSelected(result.assets[0])
                }
            }
            closePanel()
        }
    }

    const openLaunchImage = async () => {
        const granted = await storagePermission()
        if(granted) {
            // @ts-ignore
            const result = await launchImageLibrary(options);
            if(result.assets) {
                if(imageMultipleSelection) {
                    onPickerLibraryImage&&onPickerLibraryImage(result.assets);
                } else {
                    onPickerLibraryImage&&onPickerLibraryImage(result.assets[0]);
                }
            }
            closePanel()
        }
    }

    const handleFilePicker = async () => {
        const permissionStorage = await storagePermission();
        if(permissionStorage) {
            try {
                const response = await FilePicker.pick({
                    presentationStyle: 'pageSheet',
                    allowMultiSelection: fileMultipleSelection,
                    type: [types.images],
                    transitionStyle: 'coverVertical',
                })
                FilePicker.isCancel((err: any) => {
                    console.log(err);
                })
                if(fileMultipleSelection) {
                    onFilePicker&&onFilePicker(response)
                } else {
                    onFilePicker&&onFilePicker(response[0])
                }
                closePanel()
                // @ts-ignore
                // console.log(response[0].name + '(' + format_size(response[0].size) + ')');
                // handleOnChange(file, response[0])
            } catch(e) {
                console.log(e)
                closePanel()
            }
        }
    }
    
    return (
        <SwipeablePanel 
            {...panelProps} 
            smallPanelHeight={100}
            // onlySmall
            onlyLarge
            isActive={visible}
            style={[tw``, {height: 100}]}
            // openLarge
            showCloseButton={false}
            scrollViewProps={{
                scrollEnabled: false
            }}
            onClose={closePanel}
            closeOnTouchOutside={true}
        >
            <View style={tw`flex-row justify-around`}>
                {showCameraLaunch && (
                    <TouchableOpacity activeOpacity={0.8} onPress={openCamera}>
                        <Icon type='ionicon' name='camera' color='rgb(2, 132, 199)' size={30} />
                        <Text style={tw`text-black`}>Caméra</Text>
                    </TouchableOpacity>
                )}
                {showGaleryLauch && (
                    <TouchableOpacity activeOpacity={0.8} onPress={openLaunchImage}>
                        <Icon type='ionicon' name='image' color='rgb(220, 38, 38)' size={30} />
                        <Text style={tw`text-black`}>Galerie</Text>
                    </TouchableOpacity>
                )}
                {showFilePicker && (
                    <TouchableOpacity activeOpacity={0.8} onPress={handleFilePicker}>
                        <Icon type='ionicon' name='document-outline' color='rgb(220, 38, 38)' size={30} />
                        <Text style={tw`text-black`}>Fichier</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SwipeablePanel>
    )
}

export default SwipeablePanelFile