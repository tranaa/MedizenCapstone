import { API_KEY, APP_ID, AUTH_DOMAIN, MESSENGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from "@env"
import { firebase } from '@firebase/app'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Component } from 'react'
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './redux/reducers'
import LoginScreen from './screens/auth/Login'
import RegisterScreen from './screens/auth/Register'
import MainScreen from './screens/Main'
import AddMood from './screens/main/AddMood'
import CameraScreen from './screens/main/Camera'
import DetailsScreen from './screens/main/Details'
import EditMedScreen from './screens/main/EditMed'
import MoodDetailsScreen from './screens/main/MoodDetails'
import MoodTracker from './screens/main/MoodTracker'
import SearchScreen from './screens/main/Search'
import { MyTheme } from './styles'

// starting point of application, connects to firebase, and connects navigation through the app that is not reachable via tab view

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
      load: false,
      loggedIn: false
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

    // provides theme and redux store to all child components via provider
    return (
      <SafeAreaView style={styles.container}>
        <ThemeProvider theme={MyTheme} >
          <Provider store={store}>
            <NavigationContainer theme={MyTheme}>
              <Stack.Navigator initialRouteName="Medizen">
                <Stack.Screen name="Medizen" component={MainScreen} navigation={this.props.navigation} />
                <Stack.Screen name="Search" component={SearchScreen} navigation={this.props.navigation} />
                <Stack.Screen name="AddMood" component={AddMood} navigation={this.props.navigation} />
                <Stack.Screen name="MoodTracker" component={MoodTracker} navigation={this.props.navigation} />
                <Stack.Screen name="EditMed" component={EditMedScreen} navigation={this.props.navigation} />
                <Stack.Screen name="Details" component={DetailsScreen} navigation={this.props.navigation} />
                <Stack.Screen name="Camera" component={CameraScreen} navigation={this.props.navigation} />
                <Stack.Screen name="MoodDetails" component={MoodDetailsScreen} navigation={this.props.navigation} />
              </Stack.Navigator>
            </NavigationContainer>
          </Provider>
        </ThemeProvider>
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