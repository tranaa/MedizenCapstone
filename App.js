import { StatusBar } from 'expo-status-bar'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { firebase } from '@firebase/app'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'

import { initializeApp } from "firebase/app";

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyDOYgtC8n6XerqRL5MbbSUibig8UXj2yxo",
  authDomain: "medizen-acf96.firebaseapp.com",
  projectId: "medizen-acf96",
  storageBucket: "medizen-acf96.appspot.com",
  messagingSenderId: "790857921926",
  appId: "1:790857921926:web:753a001ce12532b1f56807"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      load: false
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
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
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      // <Provider store={store}>
      //   <Stack.Navigator initialRouteName="Main">
      //       <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
      //     </Stack.Navigator>
      // </Provider>
      <View>
        <Text>
          HELLO
        </Text>
      </View>
    );
    
  }
}

export default App