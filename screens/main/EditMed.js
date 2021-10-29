import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, StatusBar, Platform } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements'
import firebase from 'firebase';
import { USER_MEDICINES_STATE_CHANGE } from '../../redux/constants';
require("firebase/firestore")
import { fetchUserMeds } from '../../redux/actions/index'
import { isEmptyString } from '../../utils';


export default function EditMed({ navigation, route }) {
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("")
  const [active, setActive] = useState("")
  const [nameError, setNameError] = useState("")
  const [dosageError, setDosageError] = useState("")
  const [freqError, setFreqError] = useState("")

  const { mid, mdosage, mmedName, mfrequency, mdescription, mactive } = route.params;

  const editMedication = () => {

    if (validateForm()) {

      firebase.firestore()
        .collection('medications')
        .doc(firebase.auth()
          .currentUser.uid)
        .collection("userMedications")
        .doc(mid)
        .update({

          medName: medName,
          dosage: dosage,
          frequency: frequency,
          description: description,
          active: active,
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
    if (isEmptyString(medName)) {
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.header}>Edit Medication</Text>
        </View>
        <Input
          style={styles.input}
          placeholder={mmedName}
          defaultValue={mmedName}
          onChangeText={medName => setMedName(medName)}
          errorMessage={nameError}
        />
        <Input
          style={styles.input}
          placeholder={mdosage}
          defaultValue={mdosage}
          onChangeText={dosage => setDosage(dosage)}
          errorMessage={dosageError}
        />
        <Input
          style={styles.input}
          // placeholder="How often is it taken?"
          defaultValue={mfrequency}
          placeholder={mfrequency}
          onChangeText={frequency => setFrequency(frequency)}
          errorMessage={freqError}
        />
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            // placeholder="What is it treating?"
            defaultValue={mdescription}
            placeholder={mdescription}
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
            checked={mactive}
            onPress={() => setActive(!active)}
          />
        </View>

        <Button
          onPress={() => editMedication()}
          title="Edit Medication"
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
    height: 20,
    width: 100,
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