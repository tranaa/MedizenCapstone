import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MoodCard from '../../components/MoodCard';
import { fetchUserMoods } from '../../redux/actions';

require('firebase/firestore')

// list view of all mood journal entires, items can be clicked to direct to mood details

function MoodTracker(props) {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { navigate } = props.navigation;
    useEffect(() => {
        props.fetchUserMoods();
    }, [])

    useEffect(() => {
        if (props.moods.length !== 0) {
            setMoods(props.moods);
            setLoading(false);
        }
    }, [props.moods])

    const onCardClick = (mood) => {
        navigate('MoodDetails', mood)
    }

    if(loading && props.moods.length != 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        )
    }

    return (
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={moods}
                    renderItem={({item}) => {
                        return (
                        <MoodCard mood={item} onPress={()=>onCardClick(item)}/>
                    )}}
                    LisHeaderComponent={<></>}
                    ListFooterComponent={<></>}
                    style={{flex: 1}}
                />
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
    medicines: store.userState.medicines,
    moods: store.userState.moods,
})

// connect component state to redux store state
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserMoods }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(MoodTracker);
