import React, { Component } from 'react';
import { Text, View, AsyncStorage, FlatList, Image, ToastAndroid, TouchableNativeFeedback } from 'react-native'
import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
import { ContainerSection, Button } from '../components/common'
import { COLOR, BASE_URL } from './../shared/lb.config';

class AuctionPage extends Component {
    static navigationOptions = {
        title: 'Daftar Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            listAuction: '',
            refreshing: true,
            tokenUser: '',
            status: 1
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result }, () => { return this.getData(); });
        });
    }

    getData() {
        axios.get(`${BASE_URL}/buyer/auctions-list`, {
            headers: {
                token: this.state.tokenUser
            }
        })
            .then(response => {
                const res = response.data.data;
                console.log(res, 'Data Lelang');
                this.setState({ listAuction: res, refreshing: false });
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

    detailAuction(item) {
        const { navigate } = this.props.navigation;
        navigate('BidAuction', { datax: item })
    }

    renderList = (item) => {
        return (
            <View>
                {
                    this.state.status === 1 ?
                        <TouchableNativeFeedback
                            key={item.id}
                            onPress={() => {
                                const { navigate } = this.props.navigation
                                navigate('BidAuction', { datax: item });
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
                                        <Text style={{ flex: 1 }}>{item.AuctionHistories.length} Tawaran</Text>
                                        <Text style={{ flex: 1 }}>Rp. {numeral(parseInt(item.openingPrice, 0)).format('0,0')}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <TouchableNativeFeedback
                            key={item.id}
                            onPress={() => this.detailAuction(item)}
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
                                    <Text>{item.AuctionHistories.length} Tawaran</Text>
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
                    data={this.state.listAuction}
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

export default AuctionPage
