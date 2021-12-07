import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MediCard from './MedCard';


// custom component to create a to do list

export default function ToDoList(props) {
    const { navigate } = props.navigation;

    const { meds } = props;

    const renderItem = ({item}) => (
        <MediCard medication={item} onPress={() => clickCard(item.id, item.medName, item.dosage, item.frequency, item.description, item.image, item.active)} />
    );

    const clickCard = (id, name, dose, freq, desc, img, active) => {
        navigate('Details', { medid: id, medName: name, dosage: dose, frequency: freq, description: desc, image: img, active: active })
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn]}
            >
                <Text style={{color: '#FFF'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <SwipeListView
            data={meds}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
        />          
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: 'red',
        right: 0
    }
});