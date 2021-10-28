import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'


const Details = ({ route, navigation }) => {
    const { dosage, medName, frequency, description } = route.params;
    const image = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";

    return (
        <View>
            <View style={styles.mainContainer}>

                <View style={styles.iconStyle}>
                    <MaterialIcons name={'edit'} size={25} color="#666" />
                    {/* <MaterialIcons name={'delete'} size={25} color="#666" /> */}
                </View>
            </View>

            <View style={styles.mainContainer}>


                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            </View>

            <View style={styles.detailsContainer}>

                <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        Name:
                    </Text>
                    <Text style={styles.header}>
                        Dosage:
                    </Text>
                    <Text style={styles.header}>
                        Frequency:
                    </Text>
                    <Text style={styles.header}>
                        Details/Purpose:
                    </Text>
                </View>

                <View style={styles.paragraphContainer}>

                    <Text style={styles.paragraph}>
                        {medName}
                    </Text>
                    <Text style={styles.paragraph}>
                        {dosage}
                    </Text>
                    <Text style={styles.paragraph}>
                        {frequency}
                    </Text>
                    <Text style={styles.paragraph}>
                        {description}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Details;


const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        height: Dimensions.get('window').width / 4,
        width: Dimensions.get('window').width / 4,
    },
    imageContainer: {
        flex: 1,
    },
    headerContainer: {
        flex: 1,
    },
    paragraphContainer: {
        flex: 2
    },
    header: {
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#34495e',
    },
    paragraph: {
        marginBottom: 4,
        color: '#34495e'
    },

    detailsContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: 16,
        marginTop: 16
    },
    mainContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: 10
    },
    iconStyle: {
        padding: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
    }
});