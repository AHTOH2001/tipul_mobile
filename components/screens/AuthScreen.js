import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Input, Slider, Icon, Button, TouchableOpacity, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { auth } from '../../api/api';

class AuthScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            name: ''
        };
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    onSubmitEditing = () => {
        console.log('HER')
    }

    componentDidMount() {
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
            <View style={styles.inputGroup}>
                <Input
                    value={this.state.name}
                    color={resolve_front_color(this.props)}
                    onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                    leftIcon={{ type: 'font-awesome', name: 'phone' }}
                    placeholder="+xxx (xx) xxxxxxxxx"
                    onSubmitEditing={this.onSubmitEditing}
                    label={translate('Phone', this.props.root.language)}
                />
                {/* <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.props.navigation.navigate('AddTrainingScreen')}
                >
                    <Text style={{ fontSize: 25, color: resolve_back_color() }}>+</Text>
                </TouchableOpacity> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputGroup: {
        flex: 1,
        padding: 20,
        marginHorizontal: 13,
        marginBottom: 15,
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
    addButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 70,
        backgroundColor: 'green',
        borderRadius: 100
    }
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(AuthScreen)
