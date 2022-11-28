import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';

class AuthScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
        };
        console.log('OHOHO')
        console.log(resolve_back_color)
        console.log(resolve_front_color)
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: resolve_back_color(this.props) }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        <View style={styles.inputGroup}>
            <Input
                value={this.state.name}
                color={resolve_front_color(this.props)}
                onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                label={translate('Name', this.props.root.language)}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    inputGroup: {
        flex: 1,
        padding: 0,
        marginHorizontal: 13,
        marginBottom: 15
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

export default connect(mapStateToProps)(AuthScreen)
