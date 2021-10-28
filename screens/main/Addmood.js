import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, StatusBar, Platform,Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Button, Input, CheckBox  } from 'react-native-elements'
import firebase from 'firebase';
import { USER_MEDICINES_STATE_CHANGE } from '../../redux/constants';
require("firebase/firestore")
import { fetchUserMeds } from '../../redux/actions/index'


export default function Add({ navigation }) {
 
  //Set the mood comment to the variable
  const [moodComment, setMoodComment] = useState("")

  //set the value of mood (1,- 4) where 1 is happy and 4 is bad day 
  const [value, setValue] = React.useState('first');
  




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
        }).then((function () {
          fetchUserMeds()
          navigation.replace("Medizen")
        }))
  }



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headingContainer}>
       <Text style={styles.header}>How are you feeling today ?</Text>
      </View>
      <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
      <View>
      <Image style = {{ width: 30, height: 30 }} source={require('C:/Users/VINAYAK/Desktop/capstone/MedizenCapstone/assets/veryhappy.png')} />
        <RadioButton value="1" />
      </View>
      <View>
      <Image style = {{ width: 30, height: 30 }} source={require('C:/Users/VINAYAK/Desktop/capstone/MedizenCapstone/assets/smiley.png')} />
        <RadioButton value="2" />
      </View>
      <View>
      <Image style = {{ width: 30, height: 30 }} source={require('C:/Users/VINAYAK/Desktop/capstone/MedizenCapstone/assets/sad.png')} />
        <RadioButton value="3" />
      </View>
      <View>
      <Image style = {{ width: 30, height: 30 }} source={require('C:/Users/VINAYAK/Desktop/capstone/MedizenCapstone/assets/anxiety.png')} />
        <RadioButton value="4" />
      </View>
    </RadioButton.Group>
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
    fontSize: '18px',
    justifyContent: "flex-start",
    borderBottomWidth: 1,
  },
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'left',
    alignItems: 'left',
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