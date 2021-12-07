import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediCard from '../../components/MedCard';
import { fetchUserMeds } from '../../redux/actions/index';
import { isEmptyString } from '../../utils';

require('firebase/firestore');

// page to search all medication, past and present via medication name

function Search(props) {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("")

    const { navigate } = props.navigation;
    
    useEffect(() => {
        props.fetchUserMeds();
    }, [])

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

// connect component state to redux store state
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
    medicines: store.userState.medicines
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMeds }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Search)