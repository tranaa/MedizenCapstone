import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TextInput, StatusBar, Platform, TouchableOpacity, Image } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements'
import { USER_MEDICINES_STATE_CHANGE } from '../../redux/constants';
import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")
import { fetchUserMeds, fetchUserToDoList } from '../../redux/actions/index'
import { isEmptyString } from '../../utils';
import { MaterialIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';


export default function Add(props) {

  const { navigation } = props;
  const { navigate } = props.navigation;

  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(false)
  const [image, setImage] = useState("")
  const [nameError, setNameError] = useState("")
  const [dosageError, setDosageError] = useState("")
  const [freqError, setFreqError] = useState("")
  const [docRefId, setDocRefId] = useState("")

  const imageDefault = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";
  // const imageDefault = "http://img.medscapestatic.com/pi/features/drugdirectory/octupdate/WHR01690.jpg";
  // tried adding default

  const addMedication = () => {
    if (validateForm()) {
      firebase.firestore()
        .collection('medications')
        .doc(firebase.auth().currentUser.uid)
        .collection("userMedications")
        .add({
          medName: medName.trim(),
          dosage: dosage.trim(),
          frequency: frequency.trim(),
          description: description.trim(),
          active,
          image: "https://cdn-icons-png.flaticon.com/512/1529/1529570.png",
          creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef)=>{
          if(props.route.params.image) {
            uploadImage(docRef.id)
            .then((function () {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Medizen' }]
              })
            }))
          } else {
            if(active){
              firebase.firestore()
              .collection('toDoList')
              .doc(firebase.auth().currentUser.uid)
              .collection("userToDoList")
              .doc(docRef.id)
              .set({
                medName: medName.trim(),
                dosage: dosage.trim(),
                frequency: frequency.trim(),
                description: description.trim(),
                active,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                image: "",
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
          }
        })
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

  const addImage = (img, addFlag) => {
    console.log("camera works: " + img);
    navigate('Camera', { image: img, isAdd: true })
  }

  function getImage(isImage) {
    return (isImage ? image : imageDefault);
  }

  const uploadImage = async (id) => {
    const uri = props.route.params.image;
    const childPath = `medications/${firebase.auth().currentUser.uid}/userMedications/${id}/${Math.random().toString(36)}`;
    console.log(childPath)

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
        savePostData(snapshot, id)
      })
    }

    const taskError = snapshot => {
      console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }

  const savePostData = (downloadURL, mid) => {
    firebase.firestore()
      .collection('medications')
      .doc(firebase.auth().currentUser.uid)
      .collection("userMedications")
      .doc(mid)
      .update({
        image: downloadURL,
      }).then(() => {
        if(active){
          firebase.firestore()
          .collection('toDoList')
          .doc(firebase.auth().currentUser.uid)
          .collection("userToDoList")
          .doc(mid)
          .set({
            medName: medName.trim(),
            dosage: dosage.trim(),
            frequency: frequency.trim(),
            description: description.trim(),
            active,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            image: downloadURL,
          })
        }
      }).then((function () {
        props.fetchUserMeds()
        props.fetchUserToDoList()
        console.log("dlURL: ", downloadURL);
        // navigation.popToTop()
      }))
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.header}>Medication</Text>
        </View>

        <View style={styles.imgBox}>
          <Image source={{ uri: props.route.params.image ? props.route.params.image : imageDefault }} style={styles.image} />
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
          onPress={() => {
            addMedication()
            // console.log(docRef);
            // console.log(docRef.id);
          }}
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
  iconStyle: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
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
})