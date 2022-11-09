import React, { Component } from 'react';
import { Alert, StyleSheet, ActivityIndicator, View, Text, TouchableNativeFeedback, FlatList } from 'react-native';
import { Input, Slider, Icon, SpeedDial, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import firestore, { db } from '../../firebase/firebaseDb';
import translate from '../../utils/translate';
import PhaseDetail from '../PhaseDetail'

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
      open: false,
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
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.updateTraining()}
          color="#fff"
          type='clear'
          icon={{
            name: "check",
            color: 'white',
          }}
        />
      ),
    })

    const dbRef = firestore.doc(firestore.collection(db, 'trainings'), this.props.route.params.trainingkey)
    firestore.getDoc(dbRef).then((res) => {
      if (res.exists) {
        const training = res.data();
        this.setState({
          key: res.id,
          name: training.name,
          color: convert_color(training.color),
          phases: training.phases ? training.phases : [],
          isLoading: false
        })
      } else {
        console.log("Document does not exist!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updatePhase = (id, val) => {
    ind = this.state.phases.findIndex(e => e.id == id)
    const state = this.state;
    if (val === null) {
      state.phases.splice(ind, 1);
    } else {
      state.phases[ind] = val;
    }
    this.setState(state);
  }

  updateTraining() {
    if (this.state.phases.length == 0) {
      Alert.alert('Error', 'You must create some sequences before creating training')
      return
    }
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
      <View style={{ ...styles.container, backgroundColor: this.resolve_back_color() }}>
        <View style={{ flex: 1, maxHeight: '25%' }}>
          <View style={styles.inputGroup}>
            <Input
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
              style={{ color: this.resolve_front_color() }}
              label={translate('Name', this.props.root.language)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Slider
              value={this.state.color}
              onValueChange={(val) => this.inputValueUpdate(val, 'color')}
              maximumValue={256 * 3}
              minimumValue={0}
              step={1}
              allowTouchTrack
              trackStyle={{ height: 5, backgroundColor: 'transparent' }}
              thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
              thumbProps={{
                children: (
                  <Icon
                    name="tint"
                    type="font-awesome"
                    size={20}
                    reverse
                    containerStyle={{ bottom: 20, right: 20 }}
                    color={this.color()}
                  />
                ),
              }}
            />
          </View>
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.phases}
          keyExtractor={item => String(item.id)}
          initialNumToRender={4}
          ref={this.myRef}
          renderItem={({ item, index }) => (
            <PhaseDetail item={item} updatePhase={this.updatePhase} />
          )}
        />

        <SpeedDial
          isOpen={this.state.open}
          icon={{ name: 'plus', type: 'antdesign', color: 'white' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => this.setState({ open: !this.state.open })}
          onClose={() => this.setState({ open: !this.state.open })}
          color='green'
          buttonStyle={{ width: 70, height: 70, borderRadius: 120 }}
          background={TouchableNativeFeedback.Ripple('white', true, 150)}
        >
          <SpeedDial.Action
            icon={{ name: 'ski', type: 'material-community', color: 'white' }}
            color='green'
            title={translate("Workout", this.props.root.language)}
            onPress={() => {
              this.setState({ phases: [...this.state.phases, { duration: 20, type: 'Workout', id: Math.floor(Math.random() * (9999)), iconName: 'ski' }] })
              setTimeout(() => this.myRef.current.scrollToEnd(), 200)

            }}
          />
          <SpeedDial.Action
            icon={{ name: 'meditation', type: 'material-community', color: 'white' }}
            color='green'
            title={translate("Rest", this.props.root.language)}
            onPress={() => {
              this.setState({ phases: [...this.state.phases, { duration: 10, type: 'Rest', id: Math.floor(Math.random() * (9999)), iconName: 'meditation' }] })
              setTimeout(() => this.myRef.current.scrollToEnd(), 200)
            }}
          />
          <SpeedDial.Action
            icon={{ name: 'karate', type: 'material-community', color: 'white' }}
            color='green'
            title={translate("Warm-up", this.props.root.language)}
            onPress={() => {
              this.setState({ phases: [...this.state.phases, { duration: 10, type: 'Warm-up', id: Math.floor(Math.random() * (9999)), iconName: 'karate' }] })
              setTimeout(() => this.myRef.current.scrollToEnd(), 200)
            }}
          />
          <SpeedDial.Action
            icon={{ name: 'seat-recline-extra', type: 'material-community', color: 'white' }}
            color='green'
            title={translate("Cooldown", this.props.root.language)}
            onPress={() => {
              this.setState({ phases: [...this.state.phases, { duration: 20, type: 'Cooldown', id: Math.floor(Math.random() * (9999)), iconName: 'seat-recline-extra' }] })
              setTimeout(() => this.myRef.current.scrollToEnd(), 200)
            }}
          />
        </SpeedDial>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  button: {
    marginBottom: 7,
  }
})

const mapStateToProps = state => {
  return {
    root: state.root
  }
}

export default connect(mapStateToProps)(TrainingDetailScreen)