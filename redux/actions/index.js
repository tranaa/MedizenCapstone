import { USER_TODOLIST_STATE_CHANGE, USER_STATE_CHANGE, USER_MOODS_STATE_CHANGE, USER_MEDICINES_STATE_CHANGE, CLEAR_DATA} from '../constants/index'
import firebase from 'firebase'
require('firebase/firestore')


// redux actions/functions to interact with the store that allows components to share state. These actions/functions retrieve data from firestore and store them in state.
// also an action/function to clear the store for when user logs off

// clear store
export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

// fetch users moods
export function fetchUserMoods() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("moods")
            .doc(firebase.auth().currentUser.uid)
            .collection("userMood")
            .orderBy("creation", "desc")
            .get()
            .then((snapshot) => {
                let moods = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { 
                        id, ...data 
                    }
                })
                dispatch({ type: USER_MOODS_STATE_CHANGE, moods })
            })
    })
}

// fetch user info
export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

// fetch users medication
export function fetchUserMeds() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("medications")
            .doc(firebase.auth().currentUser.uid)
            .collection("userMedications")
            .orderBy("creation", "desc")
            .get()
            .then((snapshot) => {
                let medicines = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { 
                        id, ...data 
                    }
                })
                dispatch({ type: USER_MEDICINES_STATE_CHANGE, medicines })
            })
    })
}

// fetch users to do list
export function fetchUserToDoList() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("toDoList")
            .doc(firebase.auth().currentUser.uid)
            .collection("userToDoList")
            .orderBy("creation", "desc")
            .get()
            .then((snapshot) => {
                let toDoList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { 
                        id, ...data 
                    }
                })
                dispatch({ type: USER_TODOLIST_STATE_CHANGE, toDoList })
            })
    })
}
