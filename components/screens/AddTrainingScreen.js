import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { Input, Slider, Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import firestore, { db } from '../../firebase/firebaseDb';
import translate from '../../utils/translate';

class AddTrainingScreen extends Component {
  constructor() {
    super();
    this.dbRef = firestore.collection(db, 'trainings');
    this.state = {
      name: '',
      isLoading: false,
      chosenColor: 0,
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.storeTraining()}
          color="#fff"
          type='clear'
          icon={{
            name: "check",
            color: 'white',
          }}
        />
      ),
    })
  }
  color = () => {
    const interpolate = (start, end) => {
      let k = (this.state.chosenColor - 0) / (256 * 3); // 0 =>min  && 256 * 3 => MAX
      return Math.ceil((1 - k) * start + k * end) % 256;
    };
    let r = interpolate(20, 255);
    let g = interpolate(200, 128);
    let b = interpolate(128, 20);
    return `rgb(${r},${g},${b})`;

  };


  storeTraining() {
    if (this.state.name === '') {
      alert('Fill at least your name!')
    } else {
      this.setState({
        isLoading: true,
      });
      firestore.addDoc(this.dbRef, {
        name: this.state.name,
        color: this.color(),
      }).then((res) => {
        this.setState({
          name: '',
          chosenColor: 0,
          isLoading: false,
        });
        this.props.navigation.navigate('TrainingDetailScreen', { trainingkey: res.id })
      })
        .catch((err) => {
          console.error("Error found: ", err);
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  resolve_back_color = () => {
    return this.props.root.theme == 'dark' ? '#151614' : 'white'
  }
  resolve_front_color = () => {
    return this.props.root.theme == 'dark' ? 'white' : '#151614'
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
      <ScrollView style={{ ...styles.container, backgroundColor: this.resolve_back_color() }}>
        <View style={styles.inputGroup}>
          <Input
            value={this.state.name}
            color={this.resolve_front_color()}
            onChangeText={(val) => this.inputValueUpdate(val, 'name')}
            label={translate('Name', this.props.root.language)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Slider
            value={this.state.chosenColor}
            onValueChange={(val) => this.inputValueUpdate(val, 'chosenColor')}
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
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

export default connect(mapStateToProps)(AddTrainingScreen)