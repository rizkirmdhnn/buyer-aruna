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
            screen: '',
            checkedSupplier: [],
            searchItem: [],
            searchItemAll: [],
            dataItemSearch: '',
            viewExpanded: true,
            searchResult: null,
            searchResultAll: null,
            loading: false
        }
    }

    querySuggestion(text) {
        console.log(text, 'Text');
        if (text == '') {
            console.log('Text Kosong');
            this.setState({ viewExpanded: true, searchResult: false, searchResultAll: false });
        } else {
            console.log('Text Tidak Kosong');
            this.setState({ searchResult: true, searchResultAll: false, viewExpanded: false, loading: true });
            axios.get(`${BASE_URL}/fishes/search?key=${text}`)
                .then(response => {
                    res = response.data.data
                    this.setState({ searchItem: res, loading: false })
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
    }

    componentWillMount() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            if (result) {

            }
        })
    }

    onItemSelected = (item) => {
        console.log(item, 'Ikan terpilih');
        this.setState({ searchResultAll: true, searchResult: false, loading: true })
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
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
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

    renderScreen = () => {
        if (this.state.screen === 'FilterPage') {
            return <FilterPage navi={this.props.navigation} />
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const {
            requestExpanded,
            searchItem,
            searchItemAll,
            loading,
            screen,
            menuLoginExpanded,
            viewExpanded,
            searchResult,
            searchResultAll
        } = this.state;

        const { tabContainer, tabContainerActive, tabText, tabTextActive } = styles;

        console.log(this.state.checkedSupplier, 'Supplier Check');
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
                        loading ?
                            <View style={{ marginTop: '70%' }}>
                                <Spinner size="large" />
                            </View>
                            :
                            <View />
                    }
                    {
                        searchResult ?
                            <View>
                                <ScrollView>
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
                                <View style={{ marginTop: '35%' }}>
                                    <Text style={{ textAlign: 'center' }}>Cari Komoditas Unggulan</Text>
                                    <Text style={{ textAlign: 'center' }}>Hanya di Marketplace Aruna</Text>
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
                                        {/* <TouchableNativeFeedback onPress={() => this.setState({ screen: 'FilterPage' })}> */}
                                            <View style={screen === 'FilterPage' ? tabContainerActive : tabContainer}>
                                                <Text style={screen === 'FilterPage' ? tabTextActive : tabText}>Filter</Text>
                                            </View>
                                        {/* </TouchableNativeFeedback> */}
                                    </View>
                                    {this.renderScreen()}
                                </View>
                                <ScrollView>
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