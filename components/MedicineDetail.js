import React, { Component } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Icon, ListItem, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';
import { medicine_detail, update_medicine } from '../api/api'
import { dose_dropdown_data, type_dropdown_data } from '../utils/medicine'
import ModalSelector from 'react-native-modal-selector'
import DateTimePicker from '@react-native-community/datetimepicker';


class MedicineDetail extends Component {
    constructor() {
        super();
        this.state = {
            medicine: {},
            isLoading: true,
            initialDoseType: null,
            initialCureType: null,
            selectedDoseType: null,
            showCycleStartPicker: false,
            showCycleEndPicker: false,
            checked: false,
        };
    }

    componentDidMount() {
        var medicine_title = this.props.route.params.medicine.title
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
        medicine_detail(this.props.route.params.medicine.id).then(resp => {
            this.setState({ ...this.state, isLoading: false, medicine: resp, initialDoseType: resp.dose_type, initialCureType: resp.type })
        })
    }

    updateMedicine() {
        this.setState({
            ...this.state,
            isLoading: true,
        })
        this.props.navigation.setOptions({
            headerRight: null
        })
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

    deleteTimeRow = (time_index) => {
        var state = this.state
        state.medicine.schedule.timesheet.splice(time_index, 1)
        this.setState(state)
    }

    showTimePicker = (time_index) => {
        this.inputValueUpdate(true, `showTimePicker${time_index.toString()}`)
    }

    timePickerOnPress = (time_index, res) => {
        var state = this.state
        if (res.type == 'set') {
            state.medicine.schedule.timesheet[time_index].time = res['nativeEvent'].timestamp.toISOString().slice(11, 16)
        }
        state[`showTimePicker${time_index.toString()}`] = false
        this.setState(state)
    }

    timePickerAddOnPress = (time_index, res) => {
        var state = this.state
        if (res.type == 'set') {
            state.medicine.schedule.timesheet.push({ 'time': res['nativeEvent'].timestamp.toISOString().slice(11, 16) })

        }
        state[`showTimePicker${time_index.toString()}`] = false
        this.setState(state)
    }


    render() {
        var time_index = -1
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
                    value={this.state.medicine.title}
                    onChangeText={(val) => this.inputValueUpdate(val, 'medicine.title')}
                    leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                    label={translate('Title', this.props.root.language)}
                    errorMessage={this.state.title_error}
                />
                <View style={styles.row}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center' }}>{translate('Type', this.props.root.language) + ':'}</Text>
                    <ModalSelector
                        data={type_dropdown_data}
                        initValue={this.state.initialCureType}
                        onChange={({ label, key }) => this.inputValueUpdate(label, 'medicine.type')}
                        style={{ flex: 1, padding: 20, minWidth: '60%' }} />
                </View>
                <View style={styles.row}>
                    <Input
                        value={this.state.medicine.dose.toString()}
                        onChangeText={(val) => this.inputValueUpdate(val, 'medicine.dose')}
                        // leftIcon={{ type: 'font-awesome-5', name: 'file-signature' }}
                        label={translate('Dose', this.props.root.language)}
                        errorMessage={this.state.dose_error}
                        containerStyle={{ width: '68%' }}
                    />
                    <ModalSelector
                        data={dose_dropdown_data}
                        initValue={this.state.initialDoseType}
                        onChange={({ label, key }) => this.inputValueUpdate(label, 'medicine.dose_type')}
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
                            value={new Date(Date.parse(this.state.medicine.schedule.cycle_start))}
                            mode='date'
                            onChange={(res) => {
                                if (res.type == 'set') {
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
                            value={new Date(Date.parse(this.state.medicine.schedule.cycle_end))}
                            mode='date'
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    this.inputValueUpdate(res['nativeEvent'].timestamp.toISOString().slice(0, 10), 'medicine.schedule.cycle_end')
                                }
                                this.setState({ ...this.state, showCycleEndPicker: false })
                            }}
                        />
                    )}
                </View>
                {
                    this.state.medicine.schedule.timesheet.map(({ time }) => {
                        time_index++
                        return (
                            <View key={time_index} style={styles.row}>
                                <Button
                                    buttonStyle={{ ...styles.button, minWidth: '73%' }}
                                    titleStyle={styles.button_text}
                                    onPress={this.showTimePicker.bind(this, time_index)}
                                    title={time.slice(0, 5)}
                                />
                                <Button
                                    buttonStyle={{ ...styles.button, minWidth: '15%', backgroundColor: 'red' }}
                                    titleStyle={styles.button_text}
                                    onPress={this.deleteTimeRow.bind(this, time_index)}
                                    title={'X'}
                                />
                                {
                                    this.state[`showTimePicker${time_index.toString()}`] && (
                                        <DateTimePicker
                                            value={new Date(Date.parse(`1900-01-01T${time}`))}
                                            mode='time'
                                            is24Hour={true}
                                            timeZoneOffsetInMinutes={0}
                                            onChange={this.timePickerOnPress.bind(this, time_index)}
                                        />
                                    )
                                }
                            </View>
                        )
                    })
                }
                <View key={time_index++}>
                    <Button
                        buttonStyle={styles.button}
                        titleStyle={styles.button_text}
                        onPress={this.showTimePicker.bind(this, time_index)}
                        title={translate('Add', this.props.root.language)}
                    />
                    {
                        this.state[`showTimePicker${time_index.toString()}`] && (
                            <DateTimePicker
                                value={new Date(Date.parse('1900-01-01T00:00:00'))}
                                mode='time'
                                is24Hour={true}
                                timeZoneOffsetInMinutes={0}
                                onChange={this.timePickerAddOnPress.bind(this, time_index)}
                            />
                        )
                    }
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

export default connect(mapStateToProps)(MedicineDetail)
