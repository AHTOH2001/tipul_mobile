import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Input, Slider, Icon, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { auth } from '../../api/api';

class MainScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        // TODO already authorised
        auth('').then(resp => {

        })
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
            <View style={styles.mainGroup}>
                <View style={styles.buttonsGroup}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('MedicineScreen') }}
                    >
                        <Text style={styles.text}>{translate('Medicine', this.props.root.language)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('StatisticScreen') }}
                    >
                        <Text style={styles.text}>{translate('Statistic', this.props.root.language)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('DoctorsScreen') }}
                    >
                        <Text style={styles.text}>{translate('Doctors', this.props.root.language)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('VisitsScreen') }}
                    >
                        <Text style={styles.text}>{translate('Visits', this.props.root.language)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('SettingsScreen') }}
                    >
                        <Text style={styles.text}>{translate('Settings', this.props.root.language)}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    mainGroup: {
        flex: 1,
        padding: 20,
        marginHorizontal: 13,
        marginBottom: 15,
    },
    buttonsGroup: {
        flex: 1,
    },
    button: {
        flex: 1,        
        justifyContent: 'center'
    },
    text: {
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
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MainScreen)
