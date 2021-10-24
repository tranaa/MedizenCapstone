import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, Dimensions, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import MediCard from '../../components/MedCard';

import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux'
import { isEmptyString } from '../../utils';

function Search(props) {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("")

    const fetchUsers = (search) => {
        if (isEmptyString(query)) {
            setMeds(props.medicines);
        } else {
            firebase.firestore()
            .collection('medications')
            .doc(props.route.params.uid)
            .collection('userMedications')
            .get()
            .then((snapshot) => {
                let meds = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return data
                });
                let medsFiltered = meds.filter(med => {

                    return med.medName.toString().toLowerCase().includes(search.toLowerCase().trim())
                })
                setMeds(medsFiltered);
            })
        }
        
    }

    useEffect(() => {
        if (props.medicines.length !== 0) {
            setMeds(props.medicines);
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
        <View>
            <TextInput
                placeholder="Type Here..."
                onChangeText={(search) => {
                        fetchUsers(search)
                        setQuery(search)
                    }
                }
            />

            {/* <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text styles={{width:100}} >{item.name}</Text>
                    </TouchableOpacity>

                )}
            /> */}
            <ScrollView style={styles.container}>
                <View style={styles.containerGallery}>
                    <FlatList
                        numColumns={1}
                        horizontal={false}
                        data={meds}
                        renderItem={({item}) => (
                            <MediCard medication={item} />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
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
    posts: store.userState.posts,
    following: store.userState.following,
    medicines: store.userState.medicines
})

export default connect(mapStateToProps, null)(Search)