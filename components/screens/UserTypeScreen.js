import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Slider, Icon, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { get_user_type } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserTypeScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('auth_token').then(value => {
            if (value === null) {
                console.log('No token in main screen')
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'RegisterScreen',
                        },
                    ],
                })
            } else {
                get_user_type().then(resp => {
                    if (resp.type == 'nothing') {
                        this.setState({ ...this.state, isLoading: false })
                    } else {
                        console.log(`Already ${resp.type}`)
                        if (resp.type == 'patient') {
                            this.props.navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'MainScreen',
                                        params: { patient: resp.user },
                                    },
                                ],
                            })
                        } else {
                            if (resp.type == 'guardian') {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: 'GuardianMainScreen',
                                        },
                                    ],
                                })
                            } else {
                                console.warn('Unknown type')
                            }
                        }
                    }
                }).catch(error => {
                    if (error.response.status == 401) {
                        console.log('Token invalid, so back to auth')
                        AsyncStorage.removeItem('auth_token').then(() => {
                            this.props.navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'AuthScreen',
                                    },
                                ],
                            })
                        })
                    } else {
                        console.log(error.response)
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
                    title={translate('Patient', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('PatientScreen') }}
                    icon={{ type: 'font-awesome-5', name: 'user-injured', size: 40, color: 'white' }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Guardian', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('GuardianScreen') }}
                    icon={{ type: 'font-awesome-5', name: 'user-shield', size: 40, color: 'white' }}
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

export default connect(mapStateToProps)(UserTypeScreen)
