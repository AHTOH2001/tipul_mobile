import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Slider, Icon, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import DateTimePicker from '@react-native-community/datetimepicker';

class ReportScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            date: new Date()
        };
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: resolve_back_color(this.props) }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <DateTimePicker
                value={this.state.date}
                mode='date'
                onChange={(res) => {
                    if (res.type == 'set') {
                        this.props.navigation.reset({
                            index: 1,
                            routes: [
                                {
                                    name: 'GuardianMainScreen',
                                },
                                {
                                    name: 'ReportDetail',
                                    params: { date: res['nativeEvent'].timestamp.toISOString().slice(0, -1) }
                                },
                            ],
                        })
                    } else {
                        this.props.navigation.goBack()
                    }
                }}
            />
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

export default connect(mapStateToProps)(ReportScreen)
