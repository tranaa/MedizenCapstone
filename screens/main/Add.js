import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, StatusBar, Platform } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements'
import firebase from 'firebase';
import { USER_MEDICINES_STATE_CHANGE } from '../../redux/constants';
require("firebase/firestore")
import { fetchUserMeds } from '../../redux/actions/index'
import { isEmptyString } from '../../utils';


export default function Add({ navigation }) {
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(false)
  const [nameError, setNameError] = useState("")
  const [dosageError, setDosageError] = useState("")
  const [freqError, setFreqError] = useState("")
  
  const addMedication = () => {
    if(validateForm()) {
      firebase.firestore()
        .collection('medications')
        .doc(firebase.auth().currentUser.uid)
        .collection("userMedications")
        .add({
          medName,
          dosage,
          frequency,
          description,
          active,
          creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function () {
          fetchUserMeds()
          setNameError("")
          setDosageError("")
          setFreqError("")
          navigation.replace("Medizen")
        }))
    }
  }

  const validateForm = () => {
    var isValid = true;
    if (isEmptyString(medName)){
      setNameError("Please input medicine name")
      isValid = false
    }
    if (isEmptyString(dosage)) {
      setDosageError("Please input dosage")
      isValid = false
    }
    if (isEmptyString(frequency)) {
      setFreqError("Please input frequency")
      isValid = false
    }
    return isValid
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow:1}}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
        <Text style={styles.header}>Medication</Text>
        </View>
        <Input
          style={styles.input}
          placeholder="Name"
          onChangeText={medName => setMedName(medName)}
          errorMessage={nameError}
        />
        <Input
          style={styles.input}
          onChangeText={dosage => setDosage(dosage)}
          placeholder="Dosage"
          errorMessage={dosageError}
        />
        <Input
          style={styles.input}
          placeholder="How often is it taken?"
          onChangeText={frequency => setFrequency(frequency)}
          errorMessage={freqError}
        />
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="What is it treating?"
            multiline={true}
            numberOfLines={2}
            onChangeText={description => setDescription(description)}
          />
        </View>
        <View>
        <CheckBox 
          style={styles.checkbox}
          title='Active Medication?'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={active}
          onPress={() => setActive(!active)}
        />
        </View>
        
        <Button
          onPress={() => addMedication()}
          title="Add Medication"
        />
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  textAreaContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 8,
    marginTop: 8
  },
  input: {
    marginBottom: 8
  },
  textArea: {
    height: 150,
    fontSize: 18,
    justifyContent: "flex-start",
    borderBottomWidth: 1,
  },
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  headingContainer: {
    paddingHorizontal: 10,
    width: '100%'
  },
  checkbox: {
    marginBottom: 8,
    backgroundColor: "white"
  }
})