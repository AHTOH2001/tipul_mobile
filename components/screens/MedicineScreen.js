import React, { Component } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Button, Icon, ListItem, SpeedDial } from 'react-native-elements';
import { connect } from 'react-redux';
import { create_medicine, delete_medicine, medicine_list, take_medicine } from '../../api/api';
import { type_choices, type_to_icon } from '../../utils/medicine';
import { resolve_back_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

class MedicineScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            medicines: [],
            open: false,
            expoPushToken: '',
        };
    }


    componentDidMount() {
        registerForPushNotificationsAsync().then(token => this.setState({...this.state, expoPushToken: token}))
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                medicine_list().then(resp => {
                    this.setState({ ...this.state, medicines: resp, isLoading: false })
                })
            }
        );
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => { this.props.navigation.navigate('CameraScreen') }}
                    color="#fff"
                    type='clear'
                    icon={{
                        name: "camera",
                        type: 'font-awesome-5',
                        color: 'white',
                    }}
                />
            ),
        })
    }

    componentWillUnmount() {
        this.focusSubscription();
    }

    onLongPress(medicine) {
        console.log(medicine.id)
        Alert.alert(translate('Medicine', this.props.root.language) + ' ' + medicine.title, null,
            [
                {
                    text: translate('delete', this.props.root.language),
                    onPress: () => {
                        var state = this.state
                        var med_pos = state.medicines.findIndex(med => med.id == medicine.id)
                        state.medicines.splice(med_pos, 1)
                        this.setState(state)
                        delete_medicine(medicine.id)
                    },
                    style: 'destructive'
                },
                {
                    text: translate('cancel', this.props.root.language),
                    style: 'cancel'
                },
            ])
    }

    onPressTakeMed(medicine) {
        Alert.alert(medicine.title, translate('Take medicine?', this.props.root.language), [
            {
                text: translate('take', this.props.root.language),
                onPress: () => {
                    this.setState({ ...this.state, isLoading: true })
                    console.log('Taking med')
                    take_medicine(medicine.id).then((resp) => {
                        console.log(resp)
                        if (resp.is_late) {
                            Alert.alert(translate('Medicine taken, but not in time', this.props.root.language))
                        } else {
                            Alert.alert(translate('Medicine taken, thanks for updates', this.props.root.language))
                        }
                    }).catch(error => {
                        console.log(error.response.data)
                        if ('error' in error.response.data) {
                            Alert.alert(translate('You should not take this medicine', this.props.root.language))
                        } else {
                            console.log(error.response)
                        }
                    }).finally(() => this.setState({ ...this.state, isLoading: false }))
                },
            },
            {
                text: translate('cancel', this.props.root.language),
                style: 'cancel'
            },
        ])
    }

    create_empty_medicine(type) {
        create_medicine({
            "cure": {
                "title": `${translate('New medicine', this.props.root.language)}`,
                "dose": 1.0,
                "dose_type": "pcs",
                "type": type,
                "food": 'Before meals',
                'strict_status': false,
            },
            "time": [
                {
                    "time": `${new Date().getHours()}:${new Date().getMinutes()}:00`
                }
            ],
            "schedule": {
                "cycle_start": new Date().toISOString().slice(0, 10),
                "cycle_end": new Date().toISOString().slice(0, 10),
                "frequency": 0,
            }
        }).then(medicine => this.setState({ ...this.state, medicines: [...this.state.medicines, medicine] }))
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: resolve_back_color(this.props) }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.mainGroup} ref={this.myRef}>
                    {
                        this.state.medicines.map(medicine => (
                            <View style={styles.row} key={medicine.id}>
                                <ListItem
                                    style={{ borderRadius: 10, marginVertical: 10 }}
                                    containerStyle={styles.button}
                                    onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: medicine }) }}
                                    onLongPress={() => this.onLongPress(medicine)}
                                >
                                    <ListItem.Content style={{ ...styles.row, maxWidth: '90%' }}>
                                        <Icon name={type_to_icon[medicine.type]} type='font-awesome-5' size={40} color='white' style={{ flex: 1, justifyContent: 'center' }} />
                                        <ListItem.Title style={styles.button_text}>{medicine.title}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                                <ListItem
                                    style={{ borderRadius: 10, alignItems: 'center', marginVertical: 10, marginLeft: 5, padding: 0 }}
                                    containerStyle={styles.buttonEat}
                                    onPress={() => this.onPressTakeMed(medicine)}
                                >
                                    <Image
                                        style={{ resizeMode: 'stretch' }}
                                        source={require('../../icons/take-a-pill.png')}
                                    />
                                </ListItem>
                            </View>
                        ))
                    }
                </ScrollView >
                <SpeedDial
                    isOpen={this.state.open}
                    icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
                    openIcon={{ name: 'close', color: '#fff' }}
                    onOpen={() => {
                        schedulePushNotification()
                        this.setState({ open: !this.state.open })
                    }}
                    onClose={() => this.setState({ open: !this.state.open })}
                    color='#0d98ba'
                    buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                    background={TouchableNativeFeedback.Ripple('white', true, 35)}
                >
                    {
                        type_choices.map(type => (
                            <SpeedDial.Action
                                icon={{ name: type_to_icon[type], type: 'font-awesome-5', color: 'white', size: 19 }}
                                color='#0d98ba'
                                title={translate(type, this.props.root.language)}
                                key={type}
                                onPress={() => {
                                    this.setState({ ...this.state, open: false })
                                    this.create_empty_medicine(type)
                                    setTimeout(() => this.myRef.current.scrollToEnd({ animated: true }), 200)
                                }}
                            />
                        ))
                    }
                </SpeedDial>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainGroup: {
        padding: 10,
    },
    button: {
        borderRadius: 10,
        backgroundColor: 'rgb(32, 137, 220)',
        minWidth: '84%',
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        color: 'white',
        paddingLeft: 30,
        marginRight: 20,
    },
    buttonEat: {
        borderRadius: 10,
        backgroundColor: '#4BA831',
        alignItems: 'center',
        minWidth: '10%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
        flex: 1,
    },
    buttonEat_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainerStyle: {
        paddingRight: 20,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
})

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MedicineScreen)
