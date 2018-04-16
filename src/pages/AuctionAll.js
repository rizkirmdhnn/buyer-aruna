import React, { Component } from 'react';
import { Text, View, AsyncStorage, FlatList, Image, ToastAndroid, TouchableNativeFeedback } from 'react-native'
import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
// import { ContainerSection, Button } from '../components/common';
import { COLOR, BASE_URL } from './../shared/lb.config';

class AuctionAll extends Component {
    static navigationOptions = {
        title: 'Semua Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            listAuctionAll: '',
            refreshing: true,
            tokenUser: '',
            registerStatus: ''
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result }, () => { return this.getData(); });
        });
    }

    getData() {
        axios.get(`${BASE_URL}/auctions`, {
            headers: {
                token: this.state.tokenUser
            }
        })
            .then(response => {
                const res = response.data.data;
                const registered = response.data;
                console.log(res, 'Data Semua Lelang');
                console.log(registered, 'Data Register');
                this.setState({ listAuctionAll: res, registerStatus: registered, refreshing: false });
            })
            .catch(error => {
                this.setState({ refreshing: false });
                ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                console.log('ERROR', error.response);
            });
    }

    keyExtractor = (item) => item.id;

    handleRefresh = () => {
        console.log('Refresh');
        this.setState({
            refreshing: true
        }, () => {
            console.log('Fetch Again');
            this.getData();
        })
    }

    detailAuctionAll(data, item) {
        this.props.navi.navigate('BidAuction', { datax: data, idBos: item })
    }

    renderList = (item) => {
        const { registerStatus } = this.state;
        return (
            <View>
                {
                    registerStatus.isRegistered ?
                        <TouchableNativeFeedback
                            key={item.id}
                            onPress={() => {
                                this.props.navi.navigate('BidAuction', { datax: registerStatus, idBos: item });
                            }}
                        >
                            <View style={styles.card}>
                                <View style={styles.thumbnailContainerStyle}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                                        resizeMode='contain'
                                    />
                                </View>
                                <View style={styles.headerContentStyle}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{item.Fish.name}</Text>
                                        <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{moment(item.startDate).format('HH:mm:ss')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={{ flex: 1 }}>{item.countBid} Tawaran</Text>
                                        {/* kalo topbid kosong ganti openprice */}
                                        <Text style={{ flex: 1 }}>Rp. {numeral(parseInt(item.openingPrice, 0)).format('0,0')}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <TouchableNativeFeedback
                            key={item.id}
                            onPress={() => this.detailAuctionAll(registerStatus, item)}
                        >

                            <View style={styles.card}>
                                <View style={styles.thumbnailContainerStyle}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                                        resizeMode='contain'
                                    />
                                </View>
                                <View style={styles.headerContentStyle}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{item.Fish.name}</Text>
                                        <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{moment(item.startDate).format('HH:mm:ss')}</Text>
                                    </View>
                                    <Text>Rp. {numeral(parseInt(item.openingPrice, 0)).format('0,0')}</Text>
                                    <Text>{item.countBid} Tawaran</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                }
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.listAuctionAll}
                    renderItem={({ item }) => this.renderList(item)}
                    keyExtractor={(item, index) => index}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.handleRefresh()}
                />
            </View>
        )
    }
}

const styles = {
    card: {
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: '2%',
        marginTop: '2%',
        backgroundColor: '#FFF',
        flexDirection: 'row',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    image: {
        alignSelf: 'stretch',
        height: 100,
        width: 100,
        resizeMode: 'cover',
        borderRadius: 4
    },
    headerContentStyle: {
        flex: 1,
        margin: 13,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: 'bold',
    },
}

export default AuctionAll
