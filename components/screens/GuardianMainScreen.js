import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Slider, Icon, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_user_type } from '../../api/api';

class GuardianMainScreen extends Component {
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
                        },
                    ],
                })
            } else {
                get_user_type().then(resp => {
                    if (resp.type != 'guardian') {
                        console.log(`User type ${resp.type} in guardian main screen`)
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'UserTypeScreen',
                                },
                            ],
                        })
                    } else {
                        this.setState({ ...this.state, isLoading: false })
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
                    title={translate('Report', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('ReportScreen') }}
                    icon={{ type: 'font-awesome', name: 'signal', size: 40, color: 'white' }}
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

export default connect(mapStateToProps)(GuardianMainScreen)
