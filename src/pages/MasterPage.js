/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, View } from 'react-native';

/**
 * List Page
 */
import HomePage from './HomePage';



class MasterPage extends Component {
    render() {
        return(
            <View>
                <HomePage />
            </View>
        );
    }
};

export default MasterPage;
