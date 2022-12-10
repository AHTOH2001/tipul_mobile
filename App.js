import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native-elements'
import AddTrainingScreen from './components/screens/AddTrainingScreen';
import TrainingScreen from './components/screens/TrainingScreen';
import TrainingDetailScreen from './components/screens/TrainingDetailScreen';
import SettingsScreen from './components/screens/SettingsScreen'
import ActionScreen from './components/screens/ActionScreen'
import AuthScreen from './components/screens/AuthScreen'
import RegistrationScreen from './components/screens/RegistrationScreen'
import MainScreen from './components/screens/MainScreen'
import MedicineScreen from './components/screens/MedicineScreen'
import { decode, encode } from 'base-64'
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { connect, Provider } from 'react-redux'
import store from './redux/store';
import { change_font_size, change_language, change_theme } from './redux/action/root';
import firestore, { db } from './firebase/firebaseDb';
import translate from './utils/translate';
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

const Stack = createStackNavigator();
LogBox.ignoreAllLogs()
// console.ignoredYellowBox = ['Setting a timer'];
function MyStack(props) {  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0d98ba',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ title: translate('Main screen', props.props.root.language) }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ title: translate('Authorisation', props.props.root.language) }}
      />
      <Stack.Screen
        name="RegistrationScreen"
        component={RegistrationScreen}
        options={{ title: translate('Registration', props.props.root.language) }}
      />      
      <Stack.Screen
        name="MedicineScreen"
        component={MedicineScreen}
        options={{ title: translate('Medicine', props.props.root.language) }}
      />
      <Stack.Screen
        name="TrainingScreen"
        component={TrainingScreen}
        options={{ title: 'Trainings List' }}
      />
      <Stack.Screen
        name="AddTrainingScreen"
        component={AddTrainingScreen}
        options={{ title: 'Add Training' }}
      />
      <Stack.Screen
        name="TrainingDetailScreen"
        component={TrainingDetailScreen}
        options={{ title: 'Training Detail' }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: translate('Settings', props.props.root.language) }}
      />
      <Stack.Screen
        name="ActionScreen"
        component={ActionScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

class App extends Component {
  constructor() {
    super();
    this.firestoreRef = firestore.collection(db, 'settings');
    this.state = {
      language: undefined,
      theme: '',
      font_size: undefined,
      isLoading: true
    };
  }

  getCollection = (querySnapshot) => {
    querySnapshot.forEach((res) => {
      const { language, font_size, theme } = res.data();
      this.setState({
        language: language || 'english',
        theme: theme || 'light',
        font_size: font_size || 20,
        isLoading: false
      });
      this.props.dispatch(change_theme(theme))
      this.props.dispatch(change_language(language))
      this.props.dispatch(change_font_size(font_size))
    });
  }

  componentDidMount() {
    this.unsubscribe = firestore.onSnapshot(this.firestoreRef, this.getCollection)
  }

  resolve_back_color = () => {
    return this.props.root.theme == 'dark' ? '#151614' : 'white'
  }

  render = () => {
    if (this.state.isLoading) {
      return (
        <View style={{ ...styles.preloader, backgroundColor: this.resolve_back_color() }}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }
    return (

      <NavigationContainer>
        <MyStack props={this.props} />
      </NavigationContainer>
    )
  };
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

export default connect(mapStateToProps)(App)