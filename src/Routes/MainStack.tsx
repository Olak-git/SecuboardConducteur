import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Drawer from './Drawer';
import AuthView from '../view/Auth/AuthView/AuthView';
import RegisterView from '../view/Auth/RegisterView/RegisterView';
import BilanView from '../view/Dashboard/BilanView/BilanView';
import CoursesDisposView from '../view/Dashboard/CoursesDisposView/CoursesDisposView';
import CovoituragePlusInfosView from '../view/Dashboard/CovoituragePlusInfosView/CovoituragePlusInfosView';
import CovoituragesView from '../view/Dashboard/CovoituragesView/CovoituragesView';
import DetailsCourseView from '../view/Dashboard/DetailsCourseDispoView/DetailsCourseView';
import DetailsNewCovoiturageView from '../view/Dashboard/DetailsCovoiturageView/DetailsNewCovoiturageView';
import DetailsNotificationView from '../view/Dashboard/DetailsNotificationView/DetailsNotificationView';
import DetailsReservationView from '../view/Dashboard/DetailsReservationView/DetailsReservationView';
import EditMyAccountView from '../view/Dashboard/EditMyAccountView/EditMyAccountView';
import FinitionView from '../view/Dashboard/FinitionView/FinitionView';
import FoundLocationView from '../view/Dashboard/FoundLocationView/FoundLocationView';
import ItineraireView from '../view/Dashboard/ItineraireView/ItineraireView';
import LocationCovoiturageView from '../view/Dashboard/LocationCovoiturageView/LocationCovoiturageView';
import NotationPassagerView from '../view/Dashboard/NotationPassagerView/NotationPassagerView';
import NotificationsView from '../view/Dashboard/NotificationsView/NotificationsView';
import PortefeuilleView from '../view/Dashboard/PortefeuilleView/PortefeuilleView';
import ProfilPassagerView from '../view/Dashboard/ProfilPassagerView/ProfilPassagerView';
import ReservationsView from '../view/Dashboard/ReservationsView/ReservationsView';
import TransactionsView from '../view/Dashboard/TransactionsView/TransactionsView';
import UpdatePasswordView from '../view/Dashboard/UpdatePasswordView/UpdatePasswordView';
import UpdateTelView from '../view/Dashboard/UpdateTelView/UpdateTelView';
import PresentationView from '../view/PresentationView/PresentationView';
import WelcomeView from '../view/WelcomeView/WelcomeView';
import { otp_authentication, phone_number_test } from '../data/data';

const Stack = createNativeStackNavigator();
// const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
    const init = useSelector((state: any) => state.init);
    const { presentation, welcome } = init;
    const user = useSelector((state: any) => state.user.data);

    return (
        <Stack.Navigator 
            // initialRouteName={ presentation ? 'Home' : 'Presentation' }
            initialRouteName={ 'Welcome' }
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}>

            {/* VALIDER */}
            {!welcome && (
                <Stack.Group>
                    <Stack.Screen name='Welcome' component={WelcomeView} />
                </Stack.Group>
            )}

            {/* VALIDER */}
            {!presentation && (
                <Stack.Group>
                    <Stack.Screen name='Presentation' component={PresentationView}
                        options={{
                            animation: 'fade_from_bottom'
                        }}
                    />
                </Stack.Group>
            )}

            {Object.keys(user).length == 0
                ?
                <Stack.Group>
                    {/* VALIDER */}
                    <Stack.Screen name='Auth' component={AuthView} />
                    {/* VALIDER */}
                    <Stack.Screen name='Register' component={RegisterView} />
                </Stack.Group>
                :
                <Stack.Group>
                    <Stack.Screen name='Drawer' component={Drawer} />

                    {/* VALIDER */}
                    <Stack.Screen name='DashEditMyAccount' component={EditMyAccountView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashUpdateTel' component={UpdateTelView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashUpdatePassword' component={UpdatePasswordView} />

                    {/* VALIDER */}
                    <Stack.Screen name='DashPortefeuille2' component={PortefeuilleView} />

                    {/* VALIDER */}
                    <Stack.Screen name='DashCoursesDispos' component={CoursesDisposView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashDetailsCourse' component={DetailsCourseView} />
                    <Stack.Screen name='DashProfilPassager' component={ProfilPassagerView} />{/* USED */}

                    {/* VALIDER */}
                    <Stack.Screen name='DashReservations' component={ReservationsView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashDetailsReservation' component={DetailsReservationView} />

                    <Stack.Screen name='DashCreateLocationCovoiturage' component={LocationCovoiturageView} />{/* USED */}
                    <Stack.Screen name='DashCreateCovoiturage' component={CovoituragePlusInfosView} />{/* USED */}
                    <Stack.Screen name='DashCovoiturages' component={CovoituragesView} />{/* USED */}
                    <Stack.Screen name='DashDetailsCovoiturage' component={DetailsNewCovoiturageView} />{/* USED */}

                    {/* VALIDER */}
                    <Stack.Screen name='DashNotifications' component={NotificationsView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashDetailsNotification' component={DetailsNotificationView} />
                    {/* VALIDER */}
                    <Stack.Screen name='DashItineraire' component={ItineraireView} />

                    <Stack.Screen name='DashFinition' component={FinitionView}
                        options={{
                            animation: 'fade_from_bottom'
                        }}
                    />{/* USED */}

                    <Stack.Screen name='DashNotationPassager' component={NotationPassagerView}
                        options={{
                            animation: 'flip'
                        }}
                    />{/* USED */}

                    <Stack.Screen name='DashFoundLocation' component={FoundLocationView} />{/* USED */}

                    <Stack.Screen name='DashBilan' component={BilanView} />{/* USED */}

                    <Stack.Screen name='DashTransactions' component={TransactionsView} />{/* USED */}

                    {/* <Stack.Screen name='DashFaireChemin' component={FaireCheminView} />
                    <Stack.Screen name='DashReservation' component={ReservationView} /> */}
                    {/* <Stack.Screen name='DashDetailsFaireChemin' component={DetailsFaireCheminView} /> */}
                    {/* <Stack.Screen name='DashChooseLocation' component={ChooseLocationView} />
                    <Stack.Screen name='DashProgramChemin' component={ProgramCheminView} /> */}
                </Stack.Group>
            }
        
        </Stack.Navigator>
    )
}

export default MainStack