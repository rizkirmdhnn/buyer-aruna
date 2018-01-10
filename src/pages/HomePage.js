/**
 *  Import Component
 */
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableHighlight } from 'react-native';
import { Button, CardProduct, CardSectionProduct } from './../components/common';


/**
 *  Import Common
 */

import { HeaderHome } from './../components/common';


class HomePage extends Component {

    static navigationOptions = {
        title: 'Home',
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <ScrollView>
                <View style={styles.container}>
                    {/* <RouteTab /> */}
                    <HeaderHome />
                    <Image
                        style={styles.imageStyle}
                        source={require('./../assets/image/fish_1.jpg')}
                    />

                    <Button
                        onPress={() => navigate('RequestFormOrder')}>
                        Requests Now!
                    </Button>

                    <View style={styles.containerTextProductCard}>
                        <Text style={styles.textCard}>PRODUCT TERLARIS</Text>
                        <Text style={styles.textCardLink}>Lihat Semua</Text>
                    </View>

                    <View style={styles.containerProductCard}>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
                            </CardSectionProduct>
                        </CardProduct>
                    </View>

                    <View style={styles.containerProductCard}>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
                            </CardSectionProduct>
                        </CardProduct>

                        <CardProduct style={styles.cardProductCard}>
                            <CardSectionProduct>
                                <Image
                                    style={styles.productCardStyle}
                                    source={require('./../assets/image/fish_2.jpg')}
                                />
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
                </View>
            </ScrollView>
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
        color: 'blue',
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