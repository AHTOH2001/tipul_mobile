import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { FAB, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { delete_doctorvisit, doctorvisits_list } from '../../api/api';
import { specialty_to_icon } from '../../utils/doctor';
import translate from '../../utils/translate';

class VisitsScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            doctorvisits: [],
            show_date_picker: false,
        };
    }

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                doctorvisits_list().then(resp => {
                    this.setState({ ...this.state, doctorvisits: resp, isLoading: false })
                })
            }
        );
    }

    componentWillUnmount() {
        this.focusSubscription();
    }

    onLongPress(doctorvisit) {
        console.log(doctorvisit.id)
        Alert.alert(translate('Doctor visit', this.props.root.language) + ' ' + doctorvisit.doctor.first_name + ' ' + doctorvisit.doctor.last_name[0] + '.', null,
            [
                {
                    text: translate('delete', this.props.root.language),
                    onPress: () => {
                        var state = this.state
                        var doc_pos = state.doctorvisits.findIndex(doc => doc.id == doctorvisit.id)
                        state.doctorvisits.splice(doc_pos, 1)
                        this.setState(state)
                        delete_doctorvisit(doctorvisit.id)
                    },
                    style: 'destructive'
                },
                {
                    text: translate('cancel', this.props.root.language),
                    style: 'cancel'
                },
            ])
    }

    create_empty_doctorvisit(specialty) {
        return {
            "doctor": null,
            "date": new Date()
        }
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
            <View style={styles.container}>
                <ScrollView style={styles.mainGroup} ref={this.myRef}>
                    {
                        this.state.doctorvisits.map(visit => (
                            <ListItem
                                style={{ borderRadius: 10, margin: 10 }}
                                containerStyle={styles.button}
                                onPress={() => { this.props.navigation.navigate('VisitDetail', { visit_id: visit.id }) }}
                                onLongPress={() => this.onLongPress(visit)}
                                key={visit.id}
                            >
                                <ListItem.Content style={styles.row}>
                                    <Icon name={specialty_to_icon[visit.doctor.specialty]} type='font-awesome-5' size={40} color='white' />
                                    <View>
                                        <ListItem.Title style={styles.button_text}>{visit.doctor.first_name} {visit.doctor.last_name}</ListItem.Title>
                                        <ListItem.Title style={{ color: 'white', paddingLeft: 60 }}>{moment(visit.date).format('DD.MM.YYYY')} {translate('at', this.props.root.language)} {moment(visit.date).format('h:mm')}</ListItem.Title>
                                    </View>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    }
                </ScrollView >
                <FAB
                        icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
                        placement='right'
                        color='#0d98ba'
                        buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                        onPress={() => { this.props.navigation.navigate('CreateVisit') }}
                        background={TouchableNativeFeedback.Ripple('white', true, 35)}
                    />
                <FAB
                    icon={{ name: 'calendar-alt', type: 'font-awesome-5', color: 'white', size: 24 }}
                    placement='left'
                    color='#0d98ba'
                    buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                    background={TouchableNativeFeedback.Ripple('white', true, 35)}
                    onPress={() => this.setState({ ...this.state, show_date_picker: true })}
                />
                {
                    this.state.show_date_picker
                        ?
                        <DateTimePicker
                            value={new Date()}
                            mode='date'
                            onChange={(res) => {
                                if (res.type == 'set') {
                                    this.props.navigation.navigate('VisitsByDateScreen', { date: res['nativeEvent'].timestamp })
                                    this.setState({ ...this.state, show_date_picker: false })
                                } else {
                                    this.setState({ ...this.state, show_date_picker: false })
                                }
                            }}
                        />
                        :
                        null
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainGroup: {
        padding: 10,
        flex: 1
    },
    button: {
        borderRadius: 10,
        backgroundColor: 'rgb(32, 137, 220)'
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        color: 'white',
        paddingLeft: 10,
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
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(VisitsScreen)
