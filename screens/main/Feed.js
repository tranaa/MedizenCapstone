import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import MediCard from '../../components/MedCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.medicines.length !== 0) {
            let medsFiltered = props.medicines.filter(med => med.active)
            setMeds(medsFiltered);
            setLoading(false);
        }
    }, [props.medicines])

    if(loading && props.medicines != 0) {
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
                    data={meds}
                    renderItem={({item}) => (
                        <MediCard medication={item} />
                    )}
                    LisHeaderComponent={<></>}
                    ListFooterComponent={<></>}
                    style={{flex: 1}}
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
export default connect(mapStateToProps, null)(Feed);