import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
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
            <ScrollView style={styles.mainGroup}>
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Medicine', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('MedicineScreen') }}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Statistic', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('StatisticScreen') }}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Doctors', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('DoctorsScreen') }}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Visits', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('VisitsScreen') }}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Settings', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('SettingsScreen') }}
                />
            </ScrollView >
        )
    }
}

const styles = StyleSheet.create({
    mainGroup: {
        padding: 20,
        marginHorizontal: 13,
        marginBottom: 15,
    },
    button: {
        padding: 20,
        margin: 20,
        borderRadius: 10
    },
    button_text: {
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
