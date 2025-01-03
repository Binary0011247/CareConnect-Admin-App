import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LogoutButton() {
    const handleLogout = () => {
        router.push('../index'); // Replace with your Sign In screen path
        console.log('Logged out and navigating to Login screen');
    }; 

    return (
        <TouchableOpacity style={styles.container} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#8B0000" />
            <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: '#8B0000',
        fontWeight: '500',
    },
});

