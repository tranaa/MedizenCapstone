import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Image, StatusBar, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'

export default function Add({ navigation }) {
  //camera
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  // picker
  const [selectedForm, setSelectedForm] = useState();
  const [selectedDose, setSelectedDose] = useState();
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState();
  const [selectedFrequency, setSelectedFrequency] = useState();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* take a picure */}
      {/* <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'} />
      </View>

      <Button
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      <Button title="Save" onPress={() => navigation.navigate('Save', { image })} />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View> */}

      <FormInput
        placeholder="Medication Name"
        // onChangeText={(med_name) => this.setState({ med_name })}
        // labelValue={this.state.med_name}
        iconType="pill"
        autoCorrect={false}
      />
      <FormInput
        // onChangeText={(med_form) => this.setState({ med_form })}
        // labelValue={this.state.med_form}
        placeholderText="Form of Medication (Tablet, Supension, Other)"
        iconType="mortar-pestle-plus"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: add form selector (Tablet, Supension, Other) */}
      <Picker
        selectedValue={selectedForm}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedForm(itemValue)
        }>
        <Picker.Item label="Tablet" value="tablet" />
        <Picker.Item label="Supension" value="supension" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <FormInput
        // labelValue={this.state.med_dose}
        placeholder="Dosage (g, IU, mcg, mEq, mg, Other)"
        // onChangeText={(med_dose) => this.setState({ med_dose })}
        iconType="counter"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: fix UI measures selector (g, IU, mcg, mEq, mg, Other) */}
      <Picker
        selectedValue={selectedDose}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedDose(itemValue)
        }>
        <Picker.Item label="g" value="g" />
        <Picker.Item label="IU" value="iu" />
        <Picker.Item label="mcg" value="mcg" />
        <Picker.Item label="mg" value="mg" />
        <Picker.Item label="mEq" value="meq" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <FormInput
        // labelValue={this.state.med_reason}
        placeholder="What is it treating?"
        // onChangeText={(med_reason) => this.setState({ med_reason })}
        iconType="chat-question-outline"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        // labelValue={this.state.med_frequency}
        placeholder="How often is it taken? (Once Daily, Other)"
        // onChangeText={(med_frequency) => this.setState({ med_frequency })}
        iconType="chat-question-outline"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: fix UI for frequency selector (Once Daily, Twice Daily, Other) */}
      <Picker
        selectedValue={selectedFrequency}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedFrequency(itemValue)
        }>
        <Picker.Item label="Once Daily" value="onceDaily" />
        <Picker.Item label="Twice Daily" value="twiceDaily" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <FormInput
        // labelValue={this.state.med_time}
        placeholder="What time of day is it taken? (Morning, Other)"
        // onChangeText={(med_time) => this.setState({ med_time })}
        iconType="calendar-clock"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: fix UI for time selector (Morning, Noon, Evening, Night, Other) */}
      <Picker
        selectedValue={selectedTimeOfDay}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedTimeOfDay(itemValue)
        }>
        <Picker.Item label="Morning" value="morning" />
        <Picker.Item label="Noon" value="noon" />
        <Picker.Item label="Evening" value="evening" />
        <Picker.Item label="Night" value="night" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <FormInput
        // labelValue={this.state.confirmPassword}
        placeholder="Time"
        // onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
        iconType="clock-outline"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* TODO: add clock/time picker */}

      <FormButton
        // onPress={() => this.onSignUp()}
        title="Add Medication"
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
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
})