import React, { Component } from 'react';
import { Alert, StyleSheet, ActivityIndicator, View, Text, TouchableNativeFeedback, FlatList, Vibration } from 'react-native';
import { Input, Slider, Icon, SpeedDial, Button, ListItem } from 'react-native-elements'
import firestore, { db } from '../../firebase/firebaseDb';
import PhaseDetail from '../PhaseDetail'
import { Audio } from 'expo-av';
import { connect } from 'react-redux';
import translate from '../../utils/translate';

class TrainingDetailScreen extends Component {

    constructor() {
        super();
        this.myRef = React.createRef();
        this.state = {
            key: '',
            name: '',
            color: 0,
            isLoading: true,
            phases: [],
            cur_phase: 0,
            cur_time: 0,
            is_pause: false,
            bip_sound: undefined,
            finish_sound: undefined
        };
    }


    color = () => {
        const interpolate = (start, end) => {
            let k = (this.state.color - 0) / (256 * 3); // 0 =>min  && 256 * 3 => MAX
            return Math.ceil((1 - k) * start + k * end) % 256;
        };
        let r = interpolate(20, 255);
        let g = interpolate(200, 128);
        let b = interpolate(128, 20);
        return `rgb(${r},${g},${b})`;

    };

    componentDidMount() {
        const convert_color = (color) => {
            color = color.replace('r', '').replace('g', '').replace('b', '').replace('(', '').replace(')', '')
            const [r, g, b] = color.split(',').map(e => Number(e))
            return Math.round(768 * r / 235 - 3072 / 47)
        }


        // const bip_sound = new Sound('sounds/bip.mp3', Sound.MAIN_BUNDLE, (error) => {
        // console.error(error)
        // })
        Audio.Sound.createAsync(
            require('../../sounds/bip.mp3')
        ).then((res) => this.setState({ bip_sound: res.sound }))
        Audio.Sound.createAsync(
            require('../../sounds/finish.mp3')
        ).then((res) => this.setState({ finish_sound: res.sound }))
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        onPress={() => this.setState({ is_pause: false })}
                        color="#fff"
                        type='clear'
                        icon={{
                            name: "play-arrow",
                            color: 'white',
                        }}
                    />
                    <Button
                        onPress={() => this.setState({ is_pause: true })}
                        color="#fff"
                        type='clear'
                        icon={{
                            name: "pause",
                            color: 'white',
                        }}
                    />
                </View>
            ),
        })

        const dbRef = firestore.doc(firestore.collection(db, 'trainings'), this.props.route.params.trainingkey)
        firestore.getDoc(dbRef).then((res) => {
            if (res.exists) {
                const training = res.data();
                const color = convert_color(training.color)
                this.setState({
                    key: res.id,
                    name: training.name,
                    color: color,
                    phases: training.phases ? training.phases : [],
                    isLoading: false
                })
                this.props.navigation.setOptions({
                    headerStyle: { backgroundColor: training.color }
                })

                if (training.phases && training.phases.length > 0) {
                    this.setState({ cur_time: training.phases[0].duration }, () => {
                        this.setState({
                            intId: setInterval(() => {
                                if (!this.state.is_pause) {
                                    if (this.state.cur_time <= 1) {
                                        this.setState({ cur_time: 0 })
                                        if (this.state.cur_phase + 1 >= this.state.phases.length) {
                                            Vibration.vibrate(650)
                                            this.state.finish_sound.replayAsync()
                                            this.setState({ is_pause: true, cur_phase: this.state.cur_phase + 1 })
                                        } else {
                                            Vibration.vibrate(500)
                                            this.state.finish_sound.replayAsync()
                                            this.setState({ cur_phase: this.state.cur_phase + 1, cur_time: this.state.phases[this.state.cur_phase + 1].duration })
                                            this.myRef.current.scrollToIndex({ index: this.state.cur_phase })
                                        }
                                    } else {
                                        if (this.state.cur_time <= 4) {
                                            this.state.bip_sound.replayAsync()
                                            Vibration.vibrate(300 / this.state.cur_time)
                                        }
                                        this.setState({ cur_time: this.state.cur_time - 1 })
                                    }
                                }
                            }, 1000)
                        })
                    })

                } else {
                    this.props.navigation.navigate('TrainingDetailScreen', { trainingkey: this.props.route.params.trainingkey })
                }
            } else {
                console.log("Document does not exist!");
            }
        });

    }

    componentWillUnmount() {
        if (this.state.intId) {
            clearInterval(this.state.intId)
        }
    }

    updateTraining() {
        this.setState({
            isLoading: true,
        });
        const updateDBRef = firestore.doc(firestore.collection(db, 'trainings'), this.state.key)
        firestore.setDoc(updateDBRef, {
            name: this.state.name,
            color: this.color(),
            phases: this.state.phases,
        }).then((docRef) => {
            this.setState({
                key: '',
                name: '',
                color: 0,
                phases: [],
                isLoading: false,
            });
            this.props.navigation.navigate('TrainingScreen');
        })
            .catch((error) => {
                console.error("Error: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    get_background_color(cur_phase) {
        if (!cur_phase) {
            return 'lightgrey'
        }
        switch (cur_phase.type) {
            case 'Rest': return 'blue'
            case 'Workout': return 'red'
            case 'Warm-up': return 'green'
            case 'Cooldown': return 'lightseagreen'
        }
    }

    get_active_color(training_type) {
        switch (training_type) {
            case 'Rest': return 'darkblue'
            case 'Workout': return 'darkred'
            case 'Warm-up': return 'darkgreen'
            case 'Cooldown': return 'darkcyan'
        }
    }

    resolve_back_color = () => {
        return this.props.root.theme == 'dark' ? '#151614' : 'white'
    }
    resolve_front_color = () => {
        return this.props.root.theme == 'dark' ? 'white' : '#151614'
    }
    resolve_font_size = (original_size) => {
        return Math.round(this.props.root.font_size / 20 * original_size)
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ ...styles.preloader, backgroundColor: this.resolve_back_color() }}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: this.get_background_color(this.state.phases[this.state.cur_phase]) }}>
                <View style={{ flex: 1, maxHeight: '25%' }}>
                    <Text style={{ fontSize: 120, alignSelf: 'center', color: 'white' }}>{this.state.cur_time}</Text>
                </View>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.phases}
                    keyExtractor={item => String(item.id)}
                    initialNumToRender={8}
                    ref={this.myRef}
                    renderItem={({ item, index }) => (
                        <ListItem
                            key={item.id}
                            bottomDivider
                            containerStyle={{ flex: 1, backgroundColor: this.state.cur_phase == index ? this.get_active_color(item.type) : null }}
                            onPress={() => { this.setState({ cur_phase: index, cur_time: item.duration }) }}
                        >
                            <Icon name={item.iconName} type='material-community' color='white' />
                            <ListItem.Content style={{
                                flex: 3
                            }}>
                                <ListItem.Title style={{ fontSize: this.resolve_font_size(30), color: 'white' }}>{index + 1}. {translate(item.type, this.props.root.language)}: {item.duration}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    )}
                />
            </View>
        );
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
    },
})

const mapStateToProps = state => {
    return {
        root: state.root
    }
}

export default connect(mapStateToProps)(TrainingDetailScreen)