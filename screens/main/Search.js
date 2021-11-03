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

    const { navigate } = props.navigation;
    
    const clickCard = (id, name, dose, freq, desc, img, active) => {
        navigate('Details', { medid: id, medName: name, dosage: dose, frequency: freq, description: desc, image: img, active: active })
    }

    const fetchUsers = (search) => {
        if (isEmptyString(query)) {
            setMeds(props.medicines);
        } else {
            let filteredMeds = props.medicines.filter(med => {
                return med.medName.toString().toLowerCase().includes(search.toLowerCase().trim())
            })
            setMeds(filteredMeds)
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
        <View style={styles.container}>
            <TextInput
                placeholder="Search Medication"
                style={styles.input}
                onChangeText={(search) => {
                        fetchUsers(search)
                        setQuery(search)
                    }
                }
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={meds}
                renderItem={({item}) => (
                    <TouchableOpacity>
                        <MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        marginTop: 18,
        marginHorizontal: 18,
        fontSize: 18
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