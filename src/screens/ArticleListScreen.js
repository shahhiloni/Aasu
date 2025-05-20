import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { GlobalStyles } from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = SQLite.openDatabase('businessArticle.db');

const ArticleListScreen = ({ route }) => {
    const { businessId } = route.params;
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState({
        name: '',
        qty: '',
        selling_price: '',
    });
    const [showArticleModal, setShowArticleModal] = useState(false);

    useEffect(() => {
        loadArticles();
    }, []);

    // Load articles from SQLite
    const loadArticles = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM articles WHERE business_id = ?',
                [businessId],
                (tx, results) => {
                    const rows = results.rows.raw();
                    console.log('Fetched articles:', rows);
                    setArticles(rows || []);
                },
                (tx, error) => console.log('Error fetching articles:', error)
            );
        });
    };

    // Add a new article
    const addArticle = () => {
        const { name, qty, selling_price } = articleData;
        if (name && qty && selling_price) {
            const newArticle = {
                id: generateId(),
                name,
                qty: Number(qty),
                selling_price: Number(selling_price),
                business_id: businessId,
            };
            console.log('newArticle', newArticle);

            // Save to SQLite directly
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO articles (id, name, qty, selling_price, business_id) VALUES (?, ?, ?, ?, ?)`,
                    [newArticle.id, newArticle.name, newArticle.qty, newArticle.selling_price, newArticle.business_id],
                    (tx, res) => {
                        console.log('res', res);
                        console.log('Article saved successfully');
                        loadArticles(); // Refresh the list
                    },
                    (tx, error) => console.log('Error saving article:', error)
                );
            });

            // Clear the form and close modal
            setArticleData({ name: '', qty: '', selling_price: '' });
            setShowArticleModal(false);
        } else {
            Alert.alert('Error', 'All fields are required');
        }
    };

    // Generate unique ID for articles
    const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.header}>Articles for this Business</Text>

            {/* Show No Data Message if articles list is empty */}
            {articles.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Icon name="article" size={60} color="#B0B0B0" />
                    <Text style={styles.noDataText}>No Articles Found</Text>
                    <Text style={styles.noDataSubText}>Click the + icon to add a new article.</Text>
                </View>
            ) : (
                <FlatList
                    data={articles || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.articleItem}>
                            <Text style={styles.articleName}>{item.name}</Text>
                            <View style={styles.articleDetails}>
                                <Text style={styles.articleDetail}>Qty: {item.qty}</Text>
                                <Text style={styles.articleDetail}>₹{item.selling_price}</Text>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Floating Action Button for adding a new article */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowArticleModal(true)}
            >
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal for adding new article */}
            <Modal visible={showArticleModal} animationType="slide" transparent={true}>
                <View style={GlobalStyles.modalOverlay}>
                    <View style={GlobalStyles.modalContent}>
                        <Text style={GlobalStyles.modalHeader}>Add Article</Text>
                        <TextInput
                            placeholder="Article Name"
                            value={articleData.name}
                            onChangeText={(val) => setArticleData({ ...articleData, name: val })}
                            style={GlobalStyles.input}
                            placeholderTextColor="#A8A8A8"
                        />
                        <TextInput
                            placeholder="Quantity"
                            keyboardType="numeric"
                            value={articleData.qty}
                            onChangeText={(val) => setArticleData({ ...articleData, qty: val })}
                            style={GlobalStyles.input}
                            placeholderTextColor="#A8A8A8"
                        />
                        <TextInput
                            placeholder="Selling Price"
                            keyboardType="numeric"
                            value={articleData.selling_price}
                            onChangeText={(val) => setArticleData({ ...articleData, selling_price: val })}
                            style={GlobalStyles.input}
                            placeholderTextColor="#A8A8A8"
                        />
                        <View style={GlobalStyles.modalButtons}>
                            <TouchableOpacity style={GlobalStyles.saveButton} onPress={addArticle}>
                                <Text style={GlobalStyles.modalbuttonText}>Save Article</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[GlobalStyles.saveButton, GlobalStyles.cancelButton]}
                                onPress={() => setShowArticleModal(false)}
                            >
                                <Text style={GlobalStyles.modalbuttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ArticleListScreen;

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
    articleItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    articleName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    articleDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    articleDetail: {
        fontSize: 14,
        color: '#555',
    },
});
