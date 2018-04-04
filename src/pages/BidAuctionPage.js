import React, { Component } from 'react';
import { Text, View, AsyncStorage, Image, ToastAndroid, ScrollView, RefreshControl } from 'react-native'
import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
import { NavigationActions } from 'react-navigation';
import { ContainerSection, Button, Input, Spinner, InputNumber } from '../components/common'
import { COLOR, BASE_URL } from './../shared/lb.config';

class BidAuctionPage extends Component {
    static navigationOptions = {
        title: 'Bid Lelang',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            Auction: '',
            auctionId: '',
            refreshing: true,
            tokenUser: '',

            dateNow: '',
            start: '',
            end: '',

            bidAmount: '',
            loading: ''
        }
    }

    componentDidMount() {
        this.setState({
            idAuction: this.props.navigation.state.params.datax.id,
            dateNow: moment(new Date()).format('YYYY-MM-DD')
        });

        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result }, () => { return this.getData(); });
        });
    }


    onChangeInput = (name, value) => {
        this.setState({ [name]: value })
    }

    getData() {
        axios.get(`${BASE_URL}/buyer/auctions-list/${this.state.idAuction}`, {
            headers: {
                token: this.state.tokenUser
            }
        })
            .then(response => {
                const res = response.data.data;
                console.log(res, 'Data Auction');
                console.log(moment(res.startDate).format('YYYY-MM-DD'), 'Data START DATE');
                console.log(moment(res.endDate).format('YYY-MM-DD'), 'Data START END DATE');
                this.setState({ Auction: res, refreshing: false }, () => {
                    this.setState({
                        start: moment(res.startDate).format('YYYY-MM-DD'),
                        end: moment(res.endDate).format('YYY-MM-DD')
                    })
                });
            })
            .catch(error => {
                this.setState({ refreshing: false });
                ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                console.log('ERROR', error.response);
            });
    }

    handleRefresh() {
        this.setState({
            refreshing: true
        }, () => {
            this.getData();
        });
    }

    submit() {
        const { bidAmount } = this.state;

        switch (bidAmount) {
            case '':
                return ToastAndroid.show('Harga tawaran tidak boleh kosong.', ToastAndroid.SHORT);
            default:
                console.log('Harga Tawaran Lolos');
                return this.bidMe();

        }
    }

    bidMe() {
        const { bidAmount } = this.state;
        this.setState({ loading: true });
        axios.post(`${BASE_URL}/buyer/auctions/${this.state.idAuction}/bid`, {
            bidAmount
        }, {
                headers: {
                    token: this.state.tokenUser
                }
            })
            .then(response => {
                console.log(response)
                this.setState({ loading: false })
                ToastAndroid.show('Sukses Bid.', ToastAndroid.SHORT);
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'Auction' })
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah Provinsi')
                }
                ToastAndroid.show('Sukses Bid.', ToastAndroid.SHORT);
                this.setState({ loading: false })
            });
    }


    render() {
        const { Auction, dateNow, start, end, bidAmount, loading } = this.state;
        return (
            <View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh.bind(this)}
                        />
                    }
                >
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.thumbnailContainerStyle}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: `${BASE_URL}/images/${Auction.Fish === undefined ? '' : Auction.Fish.photo}` }}
                                    resizeMode='contain'
                                />
                            </View>
                            <View style={styles.headerContentStyle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{Auction.Fish === undefined ? 'Ikan Apa ya ?' : Auction.Fish.name}</Text>
                                    <Text style={{ fontSize: 18, color: COLOR.secondary_a, flex: 1 }}>{Auction.Fish === undefined ? 'Berapa Ton Ya ?' : Auction.quantity} Ton</Text>
                                </View>
                                <Text>{Auction.Fish === undefined ? '' : Auction.address}</Text>
                                <Text style={{ fontSize: 12, }}>Tujuan Pengiriman {Auction.DestinationCity === undefined ? 'Kemana ya ?' : Auction.DestinationCity.name}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: '5%', marginBottom: '5%', flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1 }}>Harga Pembuka</Text>
                                <Text style={{ flex: 1 }}>Rp. {Auction.Fish === undefined ? '0' : numeral(parseInt(Auction.openingPrice, 0)).format('0,0')}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1 }}>Kelipatan</Text>
                                <Text style={{ flex: 1 }}>Rp. {Auction.Fish === undefined ? '0' : numeral(parseInt(Auction.minIncrement, 0)).format('0,0')}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1 }}>Tawaran Tertinggi</Text>
                                <Text style={{ flex: 1 }}>Rp. {Auction.Fish === undefined ? '0' : numeral(parseInt(Auction.TopBid.bidAmount, 0)).format('0,0')}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        Auction.isRegistered ?
                            <View>
                                <View style={styles.card}>
                                    <ContainerSection>
                                        <View style={{ flex: 1, padding: '3%' }}>
                                            <InputNumber
                                                placeholder='Rp. 8.000.000'
                                                icon="minus"
                                                icons="plus"
                                                value={bidAmount ? numeral(parseInt(bidAmount, 0)).format('0,0') : ''}
                                                onChangeText={v => this.onChangeInput('bidAmount', v.replace(/\./g, ''))}
                                            />
                                        </View>
                                        <View style={{ flex: 1, padding: '3%' }}>
                                            {
                                                loading ?
                                                    <Spinner size='large' />
                                                    :
                                                    <Button
                                                        onPress={() => {
                                                            this.submit();
                                                        }}
                                                    >
                                                        Buat Tawaran
                                                    </Button>
                                            }
                                        </View>
                                    </ContainerSection>
                                </View>
                                {
                                    Auction.Fish ?
                                        <View style={styles.card}>
                                            {
                                                Auction.AuctionHistories && Auction.AuctionHistories.map((item, index) =>
                                                    <View key={index} style={{ padding: '5%', flexDirection: 'column' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ flex: 1 }}>{item.Buyer.organizationType} {item.Buyer.organization}</Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ flex: 1 }}>Rp. {item.bidAmount === null ? '0' : item.bidAmount}</Text>
                                                            <Text style={{ flex: 1 }}>{moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        </View>
                                        :
                                        <View />
                                }
                            </View>
                            :
                            <View style={styles.card}>
                                <View style={{ flexDirection: 'column', padding: 20 }}>
                                    {
                                        moment(dateNow).isBefore(start) ?
                                            <View>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Lelang akan dimulai pada</Text>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{Auction.startDate === undefined ? 'tanggal berapa ya ?' : moment(Auction.startDate).format('DD MMMM YYYY')}</Text>


                                                <ContainerSection>
                                                    <Button
                                                        onPress={() => {
                                                            const { navigate } = this.props.navigation
                                                            navigate('RegisterAuction');
                                                        }}
                                                    >
                                                        Daftar
                                                    </Button>
                                                </ContainerSection>
                                            </View>
                                            :
                                            <View>
                                                {
                                                    moment(dateNow).isBetween(start, end) ?
                                                        <View>
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Lelang akan berakhir pada</Text>
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{Auction.endDate === undefined ? 'tanggal berapa ya ?' : moment(Auction.endDate).format('DD MMMM YYYY')}</Text>


                                                            <ContainerSection>
                                                                <Button
                                                                    onPress={() => {
                                                                        const { navigate } = this.props.navigation
                                                                        navigate('RegisterAuction');
                                                                    }}
                                                                >
                                                                    Daftar
                                                        </Button>
                                                            </ContainerSection>
                                                        </View>
                                                        :
                                                        <View>
                                                            {
                                                                moment(dateNow).isAfter(end) ?
                                                                    <View>
                                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Lelang Sudah Berakhir</Text>
                                                                    </View>
                                                                    :
                                                                    <View />
                                                            }
                                                        </View>
                                                }
                                            </View>
                                    }
                                </View>
                            </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1
    },
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
        flexDirection: 'column',
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
        flexDirection: 'column'
    },
    headerTextStyle: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: 'bold',
    },
}

export default BidAuctionPage
