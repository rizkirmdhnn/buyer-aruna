/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { HeaderHome } from './../components/common';
import { Button } from 'react-native-elements';


class HomePage extends Component {

    render() {
        return (
            <View>
                <HeaderHome headerText="Home Aruna" />
                <Button
                    title="Request Now!"   
                    raised
                    onPress={this.props.onComplete}  
                    buttonStyle={styles.buttonStyle}           
                />
            </View>
        );
    }
};


const styles = {
    buttonStyle: {
        backgroundColor: '#18A0DF'
    }
}

export default HomePage;