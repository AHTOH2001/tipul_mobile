import React, { Component } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Icon, ListItem, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';
import { medicine_detail, update_medicine } from '../api/api'


class MedicineDetail extends Component {
    constructor() {
        super();
        this.state = {
            medicine: {},
            isLoading: true,
        };
    }

    componentDidMount() {
        var medicine_title = this.props.route.params.medicine.cure.title
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => this.updateMedicine()}
                    color="#fff"
                    type='clear'
                    icon={{ name: "check", color: 'white' }}
                />
            ),
            title: medicine_title
        })
        medicine_detail(medicine_title).then(resp => {
            this.setState({ ...this.state, isLoading: false, medicine: resp })
        })
    }

    updateMedicine() {
        this.setState({
            ...this.state,
            isLoading: true,
        })
        update_medicine(this.state.medicine).then(resp => {

        })
        this.props.navigation.goBack()
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
            <Text h1>
                {this.state.medicine.cure.title}
            </Text>
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
    }
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MedicineDetail)
