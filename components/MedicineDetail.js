import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Input, Icon, ListItem, Button, Text } from 'react-native-elements'
import { connect } from 'react-redux';
import translate from '../utils/translate';


class MedicineDetail extends Component {
    constructor() {
        super();

        this.state = {
            title: ''
        };
    }

    componentDidMount() {
        var medicine = this.props.route.params.medicine
        this.setState({ ...this.state, title: medicine.cure.title })
    }

    render() {
        return (
            <Text>
                {this.state.title}
            </Text>
        )
    }
}

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(MedicineDetail)
