import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen.js';
import BusinessListScreen from './src/screens/BusinessListScreen.js';
import ArticleListScreen from './src/screens/ArticleListScreen.js';
import {Alert, StyleSheet} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo for network status

const db = SQLite.openDatabase('businessArticle.db');

const Stack = createNativeStackNavigator();

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Create tables
    createTables();

    fetchBusinesses();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Update connection state
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const createTables = () => {
    db.transaction(tx => {
      // Create Businesses Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS businesses (
                id TEXT PRIMARY KEY,
                name TEXT
            );`,
        [],
        () => console.log('Businesses table created'),
        (tx, error) => console.log('Error creating businesses table', error),
      );

      // Create Articles Table with Foreign Key Constraint
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS articles (
                id TEXT PRIMARY KEY,
                name TEXT,
                qty INTEGER,
                selling_price REAL,
                business_id TEXT,
                FOREIGN KEY (business_id) REFERENCES businesses(id)
            );`,
        [],
        () => console.log('Articles table created'),
        (tx, error) => console.log('Error creating articles table', error),
      );
    });
  };

  const [businesses, setBusinesses] = useState([]);

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
        (tx, error) => console.log('Error fetching businesses:', error),
      );
    });
  };

  // Sync data (example function)
  const syncData = () => {
    if (isConnected) {
      // Proceed with the sync (e.g., sending data to a server)
      console.log('Network is connected, syncing data...');

      // Here we'll send the business data to a remote server using fetch
      const dataToSync = businesses;

      fetch('https://example.com/api/sync', {
        // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businesses: dataToSync, // Send the data to the server
        }),
      })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
          console.log('Sync successful', data);
          Alert.alert(
            'Sync Successful',
            'Your data has been successfully synced!',
          );
        })
        .catch(error => {
          console.error('Error syncing data:', error);
          Alert.alert(
            'Error',
            'There was an issue syncing the data. Please try again.',
          );
        });
    } else {
      Alert.alert(
        'No Network Connection',
        'Please connect to the internet to sync data.',
      );
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerRight: () => (
              <>
                <Icon
                  name={isConnected ? 'wifi' : 'wifi-off'}
                  size={30}
                  color="#fff"
                  style={styles.headerIcon}
                  onPress={() => console.log('Network Status Icon Pressed')}
                />
                <Icon
                  name={isConnected ? 'sync' : 'sync-off'}
                  size={30}
                  color="#fff"
                  style={styles.headerIcon}
                  onPress={syncData}
                />
              </>
            ),
          }}
        />
        <Stack.Screen name="BusinessList" component={BusinessListScreen} />
        <Stack.Screen name="ArticleList" component={ArticleListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#5A9B7D',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    marginRight: 10,
  },
});

export default App;
