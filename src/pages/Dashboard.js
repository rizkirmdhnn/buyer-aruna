import React, { Component } from 'react';
import { View, ScrollView, FlatList, Text, TouchableNativeFeedback, Image, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage } from 'react-native';
import { COLOR } from './../shared/lb.config';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Card, Button, CardSection, Container, ContainerSection, Spinner } from '../components/common';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import Swiper from 'react-native-swiper';
class Dashboard extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            showAlert: false,
            supplierList: '',
            productList: '',
            loading: null,
            tokenUser: '',
        }
    }


    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    credentialButton() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result, 'Token');
            if (result !== null) {
                this.props.navi.navigate('RequestFormOrderFirst');
            } else if (result == null) {
                this.setState({
                    showAlert: true
                });
            }
        });
    }

    credentialProduct() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result, 'Token');
            if (result !== null) {
                this.props.navi.navigate('FormProductRequest');
            } else if (result == null) {
                this.setState({
                    showAlert: true
                });
            }
        });
    }


    filterPage = () => {
        const { navigate } = this.props.navi.navigate;
        navigate('Filter');
    }

    componentWillMount() {
        this.setState({ loading: true })
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result);
            this.setState({ tokenUser: result });
            axios.get(`${BASE_URL}/suppliers/popular`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    const res = response.data.data;
                    this.setState({ supplierList: res, loading: false });
                    console.log(res, 'Data Supplier Popular');

                    axios.get(`${BASE_URL}/products/popular`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => {
                            const res = response.data.data;
                            console.log(res, 'Data Product Popular');
                            this.setState({ productList: res, loading: false });
                        })
                        .catch(error => {
                            this.setState({ loading: false })
                            console.log('ERROR', error.response);
                        });
                })
                .catch(error => {
                    this.setState({ loading: false })
                    console.log('ERROR', error.response);
                });
        });
    }

    goSupplier = (event) => {
        this.props.navi.navigate('ProfileSupplier', { datas: event });
    }

    isLogin() {
        this.props.navi.navigate('Login', { datas: 'Home' });
    }

    _keyExtractor = (item, index) => item.id;

    renderProductItem = (itemProduct) => {
        return (
            <View>
                <TouchableWithoutFeedback onPress={() => {
                    // this.goSupplier()
                    console.log('Item Popular');
                }}>
                    <Image
                        style={styles.item}
                        source={{ uri: `${BASE_URL}/images/${itemProduct.item.Fish.photo}` }}
                        resizeMode='cover'
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }

    renderSupplierItem = (itemSupplier) => {
        const number = parseInt(itemSupplier.index) + 1;
        console.log(itemSupplier, ' ', itemSupplier.index, number, 'Data Supplier');

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.goSupplier(itemSupplier)
            }}>
                <View
                    style={styles.itemContainerStyle}
                    key={itemSupplier.index}
                >
                    <View style={styles.headerNumber}>
                        <Text style={styles.headerTextStyleNumber}>{number}.</Text>
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.headerTextStyle}>{itemSupplier.item.name}</Text>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={{ color: 'grey' }}>{itemSupplier.item.organization}</Text>
                        </View>
                    </View>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={{ uri: `${BASE_URL}/images/${itemSupplier.item.photo}` }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }



    render() {
        const {
            menuItemStyle, menuIcon, containerStyle
        } = styles;

        const {
            showAlert
        } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: 480, height: 200 }}>
                    <Swiper style={styles.wrapper} showsButtons={true} autoplay={true}>
                        <View style={styles.slide1}>
                            <Image
                                style={styles.imageStyle}
                                source={require('./../assets/images/banner-5.jpg')}
                            />
                        </View>
                        <View style={styles.slide2}>
                            <Image
                                style={styles.imageStyle}
                                source={require('./../assets/images/banner-4.png')}
                            />
                        </View>
                        <View style={styles.slide3}>
                            <Image
                                style={styles.imageStyle}
                                source={require('./../assets/images/banner-3.jpg')}
                            />
                        </View>
                        <View style={styles.slide3}>
                            <Image
                                style={styles.imageStyle}
                                source={require('./../assets/images/banner-2.png')}
                            />
                        </View>
                        <View style={styles.slide3}>
                            <Image
                                style={styles.imageStyle}
                                source={require('./../assets/images/banner-1.jpg')}
                            />
                        </View>
                    </Swiper>
                </View>

                <ScrollView>
                    <Button
                        onPress={() => {
                            this.credentialButton()
                        }}>
                        Buat Permintaan
                    </Button>

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>Komoditas Favorit</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerFlatList}>
                        <FlatList
                            data={this.state.productList}
                            horizontal={true}
                            keyExtractor={this._keyExtractor}
                            renderItem={this.renderProductItem.bind(this)}
                        />
                    </View>

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>Supplier Popular</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerFlatListSupplier}>
                        <FlatList
                            data={this.state.supplierList}
                            horizontal={false}
                            keyExtractor={this._keyExtractor}
                            renderItem={this.renderSupplierItem.bind(this)}
                        />
                    </View>

                </ScrollView>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title=""
                    message="Anda belum log in ?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Daftar Akun"
                    confirmText="Log in"
                    confirmButtonColor="#006AAF"
                    onCancelPressed={() => {
                        this.hideAlert();
                        console.log(this.props.navi.navigate, 'Navigate')
                        this.props.navi.navigate('RegistrationForm');
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                        this.props.navi.navigate('Login', { datas: 'RequestFormOrderFirst' })
                    }}
                />
            </View>
        )
    }
}

const styles = {
    thumbnailStyle: {
        alignSelf: 'stretch',
        height: 100,
        width: 100,
        borderWidth: 1,
        resizeMode: 'cover'
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    containerFlatList: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
    },
    containerFlatListSupplier: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1
    },
    containerProductCard: {
        flex: 1,
        flexDirection: 'row'
    },
    cardProductCard: {
        flex: 1,
        flexDirection: 'row',
        margin: 10
    },
    containerTextProductCard: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 20
    },
    textCard: {
        flex: 1,
        flexDirection: 'row',
        fontSize: 17,
        fontWeight: 'bold'
    },
    textCardLink: {
        color: '#5D9FE2',
        flex: 1,
        flexDirection: 'row',
        marginRight: 18,
        textAlign: 'right'
    },
    buttonStyle: {
        backgroundColor: '#18A0DF',
        marginTop: 8
    },
    imageStyle: {
        width: 500,
        height: 200
    },
    productCardStyle: {
        width: 93,
        height: 93
    },
    item: {
        width: 116,
        height: 116,
        borderWidth: 1,
        borderColor: 'black',
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    headerTextStyle: {
        marginTop: 10,
        fontSize: 15,
        color: 'grey',
    },
    headerTextStyleNumber: {
        marginTop: 10,
        fontSize: 25,
        color: 'black'
    },
    headerNumber: {
        marginTop: 30,
        marginRight: 30,
        marginLeft: 30,
        flexDirection: 'column',
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 30,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    containerStyle: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: COLOR.secondary_a,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 20 },
        alignItems: 'center',
        shadowOpacity: 0.2,
        width: '100%',
        elevation: 3
    },
    headerText: {
        color: '#fff',
        fontFamily: 'Muli-Bold',
        fontWeight: '300',
        fontSize: 20
    },
    headerHomeStyle: {
        paddingTop: 20,
        paddingBottom: 10,
        flex: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: COLOR.secondary_a,
        width: '100%'
    },
    menuContainerStyle: {
        flex: 4
    },
    profileImageContainer: {
        height: 90,
        width: 90,
        alignSelf: 'center',
    },
    profileImage: {
        height: 90,
        width: 90,
        borderRadius: 50,
    },
    profileName: {
        textAlign: 'center',
        marginTop: 5,
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Muli-Bold'
    },
    coin: {
        height: 24,
        width: 24,
        alignSelf: 'center'
    },
    point: {
        marginTop: 1,
        marginLeft: 5,
        fontSize: 15,
    },
    tabContainer: {
        backgroundColor: COLOR.element_a3,
        height: 50,
        justifyContent: 'center'
    },
    tabContainerActive: {
        backgroundColor: COLOR.element_a4,
        height: 50,
        justifyContent: 'center'
    },
    tabText: {
        color: '#eaeaea',
        textAlign: 'center',
        fontSize: 18
    },
    tabTextActive: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18
    },
    drawerItemText: {
        color: '#fff',
        fontSize: 14
    },
    menuIcon: {
        height: 20,
        width: 20,
        marginRight: 20
    },
    wrapper: {
        
    },
    slide1: {
        flex: 1,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
}


export default Dashboard;
