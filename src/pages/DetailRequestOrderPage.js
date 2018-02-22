import React, { Component } from 'react';
import { Text, View, FlatList, Image, ScrollView, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    ContainerSection,
    Container,
    Spinner,
    Button,
    Card
} from './../components/common';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
// import { Button } from 'react-native-elements';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';

class DetailRequestOrderPage extends Component {
    static navigationOptions = {
        title: 'Detail Permintaan',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF', paddingLeft: '20%' },
        headerTintColor: 'white'
    }

    constructor(props) {
        super(props);
        this.state = {
            dataMaster: '',
            loading: null,
            idRequest: [],
            tokenUser: '',
            checkedSelected: [],
            checkedNotSelected: [],
            supplierId: '',

            checkedContainer: false,
            unCheckedContainer: false,

            disabledContainer: null,
            NotDisabledContainer: null,
            buttonExpanded: false
        };
    };

    componentWillMount() {
        const idOrder = this.props.navigation.state.params.datas.id;
        this.setState({ loading: true });
        AsyncStorage.getItem('loginCredential', (err, result) => {
            axios.get(`${BASE_URL}/buyer/requests/${idOrder}`, {
                headers: {
                    'token': result
                }
            }).then(response => {
                res = response.data.data;
                console.log(res, 'ARIP LUKAMAN');
                if (res.Requests.length > 0) {
                    this.setState({ buttonExpanded: true });
                }
                this.setState({
                    dataMaster: this.props.navigation.state.params.datas,
                    tokenUser: result,
                    checkedSelected: res.Requests,
                    checkedContainer: true,
                    loading: false,
                })
            })
                .catch(error => {
                    this.setState({ loading: false });
                    console.log(error.response, 'Erroor nya');
                    console.log('Error Request Order Get Data');
                })
        });
    }

    renderData = (item) => {
        console.log(item, 'Data Detail Request')
        const dateFormat = moment(item.dueDate).format('DD/MM/YYYY');
        const timeFormat = moment(item.dueDate).format('h:mm:ss');
        return (
            <Card>
                <View style={styles.itemContainerStyle}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyles}
                            source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                        <Text style={styles.headerTextStyle}>{item.size} Kg</Text>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text>Sampai Tanggal: {dateFormat}</Text>
                            <Text>Pukul: {timeFormat}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        )
    }

    renderFlatListSupplierUnChecked = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.checkedNotSelected]}
                        renderItem={({ item }) => this.renderSupplierUnChecked(item)}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            );
        }
    }

    renderSupplierChecked = (item) => {
        console.log(item, 'DATA SUPPLIER CHECK');
        if (item.length > 0) {
            console.log('Ada Data');
            return item.map((data, index) => {
                return (
                    <View key={index}>
                        <Card key={data.id}>
                            <View style={styles.itemContainerStyleSupplier}>
                                <View style={styles.thumbnailContainerStyle}>
                                    <Image
                                        style={styles.thumbnailStyle}
                                        source={{ uri: `${BASE_URL}/images/${data.Supplier.photo}` }}
                                    />
                                </View>
                                <View style={styles.headerContentStyle}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#009AD3' }}>{data.Supplier.name}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                            <CheckBox
                                                containerStyle={{ backgroundColor: 'transparent' }}
                                                onPress={() => this.checkItem(data)}
                                                checked={this.state.checkedSelected.includes(data)}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ flex: 1 }}>{data.Supplier.organization} </Text>
                                        <Text style={{ flex: 1 }}>500 Kg </Text>
                                        <Text style={{ flex: 1 }}>Rp. 100.000 - Rp. 500.000</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                )
            })
        }
        if (item.length == 0) {
            return (
                <View>
                    <Text style={{ textAlign: 'center', marginTop: '45%' }}>Belum ada nelayan yang menyanggupi.</Text>
                </View>
            )
        }
    }

    renderSupplierUnChecked = (item) => {
        if (item.length > 0) {
            console.log('Ada Data');
            return item.map((data, index) => {
                return (
                    <Card>
                        <View style={styles.itemContainerStyleSupplier}>
                            <View style={styles.thumbnailContainerStyle}>
                                <Image
                                    style={styles.thumbnailStyle}
                                    source={{ uri: `${BASE_URL}/images/${data.Supplier.photo}` }}
                                />
                            </View>
                            <View style={styles.headerContentStyle}>
                                <View style={{ flex: 1, }}>
                                    <Text style={{ fontWeight: 'bold', color: '#009AD3' }}>{data.Supplier.name}</Text>
                                    <CheckBox
                                        containerStyle={{ backgroundColor: 'transparent' }}
                                        onPress={() => this.unCheckItem(data)}
                                        checked={this.state.checkedNotSelected.includes(data)}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                                    <Text style={{ flex: 1, fontWeight: 'bold' }}>Rp. 100.000 - Rp. 500.000</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                )
            })
        }

        if (item.length == 0) {
            console.log('Tidak Ada Data');
            return (
                <View>
                    <Text style={{ textAlign: 'center', marginTop: '45%' }}>Anda belum menolak supplier.</Text>
                </View>
            )
        }
    }

    checkItem = data => {
        const { checkedSelected, checkedNotSelected } = this.state;
        if (!checkedSelected.includes(data)) {
            this.setState({
                checkedSelected: [...checkedSelected, data]
            });
        } else {
            this.setState({
                checkedSelected: checkedSelected.filter(a => a !== data),
                checkedNotSelected: [...checkedNotSelected, data]
            });
        }
    };

    unCheckItem = data => {
        const { checkedSelected, checkedNotSelected } = this.state;
        if (!checkedNotSelected.includes(data)) {
            this.setState({
                checkedNotSelected: [...checkedNotSelected, data]
            });
        } else {
            this.setState({
                checkedNotSelected: checkedNotSelected.filter(a => a !== data),
                checkedSelected: [...checkedSelected, data]
            });
        }
    };

    endRequest = () => {
        console.log(this.state.dataMaster, 'End Request');
        this.setState({ loading: true });
        const { navigate } = this.props.navigation;

        this.state.checkedSelected.map((item, index) => {
            this.state.idRequest.push(item.id)
        })

        const dataId = {
            'RequestIds': this.state.idRequest
        }
        const idReq = this.state.dataMaster.id;
        console.log(dataId, 'ID PUT');
        axios.put(`${BASE_URL}/buyer/requests/${idReq}`,
            dataId
            , {
                headers: {
                    'token': this.state.tokenUser,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                res = response.data.data;
                console.log(response, 'RES');
                this.setState({ loading: false });
                navigate('Transaction');
            })
            .catch(error => {
                console.log(error.message, 'Error nya');
                console.log(error.response, 'Error nya');
                console.log(error, 'Error nya');
                alert("Sorry, Something error!")
            })
    }

    renderButton() {
        const {
            disabledContainer,
            NotDisabledContainer
        } = this.state;

        if (this.state.loading) {
            return <Spinner size="small" />
        }
        if (this.state.dataMaster.Status.id == 19) {
            if (this.state.dataMaster.sanggup > 0) {
                return (
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={this.endRequest.bind(this)}
                        >
                            Lanjut Transaksi
                        </Button>
                    </View>
                );
            }
        }
        if (this.state.dataMaster.Status.id == 20) {
            if (this.state.dataMaster.sanggup > 0) {
                return (
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={this.endRequest.bind(this)}
                        >
                            Lanjut Transaksi
                        </Button>
                    </View>
                );
            }
            if (this.state.dataMaster.sanggup == 0) {
                return (
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={this.endRequest.bind(this)}
                        >
                            Lanjut Transaksi
                        </Button>
                    </View>
                );
            }
        }
    }

    viewCheck() {
        this.setState({
            checkedContainer: true,
            unCheckedContainer: false
        });
    }

    viewUnCheck() {
        this.setState({
            checkedContainer: false,
            unCheckedContainer: true
        });
    }


    render() {
        const {
            checkedContainer,
            unCheckedContainer,
            buttonExpanded,
            disabledContainer,
            NotDisabledContainer,
            loading
        } = this.state;


        console.log(this.state.buttonExpanded, 'Button');

        if (loading) {
            return <Spinner size="large" />
        }

        return (
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View>
                        <FlatList
                            data={[this.state.dataMaster]}
                            renderItem={({ item }) => this.renderData(item)}
                            keyExtractor={(item, index) => index}
                        />

                        <View style={{ marginTop: '2%', flex: 1, flexDirection: 'row' }}>
                            <Button
                                onPress={() => this.viewCheck()}
                            >
                                Supplier Dipilih ({this.state.checkedSelected.length})
                            </Button>
                            <Button
                                onPress={() => this.viewUnCheck()}
                            >
                                Supplier Ditolak ({this.state.checkedNotSelected.length})
                            </Button>
                        </View>
                    </View>

                    <View style={{ marginTop: '2%' }}>

                        {
                            checkedContainer ?
                                <View>
                                    <FlatList
                                        data={[this.state.checkedSelected]}
                                        renderItem={({ item }) => this.renderSupplierChecked(item)}
                                        keyExtractor={(item, index) => index}
                                    />
                                    {
                                        buttonExpanded ?
                                            <View style={{ flex: 1 }}>
                                                {this.renderButton()}
                                            </View>
                                            :
                                            <View />
                                    }
                                </View>
                                :
                                <View />
                        }


                        {
                            unCheckedContainer ?
                                <View>
                                    <FlatList
                                        data={[this.state.checkedNotSelected]}
                                        renderItem={({ item }) => this.renderSupplierUnChecked(item)}
                                        keyExtractor={(item, index) => index}
                                    />
                                </View>
                                :
                                <View />
                        }

                    </View>
                </View>
            </ScrollView>
        );
    }

}

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
        borderRadius: 100
    },
    thumbnailStyles: {
        height: 100,
        width: 100,
        resizeMode: 'stretch',
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
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    itemContainerStyle: {
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    itemContainerStyleSupplier: {
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    headerTextStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    loadingStyle: {
        marginTop: 30
    },
    containerScroll: {
        // padding: 5,
        marginTop: 50,
        height: 200,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 2
    },
    buttonStyle: {
        backgroundColor: '#006AAF',
        width: 318,
        height: 50,
        margin: 5,
        borderRadius: 5
    },
    buttonStyles: {
        backgroundColor: '#009AD3',
        width: 200,
        height: 50,
        margin: 5,
    },
    buttonStylees: {
        backgroundColor: '#006AAF',
        width: 200,
        height: 50,
        margin: 5,
    },
}

export default DetailRequestOrderPage;
