import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { get_settings, get_user_type } from '../../api/api';
import { resolve_back_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { change_font_size, change_language, change_theme } from '../../redux/action/root';

class MainScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('auth_token').then(value => {
            if (value === null) {
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'RegistrationScreen',
                            first_name: '',
                        },
                    ],
                })
            } else {
                get_user_type().then(resp => {
                    if (!('patient' in resp)) {
                        console.log('You are not patient')
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'RegistrationScreen',
                                },
                            ],
                        })
                    } else {
                        get_settings().then(settings_resp => {
                            settings = settings_resp[0]
                            AsyncStorage.setItem('settings', JSON.stringify(settings))
                            this.props.dispatch(change_theme(settings.color))
                            this.props.dispatch(change_language(settings.language))
                            this.props.dispatch(change_font_size(settings.font))
                            this.setState({ ...this.state, isLoading: false, first_name: resp.patient.first_name })
                            this.props.navigation.setOptions({
                                headerRight: () => (
                                    <Text style={{ ...styles.button_text, color: 'white', paddingRight: 10, fontSize: 20 }}>{this.state.first_name}</Text>
                                ),
                            })
                        })
                    }
                })
            }
        })
    }

    render() {
        console.log(this.state)
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: resolve_back_color(this.props) }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.mainGroup}>
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Medicines', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('MedicineScreen') }}
                    icon={{ type: 'font-awesome', name: 'stethoscope', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Statistic', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('StatisticScreen') }}
                    icon={{ type: 'font-awesome', name: 'signal', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Doctors', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('DoctorsScreen') }}
                    icon={{ type: 'font-awesome', name: 'user-md', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Visits', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('VisitsScreen') }}
                    icon={{ type: 'font-awesome', name: 'ambulance', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Settings', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('SettingsScreen') }}
                    icon={{ type: 'font-awesome', name: 'cogs', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
            </ScrollView >
        )
    }
}

const styles = StyleSheet.create({
    mainGroup: {
        padding: 20,
        marginBottom: 15,
    },
    button: {
        padding: 20,
        margin: 15,
        borderRadius: 10
    },
    button_text: {
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
    }
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MainScreen)
