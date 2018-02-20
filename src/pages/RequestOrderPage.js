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
    Spinner
} from './../components/common';
import moment from 'moment';
import { Card } from 'react-native-elements';


class RequestOrderPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: null,
            tokenUser: '',
            dataReqOrder: '',
            expiredContainer: null,
            NoExpiredContainer: null
        };
    };

    async componentWillMount() {
        try {
            const value = await AsyncStorage.getItem('loginCredential');
            if (value !== null) {
                console.log(value, 'Storage Request');
                this.setState({ tokenUser: value })
                return this.getData();
            }
        } catch (error) {
            console.log(error, 'Error Storage Request');
        }
    }

    getData() {
        axios.get(`${BASE_URL}/buyer/requests?key=to&page=0&pageSize=4&sorting=desc`, {
            headers: {
                'token': this.state.tokenUser
            }
        }).then(response => {
            res = response.data.data;
            console.log(res, 'Data Request Order');
            this.setState({ dataReqOrder: res, loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }

    static navigationOptions = {
        title: 'Permintaan',
        header: (
            <View>
                <Header
                    backgroundColor={'#006AAF'}
                    containerStyle={{ backgroundColor: 'red' }}
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'Home', style: { color: '#EFF6F9' } }}
                    rightComponent={{ icon: 'notifications', color: '#faa51a' }}
                />
                <SearchBar
                    style={{ flex: 1 }}
                    round
                    lightTheme
                    inputStyle={{ color: 'white' }}
                    placeholder='Type Here...' />
            </View>
        )
    }

    refreshRequest() {
        return this.getData();
    }

    renderData = (item) => {
        console.log(item, 'Data ReQ');
        if (item === '') {
            return (
                <View style={{ paddingTop: '50%' }}>
                    <Text style={{ color: 'grey', paddingLeft: '25%' }}>
                        Ups.. Your connection internet to slow!
                </Text>
                    <Button onPress={() => this.refreshRequest()}>
                        Tap Tap Me Please!
                </Button>
                </View>
            );
        }

        return item.map((datax, index) => {
            const dateFormat = moment(datax.expiredAt).format('DD/MM/YYYY');
            const timeFormat = moment(datax.expiredAt).format('h:mm:ss');
            if (datax.Status.id == 19) {
                if (datax.sanggup == 0) {
                    return (
                        <Card key={datax.id}>
                            <View
                                style={styles.itemContainerStyle}
                            >
                                <View style={styles.thumbnailContainerStyle}>
                                    <Image
                                        style={styles.thumbnailStyle}
                                        source={{ uri: `${BASE_URL}/images/${datax.Fish.photo}` }}
                                    />
                                </View>
                                <View style={styles.headerContentStyle}>
                                    <Text style={styles.headerTextStyle}>{datax.Fish.name}</Text>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={{ fontSize: 13 }}>Batas Waktu: {dateFormat} Pukul: {timeFormat} </Text>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Expired</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    );
                }

                if (datax.sanggup > 0) {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => this.detailOrder(datax)}
                            key={datax.id}
                        >
                            <Card>
                                <View style={styles.itemContainerStyle}>
                                    <View style={styles.thumbnailContainerStyle}>
                                        <Image
                                            style={styles.thumbnailStyle}
                                            source={{ uri: `${BASE_URL}/images/${datax.Fish.photo}` }}
                                        />
                                    </View>
                                    <View style={styles.headerContentStyle}>
                                        <Text style={styles.headerTextStyle}>{datax.Fish.name}</Text>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text style={{ fontSize: 13 }}>Batas Waktu: {dateFormat} Pukul: {timeFormat} </Text>
                                            <Text>{datax.sanggup} Sanggup | {datax.tidakSanggup} Menolak | {datax.menunggu} Menunggu</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    );
                }
            }
        })
    }

    renderFlatList = () => {
        return (
            <View>
                <FlatList
                    data={[this.state.dataReqOrder]}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }


    detailOrder = (props) => {
        const listData = props;
        this.props.navigation.navigate('DetailRequestOrder', { datas: listData })
    }


    render() {
        if (this.state.loading) {
            return <Spinner size="large" />
        }
        return (
            <ScrollView>
                <View>
                    {this.renderFlatList()}
                </View>
            </ScrollView>
        );
    }
};

const styles = {
    itemContainerStyle: {
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        // alignSelf: 'stretch',
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 100,
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

export default RequestOrderPage;