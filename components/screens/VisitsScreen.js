import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import { Input, Slider, Icon, Button, Text, SpeedDial, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../../utils/translate';
import { specialty_to_icon, specialty_choices } from '../../utils/doctor';
import { doctorvisits_list, delete_doctorvisit, create_doctorvisit } from '../../api/api';
import moment from 'moment';

class VisitsScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            doctorvisits: [],
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
                            </ListItem>
                        ))
                    }
                </ScrollView >
                <View style={{ alignItems: 'flex-end' }}>
                    <Button
                        icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
                        color='#0d98ba'
                        buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                        onPress={() => { this.props.navigation.navigate('CreateVisit') }}
                        background={TouchableNativeFeedback.Ripple('white', true, 150)}
                    />
                </View>
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
