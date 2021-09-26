import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { color } from 'react-native-reanimated'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from "../redux/actions"

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        console.log(currentUser);
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen} 
                    options={{
                        tabBarIcon:({color, size}) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                        headerShown: false
                    }} 
                />
                <Tab.Screen name="AddContainer" component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon:({color, size}) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        )
                    }} 
                />
                <Tab.Screen name="Profile" component={ProfileScreen} 
                    options={{
                        tabBarIcon:({color, size}) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ),
                        headerShown: false
                    }} 
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)
