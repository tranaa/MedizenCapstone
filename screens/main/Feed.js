import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView, Keyboard } from 'react-native'
import MediCard from '../../components/MedCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Touchable } from 'react-native';

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const { navigate } = props.navigation;

    const clickCard = (name, dose, freq, desc, img) => {
        console.log("it works: " + name);
        navigate('Details', { medName: name, dosage: dose, frequency: freq, description: desc, image: img })
    }
    // useEffect(() => {
    //     if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
    //         props.feed.sort(function (x, y) {
    //             return x.creation - y.creation;
    //         })
    //         setPosts(props.feed);
    //     }
    // }, [props.usersFollowingLoaded, props.feed])

    useEffect(() => {
        if (props.medicines.length !== 0) {
            setMeds(props.medicines);
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
        <ScrollView style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    keyExtractor={(item) => item.id}
                    data={meds}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <MediCard medication={item} onPress={() => clickCard(item.medName, item.dosage, item.frequency, item.description, item.image)} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
    medicines: store.userState.medicines
})
export default connect(mapStateToProps, null)(Feed);