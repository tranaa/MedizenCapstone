import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Details component, this is the deatils screen that displays a medications info and leads to edit med form
const Details = (props) => {

    const { medid, dosage, medName, frequency, description, active, image } = props.route.params;
    const imageDefault = "https://cdn-icons-png.flaticon.com/512/1529/1529570.png";
    const { navigate } = props.navigation;

    console.log(image);
    const clickEdit = (id, name, dose, freq, desc, img, active) => {
        navigate('EditMed', { mid: id, mmedName: name, mdosage: dose, mfrequency: freq, mdescription: desc, image: img, mactive: active })
    }

    function getActive(isActive) {
        return (isActive ? 'Yes' : 'No');
    }

    function getImage(isImage) {
        return (isImage ? isImage : imageDefault);
    }

    return (
        <View>
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <View style={styles.imgBox}>
                        <Image source={{ uri: getImage(image) }} style={styles.image} />
                    </View>
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
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    iconStyle: {
        flex: 1,
        padding: 16,
        height: '100%',
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
        flexDirection: 'row',
        padding: 8,
        margin: 16,
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
