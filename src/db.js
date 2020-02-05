import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])
    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }

    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyC37_Lo0EODqLfGtxg7v1FDHbgHUSBa0no",
    authDomain: "chatroom-e34eb.firebaseapp.com",
    databaseURL: "https://chatroom-e34eb.firebaseio.com",
    projectId: "chatroom-e34eb",
    storageBucket: "chatroom-e34eb.appspot.com",
    messagingSenderId: "86918280767",
    appId: "1:86918280767:web:8cd5ba999c6a251e76aa8a"
  };

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()