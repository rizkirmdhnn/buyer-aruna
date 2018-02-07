import React, { Component } from 'react';
import { Text, View, FlatList, Image, ScrollView, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import { Button } from 'react-native-elements';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';

class DetailRequestOrderPage extends Component {
    static navigationOptions = {
        title: 'Detail Permintaan',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
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
            unCheckedContainer: false
        };
    };

    componentWillMount() {
        this.setState({ loading: true });

        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({
                dataMaster: this.props.navigation.state.params.datas,
                tokenUser: result,
                checkedSelected: this.props.navigation.state.params.datas.Requests,
                checkedContainer: true,
                loading: false,
            })
        });
    }

    renderData = (item) => {
        console.log(item, 'TONGKOL')
        const dateFormat = moment(item.dueDate).format('DD/MM/YYYY');
        const timeFormat = moment(item.dueDate).format('h:mm:ss');
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={require('./../assets/image/gurame.jpg')}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                    <Text style={styles.headerTextStyle}>{item.size}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text>Rp. {item.minBudget} - Rp. {item.maxBudget}</Text>
                        <Text>Batas Waktu: {dateFormat} Pukul: {timeFormat}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderFlatListDetail = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataMaster]}
                        renderItem={({ item }) => this.renderData(item)}
                    />
                </View>
            );
        }
    }

    renderFlatListSupplierChecked = () => {
        if (this.state.loading) {
            return <Spinner size="small" />
        } else {
            return (
                <View>
                    <FlatList
                        data={[this.state.checkedSelected]}
                        renderItem={({ item }) => this.renderSupplierChecked(item)}
                    />
                </View>
            );
        }
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
                    />
                </View>
            );
        }
    }

    renderSupplierChecked = (item) => {
        console.log(item, '12312312331')
        console.log(this.state.checkedNotSelected, 'Data Push Not Cek');
        return item.map((data, index) => {
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.Supplier.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>Rp. 100.000 - Rp. 500.000</Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    onPress={() => this.checkItem(data)}
                                    checked={this.state.checkedSelected.includes(data)}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            )
        })
    }

    renderSupplierUnChecked = (item) => {
        console.log(this.state.checkedNotSelected, 'Data Push Not Cek');
        return item.map((data, index) => {
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.Supplier.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>Rp. 100.000 - Rp. 500.000</Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    onPress={() => this.unCheckItem(data)}
                                    checked={this.state.checkedNotSelected.includes(data)}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            )
        })
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
        if (this.state.loading) {
            return <Spinner size="small" />
        }
        return (
            <Button
                title="Lanjut Transaksi"
                buttonStyle={styles.buttonStyle}
                onPress={this.endRequest.bind(this)}
            />
        );
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


    render(props) {
        const { checkedContainer, unCheckedContainer } = this.state;
        return (
            <View>
                {this.renderFlatListDetail()}

                <View style={{ flexDirection: 'row' }}>
                    <TouchableWithoutFeedback onPress={() => this.viewCheck()}>
                        <View style={{ flex: 1 }}>
                            <Text> Nelayan Dipilih  ({this.state.checkedSelected.length}) </Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => this.viewUnCheck()}>
                        <View style={{ flex: 1 }}>
                            <Text> Nelayan DiTolak  ({this.state.checkedNotSelected.length}) </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {
                    checkedContainer ?
                        <View style={styles.containerScroll}>
                            <ScrollView>
                                {this.renderFlatListSupplierChecked()}
                            </ScrollView>
                        </View>
                        :
                        <View />
                }


                {
                    unCheckedContainer ?
                        <View style={styles.containerScroll}>
                            <ScrollView>
                                {this.renderFlatListSupplierUnChecked()}
                            </ScrollView>
                        </View>
                        :
                        <View />
                }

                <View>
                    {this.renderButton()}
                </View>
            </View>
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
        height: 50,
        width: 50,
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
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    itemContainerStyleSupplier: {
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
        height: 50,
        width: 50,
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
        padding: 5,
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
}

export default DetailRequestOrderPage;
