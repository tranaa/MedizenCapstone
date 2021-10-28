import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'

const MedCard = (props) => {
  const { medication = {
    medName: "Kitty Cat",
    dosage: "2 Hugs",
    frequency: "2",
    description: "Anxiety medication",
    image: "https://i.imgur.com/g3D5jNz.jpg"
  }, onPress = () => { } } = props;
  const { dosage, medName, frequency, description } = medication;
  const image = "https://i.imgur.com/g3D5jNz.jpg";
  return (
    <TouchableOpacity onPress={onPress}>
      <Card class="med-card" elevation={7}>
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.header}>
              {medName}
            </Text>
            <Text style={styles.paragraph}>
              {description}
            </Text>
            <Text style={styles.paragraph}>
              {frequency} x {dosage}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MedCard;


const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
  },
  imageContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#34495e',
  },
  paragraph: {
    color: '#34495e',
  },
  textContainer: {
    flex: 2
  },
  infoContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
  }
});