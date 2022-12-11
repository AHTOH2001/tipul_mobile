import React, { Component } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Icon, ListItem, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';
import { doctor_detail, update_doctor } from '../api/api'
import { specialty_dropdown_data } from '../utils/doctor'
import ModalSelector from 'react-native-modal-selector'


class DoctorDetail extends Component {
    constructor() {
        super();
        this.state = {
            doctor: {},
            isLoading: true,
            initialSpecialty: null,
        };
    }

    componentDidMount() {
        var doctor = this.props.route.params.doctor
        var doctor_title = `${doctor.first_name} ${doctor.last_name}`
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => this.updateDoctor()}
                    color="#fff"
                    type='clear'
                    icon={{ name: "check", color: 'white' }}
                />
            ),
            title: doctor_title
        })
        doctor_detail(doctor.id).then(resp => {
            this.setState({ ...this.state, isLoading: false, doctor: resp, initialSpecialty: resp.specialty })
        })
    }

    updateDoctor() {
        this.setState({
            ...this.state,
            isLoading: true,
        })
        this.props.navigation.setOptions({
            headerRight: null
        })
        update_doctor(this.state.doctor).then(resp => {
            this.props.navigation.goBack()
        })
    }


    inputValueUpdate = (val, prop) => {
        const state = this.state
        var keys = prop.split('.')
        var state_item = state
        keys.slice(0, keys.length - 1).forEach(key => {
            state_item = state_item[key]
        })
        state_item[keys[keys.length - 1]] = val
        this.setState(state)
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.inputGroup}>
                <Input
                    value={this.state.doctor.first_name}
                    onChangeText={(val) => this.inputValueUpdate(val, 'doctor.first_name')}
                    leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                    label={translate('First name', this.props.root.language)}
                    errorMessage={this.state.first_name_error}
                />
                <Input
                    value={this.state.doctor.last_name}
                    onChangeText={(val) => this.inputValueUpdate(val, 'doctor.last_name')}
                    leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                    label={translate('Last name', this.props.root.language)}
                    errorMessage={this.state.last_name_error}
                />
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('Specialty', this.props.root.language) + ':'}</Text>
                    <ModalSelector
                        data={specialty_dropdown_data}
                        initValue={this.state.initialSpecialty}
                        onChange={({ label, key }) => this.inputValueUpdate(label, 'doctor.specialty')}
                        style={{ flex: 1, padding: 20 }} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputGroup: {
        flex: 1,
        padding: 20,
        marginBottom: 15,
    },
    row: {
        flex: 1,
        flexDirection: 'row',

    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        flex: 1,
        minWidth: '48%',
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 20,
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(DoctorDetail)
