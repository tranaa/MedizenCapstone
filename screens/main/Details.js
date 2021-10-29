import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'


const Details = ({ route, navigation }) => {
    const { id, dosage, medName, frequency, description, active } = route.params;
    const image = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";

    function getActive(isActive) {
        return (isActive ? 'Yes' : 'No');
    }

    return (
        <View>

            <View style={styles.topContainer}>

                <View style={styles.imageContainer}>
                    <View style={styles.imgBox}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                </View>

            </View>

            <View style={styles.detailsContainer}>

                {/* <View style={styles.gapContainer}></View> */}

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
                        Active:
                    </Text>
                    <Text style={styles.header}>
                        Purpose:
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
                        {getActive(active)}
                    </Text>
                    <Text style={styles.paragraph}>
                        {description}
                    </Text>
                </View>
            </View>

            <View style={styles.topContainer}>

                <View style={styles.iconStyle}>
                    <TouchableOpacity>
                        <MaterialIcons name={'edit'} size={40} color="#666" />
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
};

export default Details;


const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        // justifyContent: 'space-around',
        flexDirection: 'row',
        // marginTop: 10,
        alignItems: 'flex-end'
    },
    iconStyle: {
        flex: 1,
        padding: 25,
        height: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        width: 50,
    },
    image: {
        resizeMode: 'cover',
        height: Dimensions.get('window').width / 2,
        width: Dimensions.get('window').width / 2,
        padding: 10,
        margin: 10,
    },
    imgBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        // borderStyle: "dashed",
        borderRadius: 10,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30,
        paddingBottom: 30,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        borderBottomStyle: "dashed",
    },
    detailsContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        // justifyContent: 'center',
        flexDirection: 'row',
        padding: 16,
        // marginTop: 16,
        margin: 30,
        // marginRight: 'auto',
        // alignContent: 'flex-start'
        // alignItems: 'center',
    },
    gapContainer: {
        flex: 1,
    },
    headerContainer: {
        flex: 1,
    },
    paragraphContainer: {
        flex: 2
    },
    header: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
    },
    paragraph: {
        marginBottom: 10,
        fontSize: 16,
        color: '#34495e',
    },
    editText: {
        marginBottom: 10,
        fontSize: 14,
        color: '#34495e',
        alignSelf: 'center'
    },
});