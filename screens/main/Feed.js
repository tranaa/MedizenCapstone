import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import MediCard from '../../components/MedCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Touchable } from 'react-native';
import { fetchUserMeds } from '../../redux/actions/index'
function Feed(props) {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const { navigate } = props.navigation;

    const clickCard = (id, name, dose, freq, desc, img, active) => {
        navigate('Details', { medid: id, medName: name, dosage: dose, frequency: freq, description: desc, image: img, active: active })
    }
    useEffect(() => {
        props.fetchUserMeds();
    }, [])

    useEffect(() => {
        if (props.medicines.length !== 0) {
            let medsFiltered = props.medicines.filter(med => med.active)
            setMeds(medsFiltered);
            setLoading(false);
        }
    }, [props.medicines])

    if (loading && props.medicines != 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        )
    }

    return (
        // <ScrollView style={styles.container}>
        //     <View style={styles.containerGallery}>
        <FlatList
            numColumns={1}
            horizontal={false}
            keyExtractor={(item) => item.id}
            data={meds}
            renderItem={({ item }) => (
                <TouchableOpacity>
                    <MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
                </TouchableOpacity>
            )}
            LisHeaderComponent={<></>}
            ListFooterComponent={<></>}
            style={{ flex: 1 }}
        />
        //     </View>
        // </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        height: Dimensions.get('window').width,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    medicines: store.userState.medicines
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMeds }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Feed);