import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import CreateVisit from './components/CreateVisit';
import DoctorDetail from './components/DoctorDetail';
import MedicineDetail from './components/MedicineDetail';
import ReportDetail from './components/ReportDetail';
import StatisticDetail from './components/StatisticDetail';
import VisitDetail from './components/VisitDetail';
import AuthScreen from './components/screens/AuthScreen';
import DoctorsScreen from './components/screens/DoctorsScreen';
import MainScreen from './components/screens/MainScreen';
import MedicineScreen from './components/screens/MedicineScreen';
import PatientScreen from './components/screens/PatientScreen';
import RegistrationScreen from './components/screens/RegistrationScreen';
import ReportScreen from './components/screens/ReportScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import StatisticScreen from './components/screens/StatisticScreen';
import VisitsScreen from './components/screens/VisitsScreen';
import { change_font_size, change_language, change_theme } from './redux/action/root';
import translate from './utils/translate';

const Stack = createStackNavigator();
// LogBox.ignoreAllLogs()
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
        name="MainScreen"
        component={MainScreen}
        options={{ title: translate('Main screen', props.props.root.language) }}
      />
      <Stack.Screen
        name="MedicineScreen"
        component={MedicineScreen}
        options={{ title: translate('Medicines', props.props.root.language) }}
      />
      <Stack.Screen
        name="MedicineDetail"
        component={MedicineDetail}
        options={{ title: translate('Medicine', props.props.root.language) }}
      />
      <Stack.Screen
        name="DoctorsScreen"
        component={DoctorsScreen}
        options={{ title: translate('Doctors', props.props.root.language) }}
      />
      <Stack.Screen
        name="DoctorDetail"
        component={DoctorDetail}
        options={{ title: translate('Doctor', props.props.root.language) }}
      />
      <Stack.Screen
        name="VisitsScreen"
        component={VisitsScreen}
        options={{ title: translate('Visits', props.props.root.language) }}
      />
      <Stack.Screen
        name="PatientScreen"
        component={PatientScreen}
        options={{ title: translate('Patient', props.props.root.language) }}
      />
      <Stack.Screen
        name="CreateVisit"
        component={CreateVisit}
        options={{ title: translate('Create visit', props.props.root.language) }}
      />
      <Stack.Screen
        name="VisitDetail"
        component={VisitDetail}
        options={{ title: translate('Doctor visit', props.props.root.language) }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: translate('Settings', props.props.root.language) }}
      />
      <Stack.Screen
        name="StatisticScreen"
        component={StatisticScreen}
        options={{ title: translate('Statistic date', props.props.root.language) }}
      />
      <Stack.Screen
        name="StatisticDetail"
        component={StatisticDetail}
        options={{ title: translate('Statistic', props.props.root.language) }}
      />
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ title: translate('Report date', props.props.root.language) }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={{ title: translate('Report', props.props.root.language) }}
      />
    </Stack.Navigator>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      language: undefined,
      theme: '',
      font_size: undefined,
      isLoading: true
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('settings').then(res => {
      res = JSON.parse(res)
      res = res || {
        "color": "white",
        "font": 14,
        "language": "RUSSIAN",
      }
      this.setState({
        ...this.state,
        lanfuage: res.language,
        theme: res.color,
        font_size: res.font,
        isLoading: false,
      })
      this.props.dispatch(change_theme(res.color))
      this.props.dispatch(change_language(res.language))
      this.props.dispatch(change_font_size(res.font))
    })
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
