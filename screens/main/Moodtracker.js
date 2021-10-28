import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import MediCard from '../../components/MoodCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.moods.length !== 0) {
            setMeds(props.moods);
            setLoading(false);
        }
    }, [props.moods])

    if(loading && props.moods != 0) {
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
                    data={meds}
                    renderItem={({item}) => (
                        <MoodCard moods={item} />
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
    medicines: store.userState.medicines,
    moods: store.userState.moods
})
export default connect(mapStateToProps, null)(Feed);