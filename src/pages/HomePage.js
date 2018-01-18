/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableHighlight, AsyncStorage } from 'react-native';
import { Button, CardProduct, CardSectionProduct } from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header, SearchBar, Icon, SideMenu, List, ListItem } from 'react-native-elements';
import axios from 'axios';

/**
 *  Import Common
 */

import { HeaderHome } from './../components/common';


class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showAlert: false
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
        AsyncStorage.getItem('loginCredential', (err, result) => {
            AsyncStorage.removeItem('loginCredential', () => {
                alert('Berhasil Logout!');
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
                    <Button
                        onPress={() => this.isLogout()}>
                        Logout
                    </Button>

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

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
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
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <TouchableHighlight onPress={() => navigate('ProfileSupplier')}>
                                    <Image
                                        style={styles.productCardStyle}
                                        source={require('./../assets/image/fish_2.jpg')}
                                    />
                                </TouchableHighlight>
                            </CardSectionProduct>
                        </CardProduct>
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
                        navigate('Login');
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