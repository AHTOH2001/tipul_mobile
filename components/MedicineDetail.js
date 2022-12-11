import React, { Component } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Icon, ListItem, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';
import { medicine_detail, update_medicine } from '../api/api'
import { type_to_icon, dose_dropdown_data } from '../utils/medicine'
import ModalSelector from 'react-native-modal-selector'
import DateTimePicker from '@react-native-community/datetimepicker';


class MedicineDetail extends Component {
    constructor() {
        super();
        this.state = {
            medicine: {},
            isLoading: true,
            selectedDoseType: null,
            showCycleStartPicker: false,
            showCycleEndPicker: false,
        };
    }

    componentDidMount() {
        var medicine_title = this.props.route.params.medicine.cure.title
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => this.updateMedicine()}
                    color="#fff"
                    type='clear'
                    icon={{ name: "check", color: 'white' }}
                />
            ),
            title: medicine_title
        })
        medicine_detail(medicine_title).then(resp => {
            this.setState({ ...this.state, isLoading: false, medicine: resp, initialDoseType: resp.cure.dose_type })
        })
    }

    updateMedicine() {
        this.setState({
            ...this.state,
            isLoading: true,
        })
        console.log(this.state.medicine)
        update_medicine(this.state.medicine).then(resp => {
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
                    value={this.state.medicine.cure.title}
                    onChangeText={(val) => this.inputValueUpdate(val, 'medicine.cure.title')}
                    leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                    label={translate('Title', this.props.root.language)}
                    errorMessage={this.state.title_error}
                />
                <View style={styles.row}>
                    <Input
                        value={this.state.medicine.cure.dose.toString()}
                        onChangeText={(val) => this.inputValueUpdate(val, 'medicine.cure.dose')}
                        // leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                        label={translate('Dose', this.props.root.language)}
                        errorMessage={this.state.dose_error}
                        containerStyle={{ width: '68%' }}
                    />
                    <ModalSelector
                        data={dose_dropdown_data}
                        initValue={this.state.initialDoseType}
                        onChange={({ label, key }) => this.inputValueUpdate(label, 'medicine.cure.dose_type')}
                        style={{ flex: 1, paddingTop: 10 }} />
                </View>
                <Text style={{ flex: 1, textAlign: 'center' }} h3>{translate('Reception frequency', this.props.root.language)}</Text>
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>{translate('Cycle start', this.props.root.language) + ':'}</Text>
                    <Button
                        buttonStyle={styles.button}
                        titleStyle={styles.button_text}
                        onPress={() => this.setState({ ...this.state, showCycleStartPicker: true })}
                        title={this.state.medicine.schedule.cycle_start} />
                    {this.state.showCycleStartPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(Date.parse(this.state.medicine.schedule.cycle_start))}
                            mode='date'
                            is24Hour={true}
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    console.log(res['nativeEvent'].timestamp)
                                    console.log(typeof res['nativeEvent'].timestamp)
                                    this.inputValueUpdate(res['nativeEvent'].timestamp.toISOString().slice(0, 10), 'medicine.schedule.cycle_start')
                                }
                                this.setState({ ...this.state, showCycleStartPicker: false })
                            }}
                        />
                    )}
                </View>
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>{translate('Cycle end', this.props.root.language) + ':'}</Text>
                    <Button
                        buttonStyle={styles.button}
                        titleStyle={styles.button_text}
                        onPress={() => this.setState({ ...this.state, showCycleEndPicker: true })}
                        title={this.state.medicine.schedule.cycle_end} />
                    {this.state.showCycleEndPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(Date.parse(this.state.medicine.schedule.cycle_end))}
                            mode='date'
                            is24Hour={true}
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    console.log(res['nativeEvent'].timestamp)
                                    console.log(typeof res['nativeEvent'].timestamp)
                                    this.inputValueUpdate(res['nativeEvent'].timestamp.toISOString().slice(0, 10), 'medicine.schedule.cycle_end')
                                }
                                this.setState({ ...this.state, showCycleEndPicker: false })
                            }}
                        />
                    )}
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
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MedicineDetail)
