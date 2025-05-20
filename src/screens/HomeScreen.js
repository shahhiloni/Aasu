import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Modal,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { GlobalStyles } from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = SQLite.openDatabase('businessArticle.db');

const HomeScreen = ({ navigation }) => {
    const [businesses, setBusinesses] = useState([]);
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [businessName, setBusinessName] = useState('');

    // Create businesses table if it doesn't exist
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS businesses (id TEXT PRIMARY KEY, name TEXT)`,
                [],
                () => console.log('Table created successfully'),
                (tx, error) => console.log('Error creating table:', error)
            );
        });
        fetchBusinesses();
    }, []);

    // Fetch businesses from SQLite
    const fetchBusinesses = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM businesses',
                [],
                (tx, results) => {
                    const rows = results.rows.raw();
                    console.log('Fetched Businesses:', rows);
                    setBusinesses(rows);
                },
                (tx, error) => console.log('Error fetching businesses:', error)
            );
        });
    };

    // Save businesses to SQLite
    const saveBusinessData = newBusiness => {
        if (!newBusiness?.id || !newBusiness?.name) {
            console.error('Business object is not valid:', newBusiness);
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                `INSERT OR REPLACE INTO businesses (id, name) VALUES (?, ?)`,
                [newBusiness.id, newBusiness.name],
                () => console.log('Business saved successfully'),
                (tx, error) => console.log('Error saving business:', error)
            );
        });
    };

    // Generate a unique ID for a business
    const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Add a new business to the list
    const addBusiness = () => {
        if (businessName) {
            const newBusiness = { id: generateId(), name: businessName };

            // Save the new business to SQLite
            saveBusinessData(newBusiness);

            // Update the state
            setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);

            setBusinessName('');
            setShowBusinessModal(false);
        } else {
            Alert.alert('Error', 'Business name is required');
        }
    };

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.header}>Businesses</Text>

            {/* Show No Data Message if list is empty */}
            {businesses.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Icon name="business" size={60} color="#B0B0B0" />
                    <Text style={styles.noDataText}>No Businesses Found</Text>
                    <Text style={styles.noDataSubText}>Click the + icon to add a new business.</Text>
                </View>
            ) : (
                <FlatList
                    data={businesses}
                    keyExtractor={item => item?.id ?? Math.random().toString()}
                    renderItem={({ item }) =>
                        item ? (
                            <View
                                style={[
                                    GlobalStyles.listItem,
                                    { flexDirection: 'row', justifyContent: 'space-between' },
                                ]}
                            >
                                <Text
                                    style={[
                                        GlobalStyles.listItemText,
                                        {
                                            fontSize: 18,
                                            color: '#333',
                                            flex: 1,
                                        },
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                <TouchableOpacity
                                    style={[GlobalStyles.button, { flexDirection: 'row' }]}
                                    onPress={() =>
                                        navigation.navigate('ArticleList', { businessId: item.id })
                                    }
                                >
                                    <Icon name="visibility" size={20} color="#fff" />
                                    <Text style={GlobalStyles.buttonText}> View Articles</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                />
            )}

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowBusinessModal(true)}
            >
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal for adding a new business */}
            <Modal visible={showBusinessModal} animationType="slide" transparent={true}>
                <View style={GlobalStyles.modalOverlay}>
                    <View style={GlobalStyles.modalContent}>
                        <Text style={GlobalStyles.modalHeader}>Add New Business</Text>
                        <TextInput
                            placeholder="Enter Business Name"
                            value={businessName}
                            onChangeText={setBusinessName}
                            style={GlobalStyles.input}
                            placeholderTextColor="#A8A8A8"
                        />
                        <View style={GlobalStyles.modalButtons}>
                            <TouchableOpacity style={GlobalStyles.saveButton} onPress={addBusiness}>
                                <Text style={GlobalStyles.modalbuttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[GlobalStyles.saveButton, GlobalStyles.cancelButton]}
                                onPress={() => setShowBusinessModal(false)}
                            >
                                <Text style={GlobalStyles.butmodalbuttonTexttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#5A9B7D',
        borderRadius: 30,
        elevation: 5,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    noDataText: {
        fontSize: 20,
        color: '#B0B0B0',
        marginTop: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    noDataSubText: {
        fontSize: 14,
        color: '#A0A0A0',
        marginTop: 5,
        textAlign: 'center',
    },
});
