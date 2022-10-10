import React, { Component } from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

class TrainingScreen extends Component {

  constructor() {
    super();    
    this.state = {
      isLoading: true,
      trainingArr: []
    };
  }

  render() {
    return (
      <Text style={{ fontSize: 120, alignSelf: 'center', color: 'white' }}>"OK"</Text>
    );
  }
}

const mapStateToProps = state => {
  return {
    root: state.root
  }
}

export default connect(mapStateToProps)(TrainingScreen)