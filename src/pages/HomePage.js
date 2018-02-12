/**
 *  Import Component
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    AsyncStorage,
    FlatList
} from 'react-native';
import { Card, Button, CardSection, Container, ContainerSection, Spinner } from '../components/common'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header, SearchBar, SideMenu, List, ListItem } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import Icon from 'react-native-vector-icons/Ionicons';

class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showAlert: false,
            supplierList: '',
            productList: '',
            loading: null,
            tokenUser: '',
            searchItem: [],
            dataItemSearch: ''
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: '#006AAF' },
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
                    round
                    lightTheme
                    clearIcon={{ name: 'clear' }}
                    onChangeText={(text) => {
                        const { params } = navigation.state;
                        params.handleModal && params.handleModal(text)
                    }}
                    inputStyle={{ color: 'white' }}
                    placeholder='Type Here...'
                />
            </View>
        )
    })

    querySuggestion(text) {
        console.log(text, 'Text');
        axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
            headers: { 'x-access-token': this.state.tokenUser }
        })
            .then(response => {
                res = response.data.data
                this.setState({ searchItem: res })
                console.log(res, 'Auto Complete Nya')
            })
            .catch(error => {
                console.log(error, 'Error');
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
            })
    }

    onItemSelected = (item) => {
        console.log(item, 'Ikan terpilih');
        this.setState({
            dataItemSearch: item
        })
        this.props.navigation.navigate('Filter', { datas: item });
    }


    componentDidMount() {
        this.props.navigation.setParams({ handleModal: (text) => this.querySuggestion(text) });
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
        const { navigate } = this.props.navigation;
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result, 'Token');
            if (result !== null) {
                navigate('RequestFormOrderFirst');
            } else if (result == null) {
                this.setState({
                    showAlert: true
                });
            }
        });
    }

    credentialProduct() {
        const { navigate } = this.props.navigation;
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result, 'Token');
            if (result !== null) {
                navigate('FormProductRequest');
            } else if (result == null) {
                this.setState({
                    showAlert: true
                });
            }
        });
    }

    isLogout() {
        const { navigate } = this.props.navigation;
        console.log('Logout Klik');
        AsyncStorage.getItem('loginCredential', (err, result) => {
            AsyncStorage.removeItem('loginCredential', () => {
                alert('Berhasil Logout!');
                console.log('Logout Klik Sukses');
                navigate('Home');
            });
        });
    }


    filterPage = () => {
        const { navigate } = this.props.navigation;
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
                    this.setState({ supplierList: res });
                    console.log(res, 'Data Supplier Popular');

                    axios.get(`${BASE_URL}/products/popular`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => {
                            const res = response.data.data;
                            console.log(res, 'Data Product Popular');
                            this.setState({ productList: res });
                            this.setState({ loading: false })
                        })
                        .catch(error => {
                            console.log('ERROR', error.message);
                        });
                })
                .catch(error => {
                    console.log('ERROR', error.message);
                });
        });
    }

    goSupplier = () => {
        console.log('Profile Supplier');
        console.log(this.props.navigation, 'Navi')
        this.props.navigation.navigate('ProfileSupplier', { datas: this.state.supplierList });
    }

    isLogin() {
        const { navigate } = this.props.navigation;
        this.props.navigation.navigate('Login', { datas: 'Home' });
    }

    renderButton = () => {
        if (this.state.tokenUser !== null) {
            return (
                <Button
                    onPress={() => this.isLogout()}>
                    Logout
                </Button>
            )
        } else if (this.state.tokenUser == null) {
            return (
                <Button
                    onPress={() => this.isLogin()}>
                    Login
                </Button>
            )

        }
    }

    _keyExtractor = (item, index) => item.id;

    renderProductItem = (itemProduct) => {
        if (this.state.loading == true) {
            return <Spinner size="small" />
        }
        return (
            <View>
                <TouchableWithoutFeedback onPress={() => {
                    this.goSupplier()
                }}>
                    <Image style={styles.item} source={{ uri: `${BASE_URL}/images/${itemProduct.item.Fish.photo}` }} resizeMode='cover' />
                </TouchableWithoutFeedback>
            </View>
        )
    }

    renderSupplierItem = (itemSupplier) => {
        console.log(itemSupplier, 'Data Supplier');
        if (this.state.loading == true) {
            return <Spinner size="small" />
        }
        return (
            <View>
                <TouchableWithoutFeedback onPress={() => {
                    this.goSupplier()
                }}>
                    <Image
                        style={styles.item}
                        source={{ uri: `${BASE_URL}/images/${itemSupplier.item.photo}` }}
                        resizeMode='cover'
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }


    render() {
        const { navigate } = this.props.navigation;
        const {
            showAlert,
            requestExpanded,
            searchItem
        } = this.state;

        return (

            <View style={styles.container}>
                <ScrollView>
                    {
                        searchItem && searchItem.map(item =>
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => this.onItemSelected(item)}
                            >
                                <View style={styles.containerItemAutoSelect}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    <Image
                        style={styles.imageStyle}
                        source={require('./../assets/image/fish_1.jpg')}
                    />

                    <Button
                        onPress={() => {
                            this.credentialButton()
                        }}>
                        Requests Now!
                    </Button>

                    <View>
                        {this.renderButton()}
                    </View>

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>PRODUCT TERLARIS</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerFlatList}>
                        <FlatList
                            data={this.state.productList}
                            numColumns={3}
                            horizontal={false}
                            keyExtractor={this._keyExtractor}
                            renderItem={this.renderProductItem.bind(this)}
                        />
                    </View>

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>PEMASOK POPULER</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerFlatList}>
                        <FlatList
                            data={this.state.supplierList}
                            numColumns={3}
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
                        navigate('RegistrationForm');
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                        this.props.navigation.navigate('Login', { datas: 'RequestFormOrderFirst' })
                    }}
                />

            </View>
        );
    }
};


const styles = {
    containerFlatList: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
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
        width: 380,
        height: 180
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
        margin: 2
    }
}

export default HomePage;