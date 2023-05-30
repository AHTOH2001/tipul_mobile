import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { list_visits_by_date } from '../../api/api';
import { specialty_to_icon } from '../../utils/doctor';
import translate from '../../utils/translate';

class VisitsByDateScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            visits: [],
        };
    }

    componentDidMount() {
        var timestamp = this.props.route.params.date

        list_visits_by_date(new Date(timestamp).toISOString().slice(0, -1)).then(resp => {
            this.setState({ ...this.state, isLoading: false, visits: resp })
        })
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                var timestamp = this.props.route.params.date

                list_visits_by_date(new Date(timestamp).toISOString().slice(0, -1)).then(resp => {
                    this.setState({ ...this.state, isLoading: false, visits: resp })
                })
            }
        );
    }

    componentWillUnmount() {
        this.focusSubscription();
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
                {
                    this.state.visits.length != 0 && (
                        <ScrollView style={styles.mainGroup}>
                            {
                                this.state.visits.map(visit => (
                                    <ListItem
                                        style={{ borderRadius: 10, marginVertical: 10 }}
                                        containerStyle={styles.button}
                                        onPress={() => { this.props.navigation.navigate('VisitDetail', { visit_id: visit.id }) }}
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
                    )
                }
                {
                    this.state.visits.length == 0 && (
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('No visits in this day', this.props.root.language)}</Text>
                    )
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
        backgroundColor: 'rgb(32, 137, 220)',
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        color: 'white',
        paddingLeft: 30,
        marginRight: 20,
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
