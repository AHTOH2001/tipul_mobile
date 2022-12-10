import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Slider, Icon, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { medicine } from '../../api/api';

class MedicineScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            data: []
        };
    }

    componentDidMount() {
        medicine().then(resp => {
            this.setState({ ...this.state, data: resp.data, isLoading: false })
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
                {
                    this.state.data.map(medicine => (
                        <Button
                            buttonStyle={styles.button}
                            titleStyle={styles.button_text}
                            title={medicine.cure.title}
                            onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: medicine }) }}
                            icon={{ type: 'font-awesome', name: 'stethoscope', size: 40 }} // TODO get icon from type
                            iconContainerStyle={styles.iconContainerStyle}
                        />
                    ))
                }
            </ScrollView >
        )
    }
}

const styles = StyleSheet.create({
    mainGroup: {
        padding: 20,
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

export default connect(mapStateToProps)(MedicineScreen)
