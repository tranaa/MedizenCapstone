import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Dimensions, Text, Image, TouchableOpacity} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import veryHappy from '../assets/veryhappy.png'
import smiley from '../assets/smiley.png'
import sad from '../assets/sad.png'
import anxiety from '../assets/anxiety.png'


const MoodCard = (props) => {
  const { mood } = props;
  const {
    creation = "",
    moodComment = "",
    value = 0
  } = mood;

  const moodToImage = () => {
    switch(value){
      case 0:
        return anxiety
      case 1:
        return sad
      case 2:
        return smiley
      case 3:
        return veryHappy
      default: 
        return {uri:"https://i.imgur.com/g3D5jNz.jpg"}
    }
  }
  const image = moodToImage()
  const fullDate = creation.toDate().toString()
  const dateArray = fullDate.split(" ")
  const date = `${dateArray[0]} ${dateArray[1]} ${dateArray[2]} ${dateArray[3]}`
  return (
    <Card class="mood-card" elevation={7}>
      <View style={styles.infoContainer}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.header}>
            {date}
          </Text>
          <Text style={styles.paragraph}>
            {moodComment}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default MoodCard;


const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('window').width/4,
    width: Dimensions.get('window').width/4,
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