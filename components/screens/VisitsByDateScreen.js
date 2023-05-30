import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { list_meds_by_date, take_medicine } from '../../api/api';
import { type_to_icon } from '../../utils/medicine';
import translate from '../../utils/translate';

class VisitsByDateScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            meds: [],
        };
    }

    componentDidMount() {
        var timestamp = this.props.route.params.date

        list_meds_by_date(new Date(timestamp).toISOString().slice(0, -1)).then(resp => {
            this.setState({ ...this.state, isLoading: false, meds: resp })
        })
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                var timestamp = this.props.route.params.date

                list_meds_by_date(new Date(timestamp).toISOString().slice(0, -1)).then(resp => {
                    this.setState({ ...this.state, isLoading: false, meds: resp })
                })
            }
        );
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => { this.props.navigation.navigate('CameraScreen') }}
                    color="#fff"
                    type='clear'
                    icon={{
                        name: "camera",
                        type: 'font-awesome-5',
                        color: 'white',
                    }}
                />
            ),
        })
    }

    componentWillUnmount() {
        this.focusSubscription();
    }

    onPressTakeMed(medicine) {
        Alert.alert(medicine.title, translate('Take medicine?', this.props.root.language), [
            {
                text: translate('take', this.props.root.language),
                onPress: () => {
                    this.setState({ ...this.state, isLoading: true })
                    console.log('Taking med')
                    take_medicine(medicine.id).then((resp) => {
                        console.log(resp)
                        if (resp.is_late) {
                            Alert.alert(translate('Medicine taken, but not in time', this.props.root.language), medicine.title)
                        } else {
                            Alert.alert(translate('Medicine taken, thanks for updates', this.props.root.language), medicine.title)
                        }
                    }).catch(error => {
                        console.log(error.response.data)
                        if ('error' in error.response.data) {
                            Alert.alert(translate('You should not take this medicine', this.props.root.language))
                        } else {
                            console.log(error.response)
                        }
                    }).finally(() => this.setState({ ...this.state, isLoading: false }))
                },
            },
            {
                text: translate('cancel', this.props.root.language),
                style: 'cancel'
            },
        ])
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
            <ScrollView style={styles.container}>
                {
                    this.state.meds.length != 0 && (
                        <View style={styles.mainGroup}>
                            {
                                this.state.meds.map(med => (
                                    <View style={styles.row} key={med.id}>
                                        <ListItem
                                            style={{ borderRadius: 10, marginVertical: 10 }}
                                            containerStyle={styles.button}
                                            onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: med }) }}
                                        >
                                            <ListItem.Content style={styles.row}>
                                                <Icon name={type_to_icon[med.type]} type='font-awesome-5' size={40} color='white' style={{ flex: 1, justifyContent: 'center' }} />
                                                <View>
                                                    <ListItem.Title style={styles.button_text}>{med.title}</ListItem.Title>
                                                    {med.schedule.timesheet.map(({ time, id }) => {
                                                        let timedelta = (moment(time, 'HH:mm').add(59, 'seconds') - moment()) / 1000
                                                        let hours = Math.trunc(timedelta / 60 / 60)
                                                        let minutes = Math.trunc(timedelta / 60)
                                                        let delta_human = ''
                                                        if (timedelta < 0) {
                                                            delta_human = translate('In the past', this.props.root.language)
                                                        } else if (minutes == 0) {
                                                            delta_human = translate('It is time to take', this.props.root.language)
                                                        } else if (hours == 0) {
                                                            delta_human = translate('In', this.props.root.language) + ' ' + minutes.toString() + ' ' + translate('min', this.props.root.language)
                                                        } else {
                                                            delta_human = translate('In', this.props.root.language) + ' ' + hours.toString() + ' ' + translate('h', this.props.root.language)
                                                        }
                                                        return (
                                                            <ListItem.Title style={{ color: 'white', paddingLeft: 30 }} key={id}>
                                                                {translate('At', this.props.root.language)} {time.slice(0, 5)} ({delta_human})
                                                            </ListItem.Title>
                                                        )
                                                    }
                                                    )}
                                                </View>
                                            </ListItem.Content>
                                        </ListItem>
                                        <ListItem
                                            style={{ borderRadius: 10, alignItems: 'center', marginVertical: 10, marginLeft: 5, padding: 0 }}
                                            containerStyle={styles.buttonEat}
                                            onPress={() => this.onPressTakeMed(med)}
                                        >
                                            <Image
                                                style={{ resizeMode: 'stretch' }}
                                                source={require('../../icons/take-a-pill.png')}
                                            />
                                        </ListItem>
                                    </View>
                                ))
                            }
                        </View >
                    )
                }
                {
                    this.state.meds.length == 0 && (
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('No medicines in this day', this.props.root.language)}</Text>
                    )
                }
            </ScrollView>
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
        backgroundColor: 'rgb(32, 137, 220)',
        minWidth: '84%',
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        color: 'white',
        paddingLeft: 30,
        marginRight: 20,
    },
    buttonEat: {
        borderRadius: 10,
        backgroundColor: '#4BA831',
        alignItems: 'center',
        minWidth: '10%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
        flex: 1,
    },
    buttonEat_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
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

export default connect(mapStateToProps)(VisitsByDateScreen)
