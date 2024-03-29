import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData, fetchUserMeds, fetchUserMoods, fetchUserToDoList } from '../redux/actions/index'
import { ThemeProvider } from 'react-native-elements';
import { MyTheme } from '../styles';
import MoodTracker from './main/MoodTracker'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import AddScreen from './main/Add'
import SearchScreen from './main/Search'

const Tab = createMaterialBottomTabNavigator();

// main component of the application that handles the rendering of the navigation bar, provides navigation to those tabs and theme for the application

export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserMeds();
        this.props.fetchUserMoods();
        this.props.fetchUserToDoList();
        async function registerForPushNotification() {
            const {status} = await Permissions.getAsync(Permissions.Notifications);
     
          }
    }

    render() {
        return (
            <ThemeProvider theme={MyTheme}>
                <Tab.Navigator initialRouteName="Feed" labeled={false}>
                    <Tab.Screen name="Feed" component={FeedScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="Search" component={SearchScreen}
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate("Search", { uid: firebase.auth().currentUser.uid })
                            }
                        })}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="magnify" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="Add" component={AddScreen}
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate("Add", {uid: firebase.auth().currentUser.uid})
                            }})}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                            ),
                        }} />

                    <Tab.Screen name="MoodTracker" component={MoodTracker}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="book-open" color={color} size={26} />
                            ),
                        }} />

                    <Tab.Screen name="Profile" component={ProfileScreen} 
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid, moods : this.props.moods })
                            }
                        })}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                            ),
                        }} />
                </Tab.Navigator>
            </ThemeProvider>
        )
    }
}
// connect component state to redux store state
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    medicines: store.userState.medicines,
    moods: store.userState.moods,
    toDoList: store.userState.toDoList
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMoods, fetchUser, clearData, fetchUserMeds, fetchUserToDoList }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);