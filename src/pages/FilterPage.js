/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, Image, View, ListView, TouchableWithoutFeedback, ScrollView, FlatList, AsyncStorage } from 'react-native';
import {
    Button,
    CardSection,
    Container,
    ContainerSection,
    Spinner,
    CardSectionRegistration,
    InputRegistration,
    Card
} from '../components/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import Modal from 'react-native-modal'

class FilterPage extends Component {
    static navigationOptions = {
        title: 'Filter',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props)
        this.state = {
            provinsiContainer: true,
            dataProvince: '',
            provinsiId: [],
            loading: true,
            minPrice: '0',
            maxPrice: '0',
        }
    }

    componentWillMount() {
        axios.get(`${BASE_URL}/provinces`)
            .then(response => {
                res = response.data.data;
                console.log(res, 'Data Provinsi')
                this.setState({ dataProvince: res, loading: false });
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error.response, 'error');
                if (error.response) {
                    alert(error.response.data.message + 'DidMount Filter Page');
                }
                else {
                    alert('Koneksi internet bermasalah Provinsi')
                }
            })
    }

    provinsiCheck = datax => {
        const { provinsiId, tokenUser } = this.state;
        const idProvinsi = datax.id;
        console.log(idProvinsi, 'ID PROVINSI')
        if (!provinsiId.includes(datax)) {
            this.setState({
                provinsiId: [...provinsiId, datax]
            });
        } else {
            this.setState({
                provinsiId: provinsiId.filter(a => a !== datax)
            });
        }
    };

    onSubmit = () => {
        console.log('Submit Filter');
    }



    render() {
        const {
            loading,
            minPrice,
            maxPrice,
            buttonExpanded,
            provinsiContainer
        } = this.state

        return (
            <View>
                {
                    loading ?
                        <View style={{ marginTop: '70%' }}>
                            <Spinner size="large" />
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20 }}>Kota / Provinsi</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={provinsiContainer ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </View>
                }
            </View>
        );
    }
};


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

export default FilterPage;
