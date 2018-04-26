import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import {
    InputSearch
} from './../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class ProductListPage extends Component {

    static navigationOptions = {
        title: 'Daftar Produk',
        headerRight: <View />
    }

    constructor(props) {
        super(props);
        this.state = {
            dataProduct: '',
            tokenUser: '',
            searchItem: '',
            refresh: true,
            dataSearch: false
        };
    }

    componentWillMount() {
        return this.getData();
    }

    getData() {
        this.setState({ dataSearch: false });
        axios.get(`${BASE_URL}/fishes`, {
            params: {
                sorting: 'ASC',
                pageSize: 999
            }
        }).then(response => {
            res = response.data.data;
            console.log(res, 'Data Product');
            this.setState({ dataProduct: res, refresh: false });
        })
            .catch(error => {
                this.setState({ refresh: false });
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }

    handleRefresh = () => {
        console.log('Refresh');
        this.setState({
            refresh: true
        }, () => {
            console.log('Fetch Again');
            this.getData();
        })
    }


    querySuggestion(text) {
        console.log(text, 'Text');
        this.setState({ refresh: true })
        if (text !== '') {
            console.log('Text Tidak Kosong');
            this.setState({ dataSearch: true });
            axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
                params: {
                    sorting: 'ASC'
                }
            })
                .then(response => {
                    res = response.data.data
                    this.setState({ searchItem: res, refresh: false })
                    console.log(res, 'Auto Complete Nya')
                })
                .catch(error => {
                    console.log(error, 'Error');
                    this.setState({ refresh: false })
                    ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                })
        } else {
            console.log('Text Kosong');
            this.setState({ dataSearch: false });
        }
    }


    refreshRequest() {
        return this.getData();
    }

    detailProduct = (item) => {
        this.props.navigation.navigate('DetailFishes', { datas: item })
    }

    renderData = (item) => {
        return (
            <View style={styles.card}>
                <TouchableWithoutFeedback onPress={() => { this.detailProduct(item) }}>
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    renderDataSearch = (item) => {
        return (
            <View style={styles.card}>
                <TouchableWithoutFeedback onPress={() => { this.detailProduct(item) }}>
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }


    render() {
        const { dataSearch } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 50 }}>
                    <InputSearch
                        onChangeText={(text) => {
                            this.querySuggestion(text);
                        }}
                        placeholder="Cari Komoditas..."
                        icon="ic_search"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {
                        dataSearch ?
                            <FlatList
                                data={this.state.searchItem}
                                renderItem={({ item }) => this.renderDataSearch(item)}
                                keyExtractor={(item, index) => index}
                                refreshing={this.state.refresh}
                                onRefresh={() => this.handleRefresh()}
                            />
                            :
                            <FlatList
                                data={this.state.dataProduct}
                                renderItem={({ item }) => this.renderData(item)}
                                keyExtractor={(item, index) => index}
                                refreshing={this.state.refresh}
                                onRefresh={() => this.handleRefresh()}
                            />
                    }
                </View>
            </View>
        );
    }
}

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
        color: COLOR.secondary_b,
        fontFamily: 'Muli-Bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    card: {
        borderRadius: 4,
        // borderColor: '#ddd',
        // borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10,
        // marginTop: 2,
        marginBottom: '2%',
        backgroundColor: '#FFF'
    },
}

export default ProductListPage;
