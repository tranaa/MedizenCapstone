import React, { Component } from 'react'
import { Text, View, Button, TextInput, ScrollView, StyleSheet, Image,
  Platform, StatusBar } from 'react-native'
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'

import firebase from 'firebase'

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
        }
        this.onSignIn = this.onSignIn.bind(this)
        this.onGoogleSignIn = this.onGoogleSignIn.bind(this)
    }

    componentDidCatch(error){
      this.setState({error}).then(() => {
          console.log(error)
      })
  }

    onSignIn() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
                this.setState({error: `${error}`})
            })
    }

    onGoogleSignIn() {
      const { email, password } = this.state;
      firebase.auth().signInWithEmailAndPassword(email, password)
          .then((result) => {
              console.log(result)
          })
          .catch((error) => {
              console.log(error)
          })
  }

    render() {
      const { error } = this.state
      return (
          <ScrollView contentContainerStyle={styles.container}>
                <Image
                  source={require('../../assets/medizen.png')}
                  style={styles.logo}
              />
              <FormInput
                  labelValue={this.state.email}
                  onChangeText={(email) => this.setState({ email })}
                  placeholderText="Email"
                  iconType="mail"
                  autoCapitalize="none"
                  autoCorrect={false}
              />
              <FormInput
                  labelValue={this.state.password}
                  placeholderText="Password"
                  secureTextEntry={true}
                  iconType="lock"
                  onChangeText={(password) => this.setState({ password })}
              />
              {error != '' && <Text style={styles.errorLabel}>{error}</Text>}
              <FormButton
                  onPress={() => this.onSignIn()}
                  title="Sign In"
              />
              <FormButton
                  onPress={() => this.props.navigation.navigate('Register')}
                  title="Register"
              />
          </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50,
      backgroundColor: 'white',
      height:'100%',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logo: {
      height: 150,
      width: 200,
      resizeMode: 'cover',
    },
    errorLabel: {
      margin: 8,
      color: 'red'
    },
  });

export default Login