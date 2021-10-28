import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
import * as Notifications from 'expo-notifications';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData, fetchUserMeds } from '../redux/actions/index'
import { ThemeProvider } from 'react-native-elements';
import { MyTheme } from '../styles';
import MoodTracker from './main/Moodtracker'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import AddScreen from './main/Add'
import SearchScreen from './main/Search'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {


    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
        this.props.fetchUserMeds();
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
                                navigation.navigate("Search", {uid: firebase.auth().currentUser.uid})
                            }})}
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
                         <Tab.Screen name="moodtracker" component={MoodTracker}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="heart" color={color} size={26} />
                            ),
                        }} />
                    <Tab.Screen name="Profile" component={ProfileScreen} 
                        listeners={({ navigation }) => ({
                            tabPress: event => {
                                event.preventDefault();
                                navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                            }})}
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
    medicines: store.userState.medicines
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData, fetchUserMeds }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);