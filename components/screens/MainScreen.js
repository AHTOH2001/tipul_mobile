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
                    icon={{ type: 'font-awesome', name: 'stethoscope', size: 40 }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Statistic', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('StatisticScreen') }}
                    icon={{ type: 'font-awesome', name: 'signal', size: 40 }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Doctors', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('DoctorsScreen') }}
                    icon={{ type: 'font-awesome', name: 'user-md', size: 40 }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Visits', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('VisitsScreen') }}
                    icon={{ type: 'font-awesome', name: 'ambulance', size: 40 }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
                <Button
                    buttonStyle={styles.button}
                    titleStyle={styles.button_text}
                    title={translate('Settings', this.props.root.language)}
                    onPress={() => { this.props.navigation.navigate('SettingsScreen') }}
                    icon={{ type: 'font-awesome', name: 'cogs', size: 40 }}
                    iconContainerStyle={styles.iconContainerStyle}
                />
            </ScrollView >
        )
    }
}

const styles = StyleSheet.create({
    mainGroup: {
        padding: 20,
        marginBottom: 15,
    },
    button: {
        padding: 20,
        margin: 15,
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
    iconContainerStyle: {
        paddingRight: 20,
    }
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MainScreen)
