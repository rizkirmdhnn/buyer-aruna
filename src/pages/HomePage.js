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
    TouchableHighlight,
    AsyncStorage,
    FlatList
} from 'react-native';
import { Button, CardProduct, CardSectionProduct, Spinner } from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header, SearchBar, Icon, SideMenu, List, ListItem } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';

/**
 *  Import Common
 */

import { HeaderHome } from './../components/common';


class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showAlert: false,
            supplierList: '',
            loading: null,
            tokenUser: ''
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
        console.log('Logout Klik');
        AsyncStorage.getItem('loginCredential', (err, result) => {
            AsyncStorage.removeItem('loginCredential', () => {
                alert('Berhasil Logout!');
                console.log('Logout Klik Sukses');
            });
        });
    }


    static navigationOptions = {
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
                    style={{ flex: 1 }}
                    round
                    lightTheme
                    inputStyle={{ color: 'white' }}
                    placeholder='Type Here...' />
            </View>
        )
    }

    componentWillMount() {
        this.setState({ loading: true })
        AsyncStorage.getItem('loginCredential', (err, result) => {
            this.setState({ tokenUser: result });
            axios.get(`${BASE_URL}/suppliers/popular`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    console.log('SUKSES', response);
                    const res = response.data.data;
                    this.setState({ supplierList: res });
                    this.setState({ loading: false })
                })
                .catch(error => {
                    console.log('ERROR', error.message);
                });
        });
    }

    // renderSupplierPopuler = (item) => {
    //     return item.map((dataSupplier) => {
    //         return (
    //             <CardProduct style={styles.cardProductCard}>
    //                 <TouchableWithoutFeedback onPress={() => this.goSupplier()}>
    //                     <CardSectionProduct>
    //                         <Image
    //                             style={styles.productCardStyle}
    //                             source={require('./../assets/image/photo.png')}
    //                         />
    //                         <Text>{dataSupplier.name}</Text>
    //                     </CardSectionProduct>
    //                 </TouchableWithoutFeedback>
    //             </CardProduct>
    //         )
    //     })
    // }

    renderComponentSupplier() {
        if (this.state.loading == true) {
            return <Spinner size="small" />
        } else if (this.state.loading == false) {
            return this.state.supplierList.map((dataSupplier) => {
                return (
                    <CardProduct 
                        style={styles.cardProductCard} 
                        key={dataSupplier.id}
                    >
                        <CardSectionProduct>
                            <TouchableWithoutFeedback onPress={() => {
                                this.goSupplier()
                            }}>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/photo.png')}
                                />
                            </TouchableWithoutFeedback>
                            <Text style={{ marginLeft: 23, fontWeight: 'bold' }}>{dataSupplier.name}</Text>

                        </CardSectionProduct>
                    </CardProduct>
                )
            })
        }
    }

    goSupplier() {
        console.log('Profile Supplier');
        this.props.navigation.navigate('ProfileSuplier', { datas: this.state.supplierList });
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


    render() {
        const { navigate } = this.props.navigation;
        const { showAlert } = this.state;

        return (

            <View style={styles.container}>
                <ScrollView>
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
                    {this.renderButton()}

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>PRODUCT TERLARIS</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerProductCard}>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>
                    </View>

                    <View style={styles.containerProductCard}>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => {
                                    this.credentialProduct()
                                }}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>
                    </View>



                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>PEMASOK POPULER</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>


                    <View style={styles.containerProductCard}>
                        {this.renderComponentSupplier()}
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
    container: {
        flex: 1,
        paddingTop: 10,
        marginRight: 2
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
    }
}

export default HomePage;