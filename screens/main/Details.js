import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'


const Details = (props) => {

    const { medid, dosage, medName, frequency, description, active } = props.route.params;
    const image = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";
    const { navigate } = props.navigation;

    const clickEdit = (id, name, dose, freq, desc, img, active) => {
        console.log("edit works: " + id);
        navigate('EditMed', { mid: id, mmedName: name, mdosage: dose, mfrequency: freq, mdescription: desc, image: img, mactive: active })
    }

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
                    <ScrollView style={styles.description}>
                        <Text style={styles.paragraph}>
                            {description.trim()}
                        </Text>
                    </ScrollView>
                </View>
            </View>

            <View style={styles.topContainer}>

                <View style={styles.iconStyle}>
                    <TouchableOpacity onPress={() => clickEdit(medid, medName, dosage, frequency, description, image, active)}>
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
        padding: 16,
        height: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        width: 50,
    },
    image: {
        resizeMode: 'cover',
        height: Dimensions.get('window').width / 2,
        width: Dimensions.get('window').width / 2,
        padding: 8,
        margin: 8,
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
        marginTop: 16,
        paddingBottom: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    detailsContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        // justifyContent: 'center',
        flexDirection: 'row',
        padding: 8,
        // marginTop: 16,
        margin: 16,
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
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
    },
    paragraph: {
        marginBottom: 8,
        fontSize: 16,
        color: '#34495e',
    },
    editText: {
        marginBottom: 8,
        fontSize: 14,
        color: '#34495e',
        alignSelf: 'center'
    },
    description: {
        height: Dimensions.get('window').height / 10
    }
});