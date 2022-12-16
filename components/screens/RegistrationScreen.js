import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Input, Slider, Icon, Button, TouchableOpacity, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { register } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class RegistrationScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            username: '',
            username_error: '',
            password: '',
            password_error: '',
            email: '',
            email_error: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('auth_token').then(value => {
            if (value === null) {
                this.inputValueUpdate(false, 'isLoading')
            } else {
                console.log('Auth token found in register screen')
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

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    inputEmailUpdate = (val) => {
        val = val.trim()
        this.inputValueUpdate(val, 'email')
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
        if (this.state.email !== '' && this.state.password !== '') {
            this.onSubmitEditing()
        }
    }

    onSubmitEditingEmail = () => {
        if (this.state.username !== '' && this.state.password !== '') {
            this.onSubmitEditing()
        }
    }

    validateEmail = () => {
        if (this.state.email === '') {
            return { email_error: translate('Please, fill in your email', this.props.root.language) }
        }
        if (!String(this.state.email)
            .toLowerCase()
            .trim()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
            return { email_error: translate('Enter valid email', this.props.root.language) }
        }
        return false
    }

    validateUsername = () => {
        if (this.state.username === '') {
            return { username_error: translate('Please, fill in your username', this.props.root.language) }
        }
        return false
    }

    validatePassword = () => {
        if (this.state.password === '') {
            return { password_error: translate('Please, fill in your password', this.props.root.language) }
        }
        return false
    }

    onSubmitEditing = () => {
        var new_state = { ...this.state, email_error: '', username_error: '', password_error: '' }
        var v1 = this.validateEmail()
        var v2 = this.validateUsername()
        var v3 = this.validatePassword()
        if (v1) {
            new_state = { ...new_state, ...v1 }
        }
        if (v2) {
            new_state = { ...new_state, ...v2 }
        }
        if (v3) {
            new_state = { ...new_state, ...v3 }
        }
        this.setState(new_state)
        if (!v1 && !v2 && !v3) {
            console.log('Register')
            console.log(this.state.email)
            console.log(this.state.username)
            console.log(this.state.password)
            this.inputValueUpdate(true, 'isLoading')
            register(this.state.email, this.state.username, this.state.password).then(resp => {
                Alert.alert(
                    translate('User created', this.props.root.language),
                    translate('You have been registered, now log in', this.props.root.language)
                )
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'AuthScreen',
                        },
                    ],
                })
            }).catch(error => {
                this.handleErrors(error.response.data)
                Alert.alert(translate('Registration data is incorrect', this.props.root.language))
            })
        }
    }

    handleErrors(errors) {
        var state = this.state
        state.isLoading = false
        if ('password' in errors) {
            state.password_error = errors.password[0]
        }
        if ('username' in errors) {
            state.username_error = errors.username[0]
        }
        if ('email' in errors) {
            state.email_error = errors.email[0]
        }
        this.setState(state)
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
                    value={this.state.email}
                    color={resolve_front_color(this.props)}
                    onChangeText={this.inputEmailUpdate}
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onSubmitEditing={this.onSubmitEditingEmail}
                    label={translate('Email', this.props.root.language)}
                    errorMessage={this.state.email_error}
                />
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
                    onPress={this.onSubmitEditing}
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Register', this.props.root.language)}
                />
                <Button
                    type='clear'
                    onPress={() => {
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'AuthScreen',
                                },
                            ],
                        })
                    }}
                    title={translate('Already registered?', this.props.root.language)}
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

export default connect(mapStateToProps)(RegistrationScreen)
