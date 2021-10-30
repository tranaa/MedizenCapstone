import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import MoodCard from '../../components/MoodCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserMoods } from '../../redux/actions';

function MoodTracker(props) {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        props.fetchUserMoods();
    }, [])

    useEffect(() => {
        if (props.moods.length !== 0) {
            setMoods(props.moods);
            setLoading(false);
        }
    }, [props.moods])

    if(loading && props.moods.length != 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        )
    }

    return (
        // <ScrollView style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={moods}
                    renderItem={({item}) => (
                        <MoodCard mood={item} />
                    )}
                    LisHeaderComponent={<></>}
                    ListFooterComponent={<></>}
                    style={{flex: 1}}
                />
            </View>
        // </ScrollView>

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
    medicines: store.userState.medicines,
    moods: store.userState.moods,
    test: store.userState
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMoods }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(MoodTracker);
