import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import { Input, Slider, Icon, Button, Text, SpeedDial, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { type_to_icon, type_choices, create_empty_medicine } from '../../utils/medicine';
import { medicine_list, delete_medicine } from '../../api/api';

class MedicineScreen extends Component {
    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            isLoading: true,
            medicines: [],
            open: false
        };
    }

    componentDidMount() {
        medicine_list().then(resp => {
            this.setState({ ...this.state, medicines: resp.data, isLoading: false })
        })
    }

    onLongPress(medicine) {
        console.log(medicine.id)
        Alert.alert(translate('Medicine', this.props.root.language) + ' ' + medicine.cure.title, null,
            [
                {
                    text: 'delete',
                    onPress: () => {
                        var state = this.state
                        var med_pos = state.medicines.findIndex(med => med.id == medicine.id)
                        state.medicines.splice(med_pos, 1)
                        this.setState(state)
                        delete_medicine(medicine.id)
                    },
                    style: 'destructive'
                },
                {
                    text: 'cancel',
                    style: 'cancel'
                },
            ])
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
            <View style={styles.container}>
                <ScrollView style={styles.mainGroup} ref={this.myRef}>
                    {
                        this.state.medicines.map(medicine => (
                            <ListItem
                                style={{ borderRadius: 10, margin: 10 }}
                                containerStyle={styles.button}
                                onPress={() => { this.props.navigation.navigate('MedicineDetail', { medicine: medicine }) }}
                                onLongPress={() => this.onLongPress(medicine)}
                                icon={{ type: 'font-awesome-5', name: type_to_icon[medicine.cure.type], size: 40, color: 'white' }}
                                iconContainerStyle={styles.iconContainerStyle}
                                key={medicine.id}
                            >
                                <ListItem.Content>
                                    <ListItem.Title style={styles.button_text}>{medicine.cure.title}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))
                    }
                </ScrollView >
                <SpeedDial
                    isOpen={this.state.open}
                    icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
                    openIcon={{ name: 'close', color: '#fff' }}
                    onOpen={() => this.setState({ open: !this.state.open })}
                    onClose={() => this.setState({ open: !this.state.open })}
                    color='#0d98ba'
                    buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
                    background={TouchableNativeFeedback.Ripple('white', true, 150)}
                >
                    {
                        type_choices.map(type => (
                            <SpeedDial.Action
                                icon={{ name: type_to_icon[type], type: 'font-awesome-5', color: 'white', size: 19 }}
                                color='#0d98ba'
                                title={translate(type, this.props.root.language)}
                                key={type}
                                onPress={() => {
                                    this.setState({ medicines: [...this.state.medicines, create_empty_medicine(type, this.state.medicines.length)] })
                                    setTimeout(() => this.myRef.current.scrollToEnd({ animated: true }), 200)

                                }}
                            />
                        ))
                    }
                </SpeedDial>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainGroup: {
        padding: 10,
    },
    button: {
        borderRadius: 10,
        backgroundColor: 'rgb(32, 137, 220)'
    },
    button_text: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 30,
        color: 'white'
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
