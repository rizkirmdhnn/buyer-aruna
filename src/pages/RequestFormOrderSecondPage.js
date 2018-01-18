import React, { Component } from 'react'
import {
    FlatList,
    View,
    Image,
    Text,
    TouchableNativeFeedback
} from 'react-native'
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container
} from './../components/common';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';

class RequestFormOrderSecondPage extends Component {

    static navigationOptions = {
        title: 'Create Request Order',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            datax: [{}]
        };
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Datas');
        this.setState({ datax: this.props.navigation.state.params.datas });
    }

    onSubmit = () => {
        Keyboard.dismiss()

    }

    renderButton = () => {
        if (this.state.loading) {
            return <Spinner size='large' />
        }

        return (
            <Button
                onPress={
                    () => Alert.alert(
                        '',
                        'Yakin sudah mengisi informasi dengan benar?',
                        [
                            { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Ya', onPress: () => this.onSubmit() },
                        ]
                    )
                }
            >
                Next
			</Button>
        )
    }

    renderItem = (item) => {
        console.log(item, 'Item')
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={require('./../assets/image/gurame.jpg')}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.hedaerTextStyle}>Tuna</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ flex: 1 }}>{item.deskripsi}</Text>
                        <Text style={{ flex: 1, textAlign: 'right' }}>Rp 200000</Text>
                    </View>
                </View>
            </View>
        )
    }

    render(props) {
        console.log(this.state.datax, 'datax');
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.datax}
                    renderItem={({ item }) => this.renderItem(item)}
                />
            </View>
        );
    }
};


const styles = {
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    hedaerTextStyle: {
        fontSize: 20,
    }
}

export default RequestFormOrderSecondPage;