import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { change_font_size, change_language, change_theme } from './redux/action/root';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs()
// console.ignoredYellowBox = ['Setting a timer'];
function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#621FF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* <Stack.Screen
        name="TrainingScreen"
        component={TrainingScreen}
        options={{ title: 'Trainings List' }}
      />       */}
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
        <MyStack />
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