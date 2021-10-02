   
import React, { Component } from 'react'
import { View, Button, TextInput, ScrollView, StyleSheet, Image,
    Platform, StatusBar, CheckBox, Text } from 'react-native'
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'

import firebase from 'firebase'
import "firebase/firestore";

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            isViewable: false,
            error: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name } = this.state;
        //implement validation
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
                this.setState({error: `${error}`})
            })
    }

    render() {
        const { isViewable, error } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <FormInput
                    placeholder="Name"
                    onChangeText={(name) => this.setState({ name })}
                    labelValue={this.state.name}
                    iconType="account"
                    autoCorrect={false}
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
                    placeholder="Password"
                    secureTextEntry={!isViewable}
                    onChangeText={(password) => this.setState({ password })}
                    iconType="lock"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <FormInput
                    labelValue={this.state.confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry={!isViewable}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                    iconType="lock"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <View style={styles.checkboxContainer}>
                    <Text style={styles.label}>{isViewable ? 'Hide' : 'Show'} password</Text>
                    <CheckBox
                        value={isViewable}
                        onValueChange={() => this.setState({ isViewable: !isViewable })}
                    />
                </View>
                {error != '' && <Text style={styles.errorLabel}>{error}</Text>}
                <FormButton
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
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
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
    errorLabel: {
        margin: 8,
        color: 'red'
    },
  });

export default Register