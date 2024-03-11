/**
 * File:    App.js
 * Author:  Yuvraj Manchanda
 * Brief:   The main App file for playing
 *          and recording sounds in the DB
 *
 */


import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { openDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar'; 
import { Styles } from './styles/page-styles';


// Create SQLite database
const db = openDatabase('db.db');


// State variables to manage recording and last recording URI
export default function App() {
    const [recording, setRecording] = useState(null);
    const [lastRecordingUri, setLastRecordingUri] = useState("");



    // database initialization and last recording fetching
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, duration INTEGER, createdAt TEXT);',
                [],
                null,
                (_, err) => console.log('Error creating table', err)
            );
            tx.executeSql(
                'SELECT uri FROM recordings ORDER BY createdAt DESC LIMIT 1;',
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        setLastRecordingUri(rows._array[0].uri);
                    }
                },
                (_, err) => console.log('Error fetching last recording', err)
            );
        });
    }, []);



    // function Start or Stop Recording 
    const handleRecording = async () => {
        if (recording) {
            // Stop Rec
            await stopRecording();
        } else {
            // Start Rec
            await startRecording();
        }
    };


    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                alert('Permission to access microphone is required!');
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };



    const stopRecording = async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI(); // Get URI 
        setLastRecordingUri(uri); // Update state
        setRecording(null); // Reset state to null
        saveRecording(uri); // Save 
    };



    const saveRecording = (uri) => {
        const createdAt = new Date().toISOString();
        const duration = 0; // Example duration, modify as needed

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO recordings (uri, duration, createdAt) VALUES (?, ?, ?);',
                [uri, duration, createdAt],
                null,
                (_, err) => console.log('Error saving recording to the database', err)
            );
        });
    };


    //Play sound from the local assets
    const playSound = async (soundPath) => {
        try {
            let source;
            if (typeof soundPath === 'string') {
                source = { uri: soundPath }; // Handle URI strings for recorded stuff
            } else {
                source = soundPath; // 
            }
            const { sound } = await Audio.Sound.createAsync(source);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };



    return (

        <View style={Styles.container}>
            <View style={{ height: 30 }}></View> 
            <Text style={Styles.heading}>Welcome to Soundboard</Text>

            <View style={{ height: 100 }}></View> 
            <View style={{ height: 100 }}></View> 

            { }
            <View style={Styles.instrumentButtonContainer}>
                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: '#FF5252' }]} 
                    onPress={() => playSound(require('./assets/sounds/guitar.wav'))}>
                    <Text style={Styles.buttonText}>Guitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: '#FFD740' }]}
                    onPress={() => playSound(require('./assets/sounds/flute.wav'))}>
                    <Text style={Styles.buttonText}>Flute</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Styles.button, { backgroundColor: '#7C4DFF' }]} 
                    onPress={() => playSound(require('./assets/sounds/piano.wav'))}>
                    <Text style={Styles.buttonText}>Piano</Text>
                </TouchableOpacity>
            </View>

            {    }
            <View style={{ flexGrow: 1 }} />

            {         }
            <View style={Styles.recordingButtonContainer}>

                <TouchableOpacity
                    style = {[Styles.button, { backgroundColor: '#4CAF50' }]} 
                    onPress = {handleRecording}>

                    <Text style = {Styles.buttonText}>{recording ? "Stop Recording" : "Start Recording"}</Text>
                </TouchableOpacity>

                {lastRecordingUri && (
                    <TouchableOpacity
                        style={[Styles.button, { backgroundColor: '#F44336' }]} 

                        onPress={() => playSound(lastRecordingUri)}>
                        <Text style={Styles.buttonText}>Play Recording</Text> 

                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

