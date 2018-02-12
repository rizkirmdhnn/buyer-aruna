import React, { Component } from 'react';
import { 
    Text, 
    View, 
    AsyncStorage, 
    FlatList, 
    Image, 
    TouchableWithoutFeedback 
} from 'react-native';
import { Header, SearchBar, Icon } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import moment from 'moment';

class TransactionPage extends Component {
    static navigationOptions = {
        title: 'Transaksi',
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

    constructor(props) {
        super(props);
        this.state = {
            loading: null,
            tokenUser: '',
            dataTransaksi: []
        };
    };


    componentDidMount() {
        this.setState({ loading: true });
        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result });

            axios.get(`${BASE_URL}/buyer/orders`, {
                headers: {
                    'token': this.state.tokenUser
                }
            }).then(response => {
                const result = response.data.data;
                console.log(response, 'Data Transaksi');
                this.setState({ dataTransaksi: result, loading: false });
            })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    alert("Sorry, Something error!")
                })
        });
    }

    detailTransaction = (props) => {
        const dataTransaction = props;
        this.props.navigation.navigate('DetailTransaction', { datas: dataTransaction })
    }

    renderData = (item) => {
        return item.map((item, index) => {
            const dateFormat = moment(item.Request.Transaction.updatedAt).format('DD/MM/YYYY');
            const timeFormat = moment(item.Request.Transaction.updatedAt).format('h:mm:ss');
            return (
                <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => this.detailTransaction(item)}
                >
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${item.Request.Transaction.photo}` }}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View>
                                <Text style={styles.headerTextStyle}>{item.Request.Transaction.Fish.name} - {item.Request.Transaction.size} Kg</Text>
                                <Text style={styles.titleTextStyle}>{item.Request.Supplier.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Image
                                    style={styles.trackingImage}
                                    source={require('./../assets/image/ts1.png')}
                                />
                                <Image
                                    style={styles.trackingImage}
                                    source={require('./../assets/image/ts2.png')}
                                />
                                <Image
                                    style={styles.trackingImage}
                                    source={require('./../assets/image/ts3.png')}
                                />
                                <Image
                                    style={styles.trackingImage}
                                    source={require('./../assets/image/ts4.png')}
                                />
                                <Image
                                    style={styles.trackingImage}
                                    source={require('./../assets/image/ts5.png')}
                                />
                            </View>
                        </View>

                        <View>
                            <Text>DP Dibayar</Text>
                            <Text>{dateFormat}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        })
    }


    renderTransaksi = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataTransaksi]}
                        renderItem={({ item }) => this.renderData(item)}
                    />
                </View>
            );
        }
    }


    render() {
        return (
            <View>
                {this.renderTransaksi()}
            </View>
        );
    }
};



const styles = {
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 8
    },
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
    trackingImage: {
        height: 22,
        width: 22,
        borderRadius: 8
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
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 13,
        fontWeight: 'bold'
    }
}

export default TransactionPage;