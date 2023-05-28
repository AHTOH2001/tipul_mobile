import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { list_taken_med } from '../../api/api';
import { type_to_icon } from '../../utils/medicine';
import translate from '../../utils/translate';

class MedsByDateScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            taken: [],
            missed: [],
        };
    }

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                var timestamp = this.props.route.params.date

                list_taken_med(new Date(timestamp).toISOString().slice(0, -1)).then(resp => {
                    this.setState({ ...this.state, isLoading: false, taken: resp.taken, missed: resp.missed })
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
            <ScrollView style={styles.container}>
                {
                    this.state.taken.length != 0 && (
                        <View style={styles.mainGroup} ref={this.myRef}>
                            <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('Taken meds', this.props.root.language) + ':'}</Text>
                            {
                                this.state.taken.map(taken_med => (
                                    <ListItem
                                        style={{ borderRadius: 10, margin: 10 }}
                                        containerStyle={taken_med.is_late ? styles.late : styles.taken}
                                        onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: taken_med.med }) }}
                                        key={taken_med.id}
                                    >
                                        <ListItem.Content style={styles.row}>
                                            <Icon name={type_to_icon[taken_med.med.type]} type='font-awesome-5' size={40} color='white' style={{ flex: 1, justifyContent: 'center' }} />
                                            <View>
                                                <ListItem.Title style={styles.button_text}>{taken_med.med.title}</ListItem.Title>
                                                <ListItem.Title style={{ color: 'white', paddingLeft: 60 }}>{moment(taken_med.date).format('DD.MM.YYYY')} {translate('at', this.props.root.language)} {moment(taken_med.date).format('h:mm')}</ListItem.Title>
                                            </View>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                ))
                            }
                        </View >
                    )
                }
                {
                    this.state.taken.length == 0 && (
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('No taken meds in this day', this.props.root.language)}</Text>
                    )
                }


                {
                    this.state.missed.length != 0 && (
                        <View style={styles.mainGroup} ref={this.myRef}>
                            <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('Missed meds', this.props.root.language) + ':'}</Text>
                            {
                                this.state.missed.map(missed_med => (
                                    <ListItem
                                        style={{ borderRadius: 10, margin: 10 }}
                                        containerStyle={styles.missed}
                                        onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: missed_med.med }) }}
                                        key={missed_med.id}
                                    >
                                        <ListItem.Content style={styles.row}>
                                            <Icon name={type_to_icon[missed_med.med.type]} type='font-awesome-5' size={40} color='white' style={{ flex: 1, justifyContent: 'center' }} />
                                            <View>
                                                <ListItem.Title style={styles.button_text}>{missed_med.med.title}</ListItem.Title>
                                                <ListItem.Title style={{ color: 'white', paddingLeft: 60 }}>{moment(missed_med.date).format('DD.MM.YYYY')} {translate('at', this.props.root.language)} {moment(missed_med.date).format('h:mm')}</ListItem.Title>
                                            </View>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                ))
                            }
                        </View >
                    )
                }
                {
                    this.state.missed.length == 0 && (
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, textAlignVertical: 'center', minWidth: '10%' }}>{translate('No missed meds in this day', this.props.root.language)}</Text>
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
    taken: {
        borderRadius: 10,
        backgroundColor: '#4BA831'
    },
    late: {
        borderRadius: 10,
        backgroundColor: '#808080'
    },
    missed: {
        borderRadius: 10,
        backgroundColor: '#cc0000'
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

export default connect(mapStateToProps)(MedsByDateScreen)
