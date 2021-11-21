import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Dimensions, StyleSheet, View, Text, Image, FlatList, Button, ScrollView, ActivityIndicator, Platform, SafeAreaView } from 'react-native'
import MediCard from '../../components/MedCard';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { SwipeListView } from 'react-native-swipe-list-view';
import { fetchUserToDoList } from '../../redux/actions/index'
import { bindActionCreators } from 'redux'


function Feed(props) {
    const [meds, setMeds] = useState([]);
    const [toDoList, setToDoList] = useState([]);
    const [loading, setLoading] = useState(true);

    const { navigate } = props.navigation;

    const clickCard = (id, name, dose, freq, desc, img, active) => {
        navigate('Details', { medid: id, medName: name, dosage: dose, frequency: freq, description: desc, image: img, active: active })
    }

    useEffect(() => {
        if (props.medicines.length !== 0) {
            let medsFiltered = props.medicines.filter(med => med.active)
            setMeds(medsFiltered);
            setLoading(false);
        }
    }, [props.medicines])

    useEffect(() => {
        if (props.toDoList.length !== 0) {
            setToDoList(props.toDoList)
        } else {
            let medsFiltered = props.medicines.filter(med => med.active)
            const toDoListRef = firebase.firestore().collection('toDoList').doc(firebase.auth().currentUser.uid)
            let toDoListDate = null
            if (toDoListRef.exists) {
                toDoListRef.onSnapshot((snapshot) => {
                    if(snapshot.exists){
                        toDoListDate = snapshot.data().creation
                    }                
                })
            }
            const todayDate = new Date()
            toDoListRef.get().then((doc) => {
                if (!doc.exists || toDoListDate == null || !sameDay(toDoListDate.toDate(),todayDate)) {
                    firebase.firestore()
                        .collection('toDoList')
                        .doc(firebase.auth().currentUser.uid)
                        .set({
                            creation: firebase.firestore.FieldValue.serverTimestamp()
                        })
                    medsFiltered.forEach(med => {
                        const {medName, dosage, frequency, description, active, creation, id} = med
                        firebase.firestore()
                        .collection('toDoList')
                        .doc(firebase.auth().currentUser.uid)
                        .collection("userToDoList")
                        .doc(id)
                        .set({medName, dosage, frequency, description, active, creation})
                    })
                }
            })
        }
    }, [props.toDoList])

    const sameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }


    const updateToDoList = (item) => {
        const toDoListRef = firebase.firestore().collection('toDoList').doc(firebase.auth().currentUser.uid)
        const doc = toDoListRef.get();
        toDoList.forEach(med => {
            const {medName, dosage, frequency, description, active, creation, id} = med
            firebase.firestore()
            .collection('toDoList')
            .doc(firebase.auth().currentUser.uid)
            .collection("userToDoList")
            .doc(item.id)
            .delete()
            .then(() => {
                const filteredTodoList = toDoList.filter( task => task.id !== item.id)
                setToDoList(filteredTodoList)
                fetchUserToDoList()
            })
        })
    }

    const completeTask = ({item}) => {
        updateToDoList(item)
    }


    if (loading && props.medicines == 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        )
    }

    const renderItem = ({item}) => (
        <MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn]}
                onPress={() => completeTask(data)}  
            >
                <Text style={{color: '#FFF'}}>Complete</Text>
            </TouchableOpacity>
        </View>
    );

    if(!loading && toDoList.length == 0 && props.medicines == 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>All Medication Taken for Today</Text>
            </SafeAreaView>
        )
    }

    return (
        <SwipeListView
            data={toDoList}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
        />  
        // <ScrollView style={styles.container}>
        //     <View style={styles.containerGallery}>
                // <FlatList
                //     numColumns={1}
                //     horizontal={false}
                //     keyExtractor={(item) => item.id}
                //     data={meds}
                //     renderItem={({ item }) => (
                //         <TouchableOpacity>
                //             <MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
                //         </TouchableOpacity>
                //     )}
                //     LisHeaderComponent={<></>}
                //     ListFooterComponent={<></>}
                //     style={{flex: 1}}
                // />
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
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 15,

    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: '#92c05e',
        right: 0
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    medicines: store.userState.medicines,
    toDoList: store.userState.toDoList
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserToDoList }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Feed);