   
import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, ScrollView, Touchable } from 'react-native'
import MediCard from '../../components/MedCard';
import { Button  } from 'react-native-elements'
import * as Notifications from 'expo-notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';

function Profile(props) {
    const [user, setUser] = useState(null);
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { navigate } = props.navigation;

   
    useEffect(() => {
        //notification handling when it is running in the background
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
          (response) => {
            //We can move to the specific screen
            navigate('AddMood')
          }
        );
        //notification handling when it is running in the forebackground
        const foregroundSubscription = Notifications.addNotificationReceivedListener(
          (notification) => {
            //We can move to the specific screen
            navigate('AddMood')
          }
        );
    
        return () => {
          //clear cache tokens
          backgroundSubscription.remove();
          foregroundSubscription.remove();
        };
      }, []);
      const triggerNotificationHandler = () => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'How are you doing today ?',
            body: 'Please open the app to track your mood',
            data: { mySpecialData: 'Some text' },
          },
          trigger: {
           seconds: 2        
            
          },
        });
      };
    useEffect(() => {
        const { currentUser } = props;
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
        }
    }, [props.route.params.uid])

    useEffect(() => {
        if (props.medicines.length !== 0) {
            let medsFiltered = props.medicines.filter(med => med.active)
            setMeds(medsFiltered);
            setLoading(false);
        }
    }, [props.medicines])

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }

    if(loading && props.medicines != 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <View style={styles.containerName}>
                    <MaterialCommunityIcons name="account-circle-outline" size={100} color="lightgrey" 
                        style={{marginHorizontal: 8, fontWeight: "normal"}}
                    />
                    <View style={styles.containerNameContext}>
                        <Text style={styles.header}>Welcome {user.name}</Text>
                        <Text style={styles.subheader}>{user.email}</Text>
                        <View style={{flexDirection:"row"}}>
                        <Button
                            title="Log Out"
                            onPress={() => onLogout()}
                            titleStyle={{
                                fontSize: 12,
                            }}
                            buttonStyle={{
                                width: 64,
                                marginRight: 4
                            }}
                        />
                        <Button
                            onPress={triggerNotificationHandler}
                            icon={{
                                name:"notifications",
                                size: 18,
                                color:"white"
                            }}
                        />
                        </View>
                    </View>
                </View>
                
            </View>
            
            {/* <ScrollView style={styles.containerGallery}>
                <View style={styles.containerGallery}> */}
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
                {/* </View>
            </ScrollView> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerName:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    containerNameContext: {
    },
    containerInfo: {
        marginHorizontal: 16
    },
    containerGallery: {
        flex: 1,
    },
    containerImage: {
        flex: 1
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        color: "grey"
    },
    subheader: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        color: "grey"
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        height: (Dimensions.get('window').width)/3,
    },
    button: {
        marginBottom: 8,
        fontSize: 16,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    medicines: store.userState.medicines
})

export default connect(mapStateToProps, null)(Profile)