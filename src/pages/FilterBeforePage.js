/**
 *  Import Component
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    FlatList,
    TouchableNativeFeedback
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import { COLOR } from './../shared/lb.config';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, CardSection, Container, ContainerSection, Spinner, Input, InputSearch } from '../components/common'
import { NavigationActions } from 'react-navigation';
import { Card, CheckBox } from 'react-native-elements';

import FilterPage from './FilterPage';

class FilterBeforePage extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            checkedSupplier: [],
            searchItem: [],
            searchItemAll: [],
            dataItemSearch: '',
            viewExpanded: true,
            searchResult: null,
            searchResultAll: null,
            loading: false,
            load: false,
            dataParams: '',
            fishData: '',
            idProvince: []
        }
    }

    componentWillMount() {
        const params = this.props.navigation.state.params;
        this.setState({ dataParams: params });
        console.log(params, 'Data Params');
        if (params) {
            this.updateSelected(params)
        }
    }

    onItemSelected = (item) => {
        console.log('On Item Selected');
        console.log(item, 'Ikan terpilih');
        const { fishData } = this.state;
        this.setState({ searchResultAll: true, fishData: item, searchResult: false, loading: true })
        axios.get(`${BASE_URL}/products`, {
            params: {
                key: item.name,
                sorting: 'ASC'
            }
        })
            .then(response => {
                res = response.data.data
                this.setState({ searchItemAll: res, loading: false })
                console.log(res, 'Semua Ikan')
            })
            .catch(error => {
                console.log(error, 'Error');
                this.setState({ loading: false })
                alert('Koneksi internet bermasalah on item selected')
                // if (error.response) {
                //     alert(error.response.data.message)
                // }
                // else {
                //     alert('Koneksi internet bermasalah on item selected')
                // }
            })
    }

    querySuggestion(text) {
        console.log(text, 'Text');
        if (text !== '') {
            console.log('Text Tidak Kosong');
            this.setState({ searchResult: true, searchResultAll: false, viewExpanded: false, load: true });
            axios.get(`${BASE_URL}/fishes/search?key=${text}`)
                .then(response => {
                    res = response.data.data
                    this.setState({ searchItem: res, load: false })
                    console.log(res, 'Auto Complete Nya')
                })
                .catch(error => {
                    console.log(error, 'Error');
                    this.setState({ load: false })
                    alert('Error Fishes Key')
                    // if (error.response) {
                    //     alert('Internet anda lemot Fishes.')
                    // }
                    // else {
                    //     alert('Internet anda lemot Fishes Key')
                    // }
                })
        } else {
            console.log('Text Kosong');
            this.setState({ viewExpanded: true, searchResult: false, searchResultAll: false });
        }
    }

    
    updateSelected = (item) => {
        console.log(item, 'Data Params');
        console.log(item.dataProvince, 'Data Provinsi');

        item.dataProvince.map((item, index) => {
            this.state.idProvince.push(item.id)
        })


        const dataProvinceId = {
            'ProvinceIds': this.state.idProvince
        }

        this.setState({ searchResultAll: true, searchResult: false, viewExpanded: false, loading: true })
        axios.get(`${BASE_URL}/products`, {
            params: {
                key: item.fishDatas.datas.name,
                sorting: 'ASC',
                dataProvinceId,
                maxPrice: item.dataPrice
            }
        })
            .then(response => {
                res = response.data.data
                this.setState({ searchItemAll: res, loading: false })
                console.log(res, 'Semua Ikan Update')
            })
            .catch(error => {
                console.log(error, 'Error');
                this.setState({ loading: false })
                alert('Koneksi internet bermasalah province')
                // if (error.response) {
                //     alert(error.response.data.message)
                // }
                // else {
                //     alert('Koneksi internet bermasalah province')
                // }
            })
    }


    checkItem = data => {
        const { checkedSupplier } = this.state;
        if (!checkedSupplier.includes(data)) {
            this.setState({
                checkedSupplier: [...checkedSupplier, data]
            });
        } else {
            this.setState({
                checkedSupplier: checkedSupplier.filter(a => a !== data)
            });
        }
    };

    render() {
        const { navigate } = this.props.navigation;
        const {
            requestExpanded,
            searchItem,
            searchItemAll,
            loading,
            load,
            menuLoginExpanded,
            viewExpanded,
            searchResult,
            searchResultAll,
            fishData,
            dataParams,
            checkedSupplier
        } = this.state;

        const { tabContainer, tabContainerActive, tabText, tabTextActive } = styles;

        console.log(checkedSupplier, 'Supplier Check');
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <TouchableOpacity onPress={() => {
                            const { navigate } = this.props.navigation;
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'Home' })
                                ]
                            })
                            this.props.navigation.dispatch(resetAction)
                        }}>
                            <Icon size={24} name="md-arrow-back" color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerText}>
                        <InputSearch
                            onChangeText={(text) => {
                                this.querySuggestion(text);
                            }}
                            placeholder="Cari Komoditas..."
                            icon="ic_search"
                        />
                    </View>
                </View>

                <View>
                    {
                        searchResult ?
                            <View>
                                <ScrollView>
                                    {
                                        load ?
                                            <View style={{ marginTop: '70%' }}>
                                                <Spinner size="large" />
                                            </View>
                                            :
                                            <View />
                                    }
                                    {
                                        searchItem && searchItem.map((item, index) =>
                                            <View key={index}>
                                                <Card>
                                                    <TouchableOpacity
                                                        key={item.id}
                                                        onPress={() => this.onItemSelected(item)}
                                                    >
                                                        <View style={styles.itemContainerStyle}>
                                                            <View style={styles.thumbnailContainerStyle}>
                                                                <Image
                                                                    style={styles.thumbnailStyle}
                                                                    source={{ uri: `${BASE_URL}/images/${item.photo}` }}
                                                                />
                                                            </View>
                                                            <View style={styles.headerContentStyle}>
                                                                <Text style={styles.headerTextStyle}>{item.name}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Card>
                                            </View>
                                        )
                                    }
                                </ScrollView>
                            </View>
                            :
                            <View />
                    }
                    {
                        viewExpanded ?
                            <View>
                                <View style={{ flex: 1, marginTop: '50%' }}>
                                    <Image
                                        style={{ alignSelf: 'center' }}
                                        source={require('./../assets/images/ga_search.png')}
                                    />
                                </View>
                                <View style={{ marginTop: '40%' }}>
                                    <Text style={{ textAlign: 'center', marginTop: '3%' }}>Cari Komoditas Unggulan</Text>
                                    <Text style={{ textAlign: 'center', marginTop: '3%' }}>Hanya di Marketplace Aruna</Text>
                                </View>
                            </View>
                            :
                            <View />
                    }
                    {
                        searchResultAll ?
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableNativeFeedback onPress={() => {
                                            console.log(fishData, 'Data Ikan Before Filter');
                                            this.props.navigation.navigate('Filter', { datas: fishData })
                                            console.log('Filter Page');
                                        }}>
                                            <View style={tabContainer}>
                                                <Text style={tabText}>Filter</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        checkedSupplier.length > 0 ?
                                            <View style={{ flex: 1 }}>
                                                <TouchableNativeFeedback onPress={() => {

                                                    const { navigate } = this.props.navigation;
                                                    const resetAction = NavigationActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate(
                                                                {
                                                                    routeName: 'RequestFormOrderFirst',
                                                                    params:
                                                                        { dataFish: fishData, dataSearch: dataParams, dataSupplier: this.state.checkedSupplier }
                                                                }
                                                            )
                                                        ]
                                                    })
                                                    this.props.navigation.dispatch(resetAction)
                                                }}>
                                                    <View style={tabContainer}>
                                                        <Text style={tabText}>Buat Permintaan Sekarang</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>
                                            :
                                            <View />
                                    }
                                </View>
                                <ScrollView>
                                    {
                                        loading ?
                                            <View style={{ marginTop: '70%' }}>
                                                <Spinner size="large" />
                                            </View>
                                            :
                                            <View />
                                    }
                                    {
                                        searchItemAll && searchItemAll.map((item, index) => {
                                            return (
                                                <View key={index}>
                                                    <Card>
                                                        <View style={styles.itemContainerStyle}>
                                                            <View style={styles.thumbnailContainerStyle}>
                                                                <Image
                                                                    style={styles.thumbnailStyle}
                                                                    source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
                                                                />
                                                            </View>
                                                            <View style={styles.headerContentStyle}>
                                                                <Text style={styles.headerTextStyle}>{item.Fish.name}</Text>
                                                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                                                    <Text>{item.User.name}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <CheckBox
                                                                    containerStyle={{
                                                                        borderWidth: 0,
                                                                        padding: 0,
                                                                        margin: 0,
                                                                        marginTop: 10,
                                                                        width: 25
                                                                    }}
                                                                    onPress={() => this.checkItem(item)}
                                                                    checked={this.state.checkedSupplier.includes(item)}
                                                                />
                                                            </View>
                                                        </View>
                                                    </Card>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                                {/* <Button
                                    onPress={() => {
                                        this.saveFilter()
                                    }}>
                                    Terapkan
                                    </Button> */}
                            </View>
                            :
                            <View />
                    }
                </View>
            </View>
        );
    }
};


const styles = {
    container: {
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
        elevation: 4
    },
    headerText: {
        flex: 1,
        marginTop: 12,
        marginBottom: 12,
        marginRight: 15
    },
    itemContainerStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    thumbnailStyle: {
        height: 100,
        width: 100,
        borderWidth: 1
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginBottom: 10,
        marginTop: 15,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    headerTextStyle: {
        fontSize: 15,
        color: 'blue',
        fontFamily: 'Muli-Bold'
    },
    tabContainerActive: {
        backgroundColor: COLOR.element_a4,
        height: 50,
        justifyContent: 'center'
    },
    tabContainer: {
        backgroundColor: COLOR.element_a3,
        height: 50,
        justifyContent: 'center'
    },
    tabText: {
        color: '#67a6e3',
        textAlign: 'center',
        fontSize: 16
    },
    tabTextActive: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    }
}

export default FilterBeforePage;