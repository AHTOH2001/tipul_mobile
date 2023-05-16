import React, { Component } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, ScrollView } from 'react-native';
import { Input, Slider, Icon, Button, TouchableOpacity, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { create_patient, get_user_type } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PatientScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            last_name: '',
            last_name_error: '',
            age: '',
            age_error: '',
            first_name: '',
            first_name_error: '',
            phone: '',
            phone_error: '',
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
                    if (!('patient' in resp)) {
                        this.setState({ ...this.state, isLoading: false })
                    } else {
                        console.log('Already patient')
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MainScreen',
                                },
                            ],
                        })
                    }
                })
            }
        })
    }

    inputAgeUpdate = (val) => {
        val = val.trim()
        if (!val || Number.isInteger(Number.parseInt(val.slice(-1))))
            this.inputValueUpdate(val, 'age')
    }

    inputPhoneUpdate = (val) => {
        val = val.trim()
        if (!val || Number.isInteger(Number.parseInt(val.slice(-1))))
            this.inputValueUpdate(val, 'phone')
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val.trim()
        this.setState(state);
    }

    onSubmitEditingFirstName = () => {
        if (this.state.last_name !== '' && this.state.age !== '' && this.state.phone !== '') {
            this.onSubmitEditing()
        }
    }

    onSubmitEditingLastName = () => {
        if (this.state.first_name !== '' && this.state.age !== '' && this.state.phone !== '') {
            this.onSubmitEditing()
        }
    }

    onSubmitEditingAge = () => {
        if (this.state.first_name !== '' && this.state.last_name !== '' && this.state.phone !== '') {
            this.onSubmitEditing()
        }
    }

    onSubmitEditingPhone = () => {
        if (this.state.first_name !== '' && this.state.last_name !== '' && this.state.age !== '') {
            this.onSubmitEditing()
        }
    }

    validateFirstName = () => {
        if (this.state.first_name === '') {
            return { first_name_error: translate('Please, fill in your first name', this.props.root.language) }
        }
        return false
    }

    validateLastName = () => {
        if (this.state.last_name === '') {
            return { last_name_error: translate('Please, fill in your last name', this.props.root.language) }
        }
        return false
    }

    validateAge = () => {
        if (this.state.age === '') {
            return { age_error: translate('Please, fill in your age', this.props.root.language) }
        }
        if (!Number.isInteger(Number.parseInt(this.state.age))) {
            return { age_error: translate('Age should be an integer', this.props.root.language) }
        }
        return false
    }

    validatePhone = () => {
        if (this.state.phone === '') {
            return { phone_error: translate('Please, fill in your phone', this.props.root.language) }
        }
        if (!Number.isInteger(Number.parseInt(this.state.phone))) {
            return { phone_error: translate('Phone should be an integer', this.props.root.language) }
        }
        if (!(10 <= this.state.phone.length && this.state.phone.length <= 12)) {
            return { phone_error: translate('Phone length should be from 10 to 12 numbers', this.props.root.language) }
        }
        return false
    }

    onSubmitEditing = () => {
        var new_state = { ...this.state, first_name_error: '', last_name_error: '', age_error: '', phone_error: '' }
        var v1 = this.validateFirstName()
        var v2 = this.validateLastName()
        var v3 = this.validateAge()
        var v4 = this.validatePhone()
        if (v1) {
            new_state = { ...new_state, ...v1 }
        }
        if (v2) {
            new_state = { ...new_state, ...v2 }
        }
        if (v3) {
            new_state = { ...new_state, ...v3 }
        }
        if (v4) {
            new_state = { ...new_state, ...v4 }
        }
        this.setState(new_state)
        if (!v1 && !v2 && !v3 && !v4) {
            console.log('Create patient')
            console.log(this.state.first_name)
            console.log(this.state.last_name)
            console.log(this.state.age)
            console.log(this.state.phone)
            this.setState({ ...this.state, isLoading: true })
            create_patient(this.state.first_name, this.state.last_name, this.state.age, this.state.phone).then(resp => {
                Alert.alert(
                    translate('Patient created', this.props.root.language),
                )
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'MainScreen',
                        },
                    ],
                })
            }).catch(error => {
                console.log(error)
                console.log(error.response)
                this.handleErrors(error.response.data)
                Alert.alert(translate('Registration data is incorrect', this.props.root.language))
            })
        }
    }

    handleErrors(errors) {
        var state = this.state
        state.isLoading = false
        if ('first_name' in errors) {
            state.first_name_error = errors.first_name[0]
        }
        if ('last_name' in errors) {
            state.last_name_error = errors.last_name[0]
        }
        if ('age' in errors) {
            state.age_error = errors.age[0]
        }
        if ('phone' in errors) {
            state.phone_error = errors.phone[0]
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
            <ScrollView style={styles.inputGroup}>
                <Input
                    value={this.state.first_name}
                    onChangeText={(val) => this.inputValueUpdate(val, 'first_name')}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onSubmitEditing={this.onSubmitEditingFirstName}
                    label={translate('First name', this.props.root.language)}
                    errorMessage={this.state.first_name_error}
                />
                <Input
                    value={this.state.last_name}
                    onChangeText={(val) => this.inputValueUpdate(val, 'last_name')}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onSubmitEditing={this.onSubmitEditingLastName}
                    label={translate('Last name', this.props.root.language)}
                    errorMessage={this.state.last_name_error}
                />
                <Input
                    value={this.state.age}
                    onChangeText={this.inputAgeUpdate}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onSubmitEditing={this.onSubmitEditingAge}
                    label={translate('Age', this.props.root.language)}
                    errorMessage={this.state.age_error}
                />
                <Input
                    value={this.state.phone}
                    onChangeText={this.inputPhoneUpdate}
                    leftIcon={{ type: 'font-awesome', name: 'phone' }}
                    onSubmitEditing={this.onSubmitEditingPhone}
                    label={translate('Phone number', this.props.root.language)}
                    errorMessage={this.state.phone_error}
                />
                <Button
                    onPress={this.onSubmitEditing}
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Create', this.props.root.language)}
                />
            </ScrollView>
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

export default connect(mapStateToProps)(PatientScreen)
