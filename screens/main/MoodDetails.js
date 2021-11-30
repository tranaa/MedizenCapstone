import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { bindActionCreators } from 'redux'
import firebase from 'firebase';
import MediCard from '../../components/MedCard';

import lvl5 from '../../assets/lvl5.png'
import lvl4 from '../../assets/lvl4.png'
import lvl3 from '../../assets/lvl3.png'
import lvl2 from '../../assets/lvl2.png'
import lvl1 from '../../assets/lvl1.png'

const MoodDetails = (props) => {

    console.log({test: props.route.params})
    const { id, moodComment, value, creation } = props.route.params;
    console.log(props)
    const { navigate } = props.navigation;
    const [meds, setMeds] = useState([]);

    const clickCard = (id, name, dose, freq, desc, img, active) => {
        navigate('Details', { medid: id, medName: name, dosage: dose, frequency: freq, description: desc, image: img, active: active })
    }

    useEffect(() => {
        firebase.firestore()
            .collection('moods')
            .doc(firebase.auth().currentUser.uid)
            .collection('userMood')
            .doc(id)
            .collection('medsTaken')
            .get()
            .then((snapshot) => {
                let meds = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setMeds(meds);
            })
    }, [props.route.params.id])

    const moodToImage = () => {
        switch(value){
          case 0:
            return lvl1
          case 1:
            return lvl2
          case 2:
            return lvl3
          case 3:
            return lvl4
          case 4:
            return lvl5
          default: 
            return {uri:"https://i.imgur.com/g3D5jNz.jpg"}
        }
    }
    
    const image = moodToImage()
    const fullDate = creation.toDate().toString()
    const dateArray = fullDate.split(" ")
    const date = `${dateArray[0]} ${dateArray[1]} ${dateArray[2]} ${dateArray[3]}`

    return (
        
        <>
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <Text style={styles.header}>{date}</Text>
                    <Image source={image} style={styles.image} />
                </View>
            </View>
            <View style={styles.MoodDetailsContainer}>
                <View>
                    <Text style={styles.subheader}>Mood + Symptoms:</Text>
                    <ScrollView style={styles.paragraph}>
                        <Text>
                            {moodComment}
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <FlatList
                numColumns={1}
                keyExtractor={(item) => item.id}
                data={meds}
                renderItem={({ item }) => {
                    console.log({item})
                    return (<MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
                )}}
                style={{flex: 1}}
            />
        </>
    );
};

export default MoodDetails;


const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    image: {
        resizeMode: 'cover',
        height: Dimensions.get('window').width / 5,
        width: Dimensions.get('window').width / 5,
        padding: 8,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    MoodDetailsContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 8,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34495e',
    },
    subheader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
    },
    paragraph: {
        fontSize: 14,
        color: '#34495e',
        maxHeight: Dimensions.get('window').height / 5,
    },
});