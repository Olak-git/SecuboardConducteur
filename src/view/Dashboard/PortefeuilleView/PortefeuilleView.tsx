import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, PixelRatio, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Base from '../../../components/Base';
import Header from '../../../components/Header';
import tw from 'twrnc';
import { ColorsEncr } from '../../../assets/styles';
import { FedaLogoBlue, FedaLogoBlueSm, Wallet } from '../../../assets';
import { Icon } from '@rneui/base';
import InputForm from '../../../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, fetchUri, getCurrency, toast } from '../../../functions/functions';
import { SpeedDial } from '@rneui/themed';
import { setUser } from '../../../feature/user.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import FlashMessage from '../../../components/FlashMessage';
// import WebView from 'react-native-webview';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { getErrorsToString } from '../../../functions/helperFunction';
import { SwipeablePanel } from 'rn-swipeable-panel';
import Form from './components/Form';
import FedapayPaymentMode from './components/FedapayPaymentMode';

interface PortefeuilleViewProps {
    navigation: any
}
const PortefeuilleView: React.FC<PortefeuilleViewProps> = ({ navigation }) => {

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.data);

    const [open, setOpen] = useState(false);
    const [dial, setDial] = useState(false);

    const {height} = useWindowDimensions();

    const webviewRef = useRef(null);

    const [endFetch, setEndFetch] = useState(false);

    const [visible, setVisible] = useState(false);

    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [showGateway, setShowGateway] = useState(false);
    const [inputs, setInputs] = useState({
        mnt: undefined,
        montant: undefined
    });

    const [errors, setErrors] = useState({
        mnt: null,
        montant: null
    });

    const [panelIsActive, setPanelIsActive] = useState(false)
    const [panelHeight, setPanelHeight] = useState(100)

    const openPanel = () => setPanelIsActive(true)
    const closePanel = () => setPanelIsActive(false)

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const getCash = () => {
        let valide = true;
        if(!inputs.montant) {
            handleError('montant', 'Est requis.');
            valide = false;
        } else if(inputs.montant < 500) {
            handleError('montant', 'Minimum exigé, 500.');
            valide = false;
        } else {
            if(inputs.montant > user.portefeuille) {
                handleError('montant', 'Vous ne pouvez demander un tel montant en raison des avoirs de votre portefeuille.');
                valide = false;
            } else {
                handleError('montant', null);
            }
            // const mont = parseFloat(inputs.montant);
        }
        if(valide) {
            setVisible(true);
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`get-cash`, null)
            formData.append('token', user.slug)
            formData.append('montant', inputs.montant)
            console.log('Form: ', formData)
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                setVisible(false);
                if(json.success) {
                    toast('SUCCESS', `Vous avez fais une demande de retrait de ${inputs.montant} FCFA de votre portefeuille.\nVotre demande est en cours de traitement.`);
                    handleOnChange('montant', undefined);
                    // @ts-ignore
                    // const montant = parseFloat(user.portefeuille) - parseFloat(inputs.montant);
                    // dispatch(setUser({portefeuille: montant}));
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    toast('DANGER', getErrorsToString(errors));
                }
            })
            .catch(e => {
                setVisible(false);
                console.warn('PortefeuilleView Error1: ', e)
            })
        }
    }

    const onHandle = () => {
        setShowGateway(false);
        setVisible(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`update-portefeuille`, null)
        formData.append('token', user.slug)
        formData.append('montant', inputs.mnt)
        
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setVisible(false);
            if(json.success) {
                toast('SUCCESS', `Votre portefeuille a été crédité de ${inputs.mnt} FCFA`);
                // @ts-ignore
                const montant = parseFloat(user.portefeuille) + parseFloat(inputs.mnt);
                dispatch(setUser({portefeuille: montant}));
            } else {
                const errors = json.errors;
                console.log('Errors: ', errors);
                toast('DANGER', getErrorsToString(errors));
            }
        })
        .catch(e => {
            setVisible(false);
            console.warn('PortefeuilleView Error2: ', e)
        })
    }

    const onHandleMontant = () => {
        if(inputs.mnt && inputs.mnt >= 500) {
            handleError('mnt', null);
            openPanel();
            // setShowGateway(true);
        } else {
            handleError('mnt', 'Non valide.');
        }
    }

    const onMessage = (e: any) => {
        const response = JSON.parse(e.nativeEvent.data);
        console.log(response);
        // response.err == DIALOG DISMISSED
        if(typeof response == 'string') {

        } else if(response.hasOwnProperty('status')) {
            const status = response.status.toLowerCase();
            if(status === 'failed') {
                setShowGateway(false);  
                setEndFetch(false);
            } else if(status == 'approved') {
                onHandle();
            }
        } else if(response.hasOwnProperty('fetch') && response.fetch) {
            setEndFetch(true)
        }
    }

    const closeGateway = () => setShowGateway(false)
 
    return (
        <Base>
            <ModalValidationForm showModal={visible} />
            {showGateway
            ?
                <Modal 
                    visible={showGateway}
                    onDismiss={() => setShowGateway(false)}
                    onRequestClose={() => setShowGateway(false)}
                    animationType='fade'
                    transparent
                >
                    <FedapayPaymentMode onMessage={onMessage} active={endFetch} closeWindow={closeGateway} amount={inputs.mnt} />
                </Modal>
            :
            <>
                <Header navigation={navigation} headerTitle='Portefeuille' />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[ tw`flex-row justify-center items-center border-b border-gray-100`, {height: 120} ]}>
                        <Wallet width={70} height={70} />
                        {/* <Icon type="ionicon" name="ios-wallet" size={70} color='rgb(30, 41, 59)'/> */}
                        <View style={[ tw`ml-3` ]}>
                            <Text style={[ tw`text-gray-500` ]}>Solde actuel</Text>
                            <Text style={[ tw`text-black font-bold text-3xl`, {color: ColorsEncr.main} ]}>{getCurrency(user.portefeuille)} F</Text>
                        </View>
                    </View>

                    {dial
                        ? <Form text={'RETRAIT'} label={'Montant à retirer'} placeholder={'Entrez un montant'} errors={errors} inputs={inputs} index={'montant'} handleOnChange={handleOnChange} onHandle={getCash} buttonText={'Demander un retrait'} helperLeftText={'Solde minimale'} />
                        : <Form text={'Recharger votre compte'} label={'Montant à recharger'} placeholder={'Entrez un montant'} errors={errors} inputs={inputs} index={'mnt'} handleOnChange={handleOnChange} onHandle={onHandleMontant} buttonText={'Recharger'} helperLeftText={'Recharge minimale'} />
                    }
                </ScrollView>

                <SwipeablePanel 
                    isActive={panelIsActive} 
                    smallPanelHeight={100}
                    onlyLarge
                    fullWidth={true}
                    openLarge={true}
                    showCloseButton={true}
                    style={{height: panelHeight + 80}}
                    closeOnTouchOutside={true}
                    onClose={closePanel}
                >
                    <View onLayout={(event) => {
                            setPanelHeight(event.nativeEvent.layout.height)
                            console.log('HHeight: ', event.nativeEvent.layout.height)
                        }}
                        style={tw`mt-2 px-4`}
                    >
                        <Text style={tw`text-black text-base text-center mb-3`}>Mode de paiement</Text>
                        <TouchableOpacity onPress={()=>setShowGateway(true)} style={tw`flex-row items-center py-2 border-b border-neutral-100`}>
                            {/* <Image source={require('../../../assets/images/fedapay-logo.png')} resizeMode='cover' style={[tw`mr-3`,{width: PixelRatio.getPixelSizeForLayoutSize(18), height: PixelRatio.getPixelSizeForLayoutSize(18)}]} />
                            <Text style={tw`text-blue-500 font-bold text-xl`}>FedaPay</Text> */}
                            <FedaLogoBlue width={150} />
                        </TouchableOpacity>
                    </View>
                </SwipeablePanel>

                {/* @ts-ignore */}
                <SpeedDial
                    isOpen={open}
                    icon={{ name: 'edit', color: '#fff' }}
                    openIcon={{ name: 'close', color: '#fff' }}
                    color={ColorsEncr.main}
                    onOpen={() => setOpen(!open)}
                    onClose={() => setOpen(!open)}
                >
                    <SpeedDial.Action
                        icon={{ name: 'add', color: '#fff' }}
                        color={ColorsEncr.main}
                        title="Recharger mon compte"
                        onPress={() => {
                            setDial(false);
                            setOpen(false);
                        }}
                    />
                    {/* @ts-ignore */}
                    {/* {user.portefeuille >= 500 && ( */}
                        <SpeedDial.Action 
                            icon={{ name: 'delete', color: '#fff' }} 
                            color={ColorsEncr.main} 
                            title="Demander un retrait" 
                            onPress={() => {
                                setDial(true);
                                setOpen(false);
                            }} 
                        />
                    {/* )} */}
                </SpeedDial>
            </>
            }
        </Base>
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

export default PortefeuilleView;