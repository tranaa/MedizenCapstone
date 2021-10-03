import React, { Component } from 'react'
import { Image, StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native'
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSENGING_SENDER_ID, APP_ID } from "@env"

import { firebase } from '@firebase/app'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import RegisterScreen from './screens/auth/Register'
import LoginScreen from './screens/auth/Login'
import MainScreen from './screens/Main'
import AddScreen from './screens/main/Add'
import SaveScreen from './screens/main/Save'
import CommentScreen from './screens/main/Comments'


import { initializeApp } from "firebase/app";

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSENGING_SENDER_ID,
  projectId: PROJECT_ID,
  appId: APP_ID
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Image
            source={require('./assets/zenpear.png')}
            style={styles.logo}
          />
          <Text>Loading...</Text>
        </SafeAreaView>
      )
    }

    if (!loggedIn) {
      return (
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} navigation={this.props.navigation} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} navigation={this.props.navigation} />
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} />
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} />
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  logo: {
    height: 150,
    width: 200,
    resizeMode: 'cover',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
});

export default App