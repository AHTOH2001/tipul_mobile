import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import { Input, Slider, Icon, Button, Text, SpeedDial, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../../utils/translate';
import { specialty_to_icon, specialty_choices } from '../../utils/doctor';
import { doctors_list, delete_doctor, create_doctor } from '../../api/api';

class DosctorsScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            doctors: [],
            open: false
        };
    }

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                doctors_list().then(resp => {
                    this.setState({ ...this.state, doctors: resp, isLoading: false })
                })
            }
        );
    }

    componentWillUnmount() {
        this.focusSubscription();
    }


    onLongPress(doctor) {
        console.log(doctor.id)
        Alert.alert(translate('Doctor', this.props.root.language) + ' ' + doctor.first_name + ' ' + doctor.last_name[0] + '.', null,
            [
                {
                    text: translate('delete', this.props.root.language),
                    onPress: () => {
                        var state = this.state
                        var doc_pos = state.doctors.findIndex(doc => doc.id == doctor.id)
                        state.doctors.splice(doc_pos, 1)
                        this.setState(state)
                        delete_doctor(doctor.id)
                    },
                    style: 'destructive'
                },
                {
                    text: translate('cancel', this.props.root.language),
                    style: 'cancel'
                },
            ])
    }

    create_empty_doctor(specialty) {
        create_doctor({
            "first_name": translate('New', this.props.root.language),
            "last_name": translate('Doctor', this.props.root.language),
            "specialty": specialty
        }).then(doctor => this.setState({ ...this.state, doctors: [...this.state.doctors, doctor] }))
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
                        this.state.doctors.map(doctor => (
                            <ListItem
                                style={{ borderRadius: 10, margin: 10 }}
                                containerStyle={styles.button}
                                onPress={() => { this.props.navigation.navigate('DoctorDetail', { doctor: doctor }) }}
                                onLongPress={() => this.onLongPress(doctor)}
                                key={doctor.id}
                            >
                                <ListItem.Content style={styles.row}>
                                    <Icon style={{ paddingTop: 20 }} name={specialty_to_icon[doctor.specialty]} type='font-awesome-5' size={40} color='white' />
                                    <View>
                                        <ListItem.Title style={styles.button_text}>{doctor.first_name}</ListItem.Title>
                                        <ListItem.Title style={styles.button_text}>{doctor.last_name}</ListItem.Title>
                                    </View>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    }
                </ScrollView >
                <SpeedDial
                    isOpen={this.state.open}
                    icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
                    openIcon={{ name: 'close', color: '#fff' }}
                    onOpen={() => this.setState({ open: !this.state.open })}
                    onClose={() => this.setState({ open: !this.state.open })}
                    color='#0d98ba'
                    buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                    background={TouchableNativeFeedback.Ripple('white', true, 35)}
                >
                    {
                        specialty_choices.map(specialty => (
                            <SpeedDial.Action
                                icon={{ name: specialty_to_icon[specialty], type: 'font-awesome-5', color: 'white', size: 19 }}
                                color='#0d98ba'
                                title={translate(specialty, this.props.root.language)}
                                key={specialty}
                                onPress={() => {
                                    this.create_empty_doctor(specialty)
                                    setTimeout(() => this.myRef.current.scrollToEnd({ animated: true }), 200)

                                }}
                            />
                        ))
                    }
                </SpeedDial>
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
        paddingLeft: 30,
        marginRight: 20
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

export default connect(mapStateToProps)(DosctorsScreen)
