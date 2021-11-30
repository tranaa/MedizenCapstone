import React, { useState, useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, TextInput, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { USER_MEDICINES_STATE_CHANGE } from '../../redux/constants';
import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")
import { fetchUserMeds, fetchUserToDoList } from '../../redux/actions/index'
import { isEmptyString } from '../../utils';

export default function EditMed(props) {
  const { navigation, route } = props
  const imageDefault = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";


  // const { navigate } = props.navigation;
  const [medId, setMedId] = useState("")
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(false)
  const [image, setImage] = useState("")
  const [nameError, setNameError] = useState("")
  const [dosageError, setDosageError] = useState("")
  const [freqError, setFreqError] = useState("")

  useEffect(() => {
    // if (props.medicines.length !== 0) {
    const { mid, mdosage, mmedName, mfrequency, mdescription, mactive, image } = route.params;
    // let medsFiltered = props.medicines.filter(med => med.active)
    // setMeds(medsFiltered);
    // setLoading(false);
    // }
    setMedId(mid)
    setMedName(mmedName)
    setDosage(mdosage)
    setFrequency(mfrequency)
    setDescription(mdescription)
    setActive(mactive)
  }, [])


  const editMedication = () => {
    if (validateForm()) {
      if(route.params.image) {
        uploadImage()
        .then(() => updateMed())
      } else {
        updateMed()
      }
    }
  }

  const updateMed = () => {
    console.log({ medName, dosage, frequency, description, active, image })
    firebase.firestore()
      .collection('medications')
      .doc(firebase.auth()
        .currentUser.uid)
      .collection("userMedications")
      .doc(medId)
      .update({
        medName: medName.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        description: description.trim(),
        active,
        creation: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      if(!active){
        firebase.firestore()
          .collection('toDoList')
          .doc(firebase.auth().currentUser.uid)
          .collection("userToDoList")
          .doc(medId)
          .delete()
      } else {
        console.log({image})
        firebase.firestore()
          .collection('toDoList')
          .doc(firebase.auth().currentUser.uid)
          .collection("userToDoList")
          .doc(medId)
          .update({
            medName: medName.trim(),
            dosage: dosage.trim(),
            frequency: frequency.trim(),
            description: description.trim(),
            active: active,
            creation: firebase.firestore.FieldValue.serverTimestamp()
          })
        }
    })
    .then((function () {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Medizen' }],
        params: {
          reload: true
        } 
      })
    }))
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

  const addImage = () => {
    // setImage(img)
    // console.log("camera works: ");
    navigation.navigate('Camera', { isAdd: false })
  }

  const uploadImage = async () => {
    const uri = route.params.image;

    const childPath = `medications/${firebase.auth().currentUser.uid}/userMedications/${medId}/${Math.random().toString(36)}`;
    // console.log(mid)
    // console.log(childPath)
    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase
      .storage()
      .ref()
      .child(childPath)
      .put(blob);

    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        console.log("snapshot: ", snapshot)
        // setImage(snapshot)
        savePostData(snapshot)
      })
    }

    const taskError = snapshot => {
      console.log("snapshot: ", snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }

  const savePostData = (downloadURL) => {
    // setImage(downloadURL)
    firebase.firestore()
      .collection('medications')
      .doc(firebase.auth().currentUser.uid)
      .collection("userMedications")
      .doc(medId)
      .update({
        image: downloadURL,
      }).then(() => {
        firebase.firestore()
        .collection('toDoList')
        .doc(firebase.auth().currentUser.uid)
        .collection("userToDoList")
        .doc(medId)
        .update({
          image: downloadURL,
        })
      }).then((function () {
        console.log("dlURL: ", downloadURL);
        // navigation.popToTop()
      }))
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.header}>Edit Medication</Text>
        </View>

        <View style={styles.imgBox}>
          <Image source={{ uri: route.params.image ? route.params.image : imageDefault }} style={styles.image} />
        </View>

        <View style={styles.iconStyle}>
          <TouchableOpacity style={styles.iconStyle} onPress={() => addImage(image)}>
            <MaterialIcons name="add-a-photo" size={30} color="#666" />
            <Text style={styles.editText}>Add Image</Text>
          </TouchableOpacity>
        </View>
        <Input
          style={styles.input}
          placeholder="Name"
          defaultValue={medName}
          onChangeText={medName => setMedName(medName)}
          errorMessage={nameError}
        />
        <Input
          style={styles.input}
          placeholder="Dosage"
          defaultValue={dosage}
          onChangeText={dosage => setDosage(dosage)}
          errorMessage={dosageError}
        />
        <Input
          style={styles.input}
          placeholder="How often is it taken?"
          defaultValue={frequency}
          onChangeText={frequency => setFrequency(frequency)}
          errorMessage={freqError}
        />
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="What is it treating?"
            defaultValue={description}
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
  iconStyle: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    // borderStyle: "dashed",
    borderRadius: 10,
  },
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    padding: 8,
    margin: 8,
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
