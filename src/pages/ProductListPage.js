import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback, AsyncStorage, resizeMode, ScrollView } from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container,
    Spinner,
    Card
} from './../components/common';
import moment from 'moment';

class ProductListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataProduct: '',
            tokenUser: ''
        };
    };

    componentWillMount() {
        //     try {
        //         const value = await AsyncStorage.getItem('loginCredential');
        //         if (value !== null) {
        //             console.log(value, 'Storage Request');
        //             this.setState({ tokenUser: value })
        return this.getData();
        //         }
        //     } catch (error) {
        //         console.log(error, 'Error Storage Request');
        //     }
    }

    getData() {
        axios.get(`${BASE_URL}/fishes`, {
            params: {
                sorting: 'ASC',
                pageSize: 999
            }
        }).then(response => {
            res = response.data.data;
            console.log(res, 'Data Product');
            this.setState({ dataProduct: res, loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }

    static navigationOptions = {
        title: 'List Produk',
        headerRight: <View />
    }

    refreshRequest() {
        return this.getData();
    }

    renderData = (item) => {
        return (
            <Card>
                <TouchableWithoutFeedback onPress={() => { this.detailProduct(item) }}>
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Card>
        );
    }

    detailProduct = (item) => {
        this.props.navigation.navigate('DetailFisheh', { datas: item })
    }


    render() {
        if (this.state.loading) {
            return <Spinner size="large" />
        }
        return (
            <ScrollView>
                <View>
                    <FlatList
                        data={this.state.dataProduct}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            </ScrollView>
        );
    }
};

const styles = {
    itemContainerStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    thumbnailStyle: {
        // alignSelf: 'stretch',
        height: 100,
        width: 100,
        borderWidth: 1,
        // resizeMode: 'cover'
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    }
}

export default ProductListPage;