import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserMoods } from '../../redux/actions/index';
require("firebase/firestore")

//page to allow user to add their mood into journal can only come to this page via notification

function AddMood(props) {
  const { navigation } = props;
  //Set the mood comment to the variable
  const [moodComment, setMoodComment] = useState("")
  const [meds, setMeds] = useState([])
  //set the value of mood (1,- 4) where 1 is happy and 4 is bad day 
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (props.medicines.length !== 0) {
        let medsFiltered = props.medicines.filter(med => med.active)
        setMeds(medsFiltered);
    }
  }, [props.medicines])
  

  //function to add mood(It is from the onPress button)
  const addMood = () => {
    firebase.firestore()
      .collection('moods')
      .doc(firebase.auth().currentUser.uid)
      .collection("userMood")
      .add({
          value,
          moodComment,
        creation: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function(docRef) {
        meds.forEach(med => {
          const {medName, dosage, frequency, description, active, creation, image} = med
          firebase.firestore()
          .collection('moods')
          .doc(firebase.auth().currentUser.uid)
          .collection("userMood")
          .doc(docRef.id)
          .collection("medsTaken")
          .add({medName, dosage, frequency, description, active, image, creation})
        })
      }).then((function () {
        // fetchUserMoods()
        navigation.reset({
          index: 0,
          routes: [{name: 'Medizen'}]
        })
    }))
  }

  const mood5 = () => <Image style = {{ width: 30, height: 30 }} source={require('../../assets/lvl5.png')} />
  const mood4 = () => <Image style = {{ width: 30, height: 30 }} source={require('../../assets/lvl4.png')} />
  const mood3 = () => <Image style = {{ width: 30, height: 30 }} source={require('../../assets/lvl3.png')} />
  const mood2 = () => <Image style = {{ width: 30, height: 30 }} source={require('../../assets/lvl2.png')} />
  const mood1 = () => <Image style = {{ width: 30, height: 30 }} source={require('../../assets/lvl1.png')} />
  const buttons = [{ element: mood1 }, { element: mood2 }, { element: mood3 }, { element: mood4}, { element: mood5}]

  return (
    <ScrollView contentContainerStyle={{flexGrow:1}}>
      <View style={styles.headingContainer}>
       <Text style={styles.header}>How are you feeling today ?</Text>
      </View>
      <ButtonGroup
        onPress={index => setValue(index)}
        selectedIndex={value}
        buttons={buttons} />

      <View style={styles.textAreaContainer} >
        <TextInput
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholder="Type a few more words about your day:"
          multiline={true}
          numberOfLines={2}
          onChangeText={moodComment => setMoodComment(moodComment)}
        />
      </View>
      <View>
      </View>
      <Button
        onPress={() => addMood()}
        title="Add Mood"
      />
    </ScrollView>
  );
}

// connect component state to redux store state
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  medicines: store.userState.medicines,
  moods: store.userState.moods,
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMoods }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(AddMood);


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
  moodContainer:{
    flexDirection: 'row',
    paddingTop: 50,
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
