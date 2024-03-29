import DateTimePicker from '@react-native-community/datetimepicker';
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';
import { doctors_list, doctorvisit_detail, update_doctorvisit } from '../api/api';
import translate from '../utils/translate';


class VisitDetail extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            date: new Date(),
            time: new Date(),

            doctor_id: null,
            doctors_dropdown_data: [],
            showDatePicker: false,
            showTimePicker: false,
        };
    }

    componentDidMount() {
        var visit_id = this.props.route.params.visit_id
        doctorvisit_detail(visit_id).then(resp_visit => {
            doctors_list().then(resp_doctors => {
                var doctors_dropdown_data = resp_doctors.map(doctor => (
                    { key: doctor.id, label: `${doctor.first_name} ${doctor.last_name}` }
                ))
                this.props.navigation.setOptions({
                    headerRight: () => (
                        <Button
                            onPress={() => this.onSubmit()}
                            color="#fff"
                            type='clear'
                            icon={{ name: "check", color: 'white' }}
                        />
                    ),
                })
                this.setState({
                    ...this.state, isLoading: false,
                    doctors_dropdown_data: doctors_dropdown_data,
                    date: new Date(Date.parse(resp_visit.date)),
                    time: new Date(Date.parse(resp_visit.date)),
                    doctor_id: resp_visit.doctor.id,
                })
            })
        })

    }

    onSubmit = () => {
        this.setState({ ...this.state, isLoading: true })
        this.props.navigation.setOptions({
            headerRight: null
        })
        var iso_datetime = `${this.state.date.toISOString().slice(0, 10)}T${this.state.time.toISOString().slice(11, 16)}:00`
        update_doctorvisit(this.props.route.params.visit_id, this.state.doctor_id, iso_datetime)
            .then(resp => {
                this.props.navigation.goBack()
            }).catch(error => {
                console.log(error.response)
            })
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
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>
                        {translate('Doctor', this.props.root.language) + ':'}
                    </Text>
                    <ModalSelector
                        initValue={this.state.doctors_dropdown_data.find(doc => doc.key == this.state.doctor_id).label}
                        data={this.state.doctors_dropdown_data}
                        onChange={({ label, key }) => this.setState({ ...this.state, doctor_id: key })}
                        style={{ flex: 1, paddingTop: 10 }} />
                </View>
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>
                        {translate('Visit date', this.props.root.language) + ':'}
                    </Text>
                    <Button
                        buttonStyle={styles.button}
                        titleStyle={styles.button_text}
                        onPress={() => this.setState({ ...this.state, showDatePicker: true })}
                        title={this.state.date.toISOString().slice(0, 10)} />
                    {this.state.showDatePicker && (
                        <DateTimePicker
                            value={this.state.date}
                            mode='date'
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    this.setState({ ...this.state, date: new Date(res['nativeEvent'].timestamp), showDatePicker: false })
                                } else {
                                    this.setState({ ...this.state, showDatePicker: false })
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>
                        {translate('Visit time', this.props.root.language) + ':'}
                    </Text>
                    <Button
                        buttonStyle={styles.button}
                        titleStyle={styles.button_text}
                        onPress={() => this.setState({ ...this.state, showTimePicker: true })}
                        title={this.state.time.toISOString().slice(11, 16)} />
                    {this.state.showTimePicker && (
                        <DateTimePicker
                            value={this.state.time}
                            mode='time'
                            timeZoneOffsetInMinutes={0}
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    this.setState({ ...this.state, time: new Date(res['nativeEvent'].timestamp), showTimePicker: false })
                                } else {
                                    this.setState({ ...this.state, showTimePicker: false })
                                }
                            }}
                        />
                    )}
                </View>
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    onPress={this.onSubmit}
                    title={translate('Save', this.props.root.language)}
                />
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

export default connect(mapStateToProps)(VisitDetail)
