import React, { Component } from 'react';
import { Text, FlatList, View, Image, TouchableWithoutFeedback, AsyncStorage, resizeMode } from 'react-native';
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

    componentWillMount() {
        this.setState({ loading: true });

        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result });

            axios.get(`${BASE_URL}/buyer/requests`, {
                headers: {
                    'token': this.state.tokenUser
                }
            }).then(response => {
                res = response.data.data;
                console.log(res, 'Data Request Order');
                this.setState({ dataReqOrder: res });
                this.setState({ loading: false });
            })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    alert('Koneksi internet bermasalah');
                })
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

    renderData = (item) => {
        return item.map((datax) => {
            const dateFormat = moment(datax.expiredAt).format('DD/MM/YYYY');
            const timeFormat = moment(datax.expiredAt).format('h:mm:ss');
            if (datax.Status.id == 19) {
                if (datax.sanggup == 0) {
                    return (
                        <View
                            style={styles.itemContainerStyle}
                            key={datax.id}
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
                    );
                }

                if (datax.sanggup > 0) {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => this.detailOrder(datax)}
                            key={datax.id}
                        >
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
                        </TouchableWithoutFeedback>
                    );
                }
            }
        })
    }

    renderFlatList = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
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
    }


    detailOrder = (props) => {
        const listData = props;
        this.props.navigation.navigate('DetailRequestOrder', { datas: listData })
    }


    render() {
        return (
            <View>
                {this.renderFlatList()}
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
        alignSelf: 'stretch',
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 75,
        resizeMode: 'cover'
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