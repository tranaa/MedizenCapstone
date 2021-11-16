   
import React, { useState, useEffect } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, FlatList, ScrollView, Touchable } from 'react-native'
import MediCard from '../../components/MedCard';
import { Button  } from 'react-native-elements'
import * as Notifications from 'expo-notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
require('firebase/firestore')
import { bindActionCreators } from 'redux'
import { fetchUserMoods, clearData } from '../../redux/actions';
import { connect } from 'react-redux'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
function Profile(props) {
    const [user, setUser] = useState(null);
    const [meds, setMeds] = useState([]);
    const [medCount, setMedCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lineChartData, setLineChartData] = useState(null);
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
            setActiveCount(medsFiltered.length)
            setMedCount(props.medicines.length)
            setInactiveCount(props.medicines.length - medsFiltered.length)
            setMeds(medsFiltered);
        }
        setLoading(false);
    }, [props.medicines])

    useEffect(() => {
        if(props.route.params.moods.length != 0 && props.route.params.moods.length != null) {
            if(props.route.params.moods.length < 7) {
                let dates = props.route.params.moods.map(mood => {
                    const fullDate = mood.creation.toDate().toString()
                    const dateArray = fullDate.split(" ")
                    const date = `${dateArray[1]} ${dateArray[2]}`
                    return date
                })
                let values = props.route.params.moods.map(mood => mood.value)
                setLineChartData({
                    labels: [...dates.reverse()],
                    data: [...values.reverse()],
                })
            }
            else if(props.route.params.moods.length >= 7) {
                let lastWeek = props.route.params.moods.slice(0, 7)
                let dates = lastWeek.map(mood => {
                    const fullDate = mood.creation.toDate().toString()
                    const dateArray = fullDate.split(" ")
                    const date = `${dateArray[1]} ${dateArray[2]}`
                    return date
                })
                let values = lastWeek.map(mood => mood.value)
                setLineChartData ({
                    labels: [...dates.reverse()],
                    data: [...values.reverse()],
                })
            }
        }
    }, [props.route.params.moods])

    useEffect(() => {
        props.fetchUserMoods();
    }, [])

    useEffect(() => {
        if (props.route.params.moods.length !== 0) {
            setMoods(props.route.params.moods);
            setLoading(false);
        }
    }, [props.route.params.moods])

    const onLogout = () => {
        props.clearData();
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
            <ScrollView style={styles.statContainer}>
                <View style={styles.medCountContainer}>
                    <View>
                        <Text style={styles.medCount}>{activeCount}</Text>
                        <Text style={styles.medCountHeader}>Active</Text>
                    </View>
                    <View>
                        <Text style={styles.medCount}>{inactiveCount}</Text>
                        <Text style={styles.medCountHeader}>Inactive</Text>
                    </View>
                    <View>
                        <Text style={styles.medCount}>{medCount}</Text>
                        <Text style={styles.medCountHeader}>Total</Text>
                    </View>
                </View>
                <View style={{marginHorizontal: 8}}>
                    <PieChart
                        data={[
                            { name: 'Active', medication: activeCount, color: 'rgba(146, 192, 94, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                            { name: 'Inactive', medication: inactiveCount, color: 'rgba(146, 192, 94, 0.5)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                        ]}
                        width={Dimensions.get('window').width}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: "#1E2923",
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: "#08130D",
                            backgroundGradientToOpacity: 0.5,
                            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                            useShadowColorFromDataset: false // optional
                        }}
                        accessor={"medication"}
                        backgroundColor={"transparent"}
                        absolute
                    />
                </View>
                <View style={styles.medCountContainer}>
                    <View>
                        <Text style={styles.medCount}>{props.route.params.moods.length}</Text>
                        <Text style={styles.medCountHeader}>Mood Journal</Text>
                    </View>
                </View>
                <View>
                {props.route.params.moods.length != 0 && 
                <><LineChart
                    data={{
                    labels: lineChartData.labels,
                    datasets: [{
                        data: lineChartData.data
                    }]
                    }}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    chartConfig={{
                        backgroundColor: 'white',
                        backgroundGradientFrom: 'rgba(146, 192, 94, 1)',
                        backgroundGradientTo: 'rgba(146, 192, 94, 1)',
                        fillShadowGradient: 'black',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "orange"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 4,
                    }}
                />
                <Text style={styles.medCount}>1 Week</Text>
                </>}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    statContainer: {
        backgroundColor: 'white',
        textAlign: 'center',
    },
    medCountContainer: {
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 12,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "grey",
    },
    medCountHeader: {
        textAlign: 'center',   
    },
    medCount: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
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
        paddingHorizontal: 16,
        backgroundColor: 'white'
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
    medicines: store.userState.medicines,
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMoods, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Profile);