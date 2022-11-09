import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, { Component } from 'react';

import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';

class _App extends Component {
    render = () => (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(_App);
