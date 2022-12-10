import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, ScrollView, TouchableNativeFeedback } from 'react-native';
import { Input, Slider, Icon, Button, Text, SpeedDial } from 'react-native-elements'
import { connect } from 'react-redux';
import { resolve_back_color, resolve_front_color } from '../../utils/settings-utils';
import translate from '../../utils/translate';
import { type_to_icon, type_choices, create_medicine } from '../../utils/medicine';
import { medicine } from '../../api/api';

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
        medicine().then(resp => {
            this.setState({ ...this.state, medicines: resp.data, isLoading: false })
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
            <View style={styles.container}>
                <ScrollView style={styles.mainGroup} ref={this.myRef}>
                    {
                        this.state.medicines.map(medicine => (
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
                                icon={{ name: type_to_icon[type], type: 'font-awesome', color: 'white' }}
                                color='#0d98ba'
                                title={translate(type, this.props.root.language)}
                                onPress={() => {
                                    this.setState({ medicines: [...this.state.medicines, create_medicine(type, this.state.medicines.length)] })
                                    setTimeout(() => this.myRef.current.scrollToEnd({animated: true}), 200)

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
