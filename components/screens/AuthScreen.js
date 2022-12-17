import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Input, Slider, Icon, Button, TouchableOpacity, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { auth } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationAction } from '@react-navigation/native';

class AuthScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            username: '',
            username_error: '',
            password: '',
            password_error: '',
        };
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    inputUsernameUpdate = (val) => {
        val = val.trim()
        this.inputValueUpdate(val, 'username')
    }

    inputPasswordUpdate = (val) => {
        val = val.trim()
        this.inputValueUpdate(val, 'password')
    }

    onSubmitEditingUsername = () => {
        if (this.state.password !== '') {
            this.onSubmitEditing()
        }
    }

    validateUsername = () => {
        if (this.state.username === '') {
            this.setState({ ...this.state, username_error: translate('Please, fill in your username', this.props.root.language) })
            return false
        }
        return true
    }

    validatePassword = () => {
        if (this.state.password == false) {
            this.setState({ ...this.state, password_error: translate('Please, fill in your password', this.props.root.language) })
            return false
        }
        return true
    }

    onSubmitEditing = () => {
        this.setState({ ...this.state, username_error: '', password_error: '' })
        if (this.validateUsername() && this.validatePassword()) {
            console.log('LOG IN')
            console.log(this.state.username)
            console.log(this.state.password)
            this.inputValueUpdate(true, 'isLoading')
            auth(this.state.username, this.state.password).then(resp => {
                AsyncStorage.setItem('auth_token', resp['auth_token']).then(() => {
                    console.log('Auth token set')
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'UserTypeScreen',
                            },
                        ],
                    })
                })
            }).catch(error => {
                console.log(error)
                this.handleErrors(error.response.data)
                Alert.alert(translate('Username or Password is not correct', this.props.root.language))
            })
        }
    }

    handleErrors(errors) {
        var state = this.state
        state.isLoading = false
        this.setState(state)
    }


    componentDidMount() {
        AsyncStorage.getItem('auth_token').then(value => {
            if (value === null) {
                this.inputValueUpdate(false, 'isLoading')
            } else {
                console.log('Auth token found in auth screen')
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'UserTypeScreen',
                        },
                    ],
                })
            }
        })
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
            <View style={styles.inputGroup}>
                <Input
                    value={this.state.username}
                    color={resolve_front_color(this.props)}
                    onChangeText={this.inputUsernameUpdate}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onSubmitEditing={this.onSubmitEditingUsername}
                    label={translate('Username', this.props.root.language)}
                    errorMessage={this.state.username_error}
                />
                <Input
                    value={this.state.password}
                    color={resolve_front_color(this.props)}
                    onChangeText={this.inputPasswordUpdate}
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onSubmitEditing={this.onSubmitEditing}
                    label={translate('Password', this.props.root.language)}
                    errorMessage={this.state.password_error}
                    secureTextEntry={true}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    onPress={this.onSubmitEditing}
                    title={translate('Log in', this.props.root.language)}
                />
                <Button
                    type='clear'
                    onPress={() => {
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'RegistrationScreen',
                                },
                            ],
                        })
                    }}
                    title={translate('Not registered yet?', this.props.root.language)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputGroup: {
        flex: 1,
        padding: 20,
        marginBottom: 15,
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
    button: {
        padding: 20,
        margin: 20,
        borderRadius: 10
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(AuthScreen)
