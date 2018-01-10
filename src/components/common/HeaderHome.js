import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import { SearchBar } from 'react-native-elements';


const HeaderHome = (props) => {
    const { textStyle, header } = styles;
    return (
        <View style={header}>
            <Image
                style={styles.menuStyle}
                source={require('./../../assets/image/menuButton.png')}
            />
            <SearchBar
                round
                placeholder='Type Here...'
                style={styles.searchStyle}
            />
            <Image
                style={styles.bellStyle}
                source={require('./../../assets/image/bell.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#5D9FE2'
    },
    searchStyle: {
        // flex: 1,
        flexDirection: 'column',
    },
    menuStyle: {
        flexDirection: 'row',
        height: 20,
        width: 25,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 12,
        marginTop: 17
    },
    bellStyle: {
        flexDirection: 'row',
        height: 20,
        width: 25,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 12,
        marginTop: 17
    }
});


export { HeaderHome };