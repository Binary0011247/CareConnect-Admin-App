import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import Logo from '../components/logo';
import Input from '../components/input'
import Button from '../components/Button';
import { router } from 'expo-router';
import axios from 'axios';

export default function LoginScreen() {
    const [uniqueId, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Handle login logic here
        setLoading(true);
        try {
            // Make a POST request to the backend API
            await axios.post('http://localhost:5000/api/admin', {
                uniqueId,
                password,
            });
        Alert.alert('Success', 'Login successful');
        router.push('/screens/adminHome');
        }
        catch (error) {
            if (error.response) {
                Alert.alert('Error', error.response.data.message || 'Invalid login credentials');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
            }
    };

    const handleForgotPassword = () => {
        console.log('Forgot password pressed');
        router.push('/screens/adminforgotpassword')
       
    };

    return (
        <SafeAreaView style={styles.container}>
           
            <View style={styles.content}>
                <Logo />
                <Text style={styles.title}>CareConnect</Text>
                <Text style={styles.subtitle}>
                Effortless communication for better patient care.
                </Text>
                <Text style={styles.subtitle}>Login in with your credentials</Text>
                <View style={styles.form}>
                    <Input
                        placeholder="Admin Unique ID"
                        value={uniqueId}
                        onChangeText={setId}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button title={loading ? 'Loading...' : 'Continue'} onPress={handleLogin} disabled={loading}/>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#007E7E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
    },
    form: {
        width: '100%',
        marginTop: 16,
    },
    forgotPassword: {
        marginTop: 15,
        marginBottom: 32,
        alignItems: 'center'
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
    },
});

