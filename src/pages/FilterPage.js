/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, Image, View, TouchableWithoutFeedback, ScrollView, FlatList, AsyncStorage } from 'react-native';
import {
    Button,
    CardSection,
    Container,
    ContainerSection,
    Spinner,
    CardSectionRegistration,
    InputRegistration
} from '../components/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';
import { Card } from 'react-native-elements';
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
            isModalVisible: false,
            provinsiContainer: false,
            dataProvince: '',
            dataParsing: '',
            provinsiId: [],
            loading: true,
            tokenUser: '',
            dataSupplier: '',
            minPrice: '0',
            maxPrice: '0'
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            const token = result;
            axios.get(`${BASE_URL}/provinces`, {
                headers: {
                    'token': result
                }
            })
                .then(response => {
                    console.log(response.data.data, 'Data Provinsi');
                    res = response.data.data;
                    this.setState({ dataProvince: res });
                })
                .catch(error => {
                    console.log(error.response, 'error');
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Provinsi')
                    }
                })
        });
    }

    componentWillMount() {
        this.setState({ dataParsing: this.props.navigation.state.params.datas });
        const nameFish = this.props.navigation.state.params.datas.name;
        axios.get(`${BASE_URL}/products?key=${nameFish}`)
            .then(response => {
                console.log(response.data.data, 'Data Supplier');
                res = response.data.data;
                this.setState({ dataSupplier: res, loading: false });
                console.log(this.state.dataParsing, 'Data Parsing')
            })
            .catch(error => {
                console.log(error.response, 'error');
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah Provinsi')
                }
            })
    }

    renderDataSupplier = (item) => {
        return item.map((data, index) => {
            return (
                <Card
                    key={data.id}
                >
                    <View style={styles.itemContainerStyle}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyles}
                                source={{ uri: `${BASE_URL}/images/${data.Fish.photo}` }}
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{data.Fish.name}</Text>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text>{data.User.name}</Text>
                            </View>
                        </View>
                    </View>
                </Card>
            )
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
        const { navigate } = this.props.navigation;
        const { minPrice, maxPrice, tokenUser, provinsiId, dataParsing } = this.state;
        axios.get(`${BASE_URL}/products?key=${dataParsing.name}&minPrice=/${minPrice}&maxPrice=${maxPrice}&ProvinceIds=${provinsiId}&page=0&pageSize=4&sorting=desc`, {
            headers: { 'x-access-token': tokenUser }
        })
            .then(response => {
                res = response.data.data;
                this.props.navigation.navigate('ListSearchProduct', { datas: res });
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah Provinsi')
                }
            })
    }

    renderItemProvince = (item) => {

        return item.map((datax, index) => {
            console.log(datax, 'HAHAHHAHAHAHAHA');
            <View style={{ height: 55 }}>
                <CheckBox
                    title={datax.name}
                    checked={this.state.provinsiId.includes(datax.id)}
                    onPress={() => this.provinsiCheck(datax)}
                />
            </View>
        });
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    render() {
        const {
            provinsiContainer,
            cityContainer,
            loading,
            minPrice,
            maxPrice
        } = this.state
        if (loading) {
            return <Spinner size="large" />
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 55 }}>
                    <Button
                        onPress={() => this._toggleModal()}>
                        Filter
                    </Button>
                </View>
                <ScrollView>
                    <View>
                        <FlatList
                            data={[this.state.dataSupplier]}
                            renderItem={({ item }) => this.renderDataSupplier(item)}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                </ScrollView>

                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={() => this.setState({ isModalVisible: false })}
                >
                    <View style={{ backgroundColor: 'white' }}>
                        <View>
                            <Card>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.setState({ provinsiContainer: !provinsiContainer });
                                        console.log(provinsiContainer, 'Request Klik')
                                    }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 20 }}>Kota / Provinsi</Text>
                                        <View style={{ flex: 1 }}>
                                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={provinsiContainer ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                {
                                    provinsiContainer ?
                                        <View style={{ height: 55 }}>
                                            <FlatList
                                                data={[this.state.dataProvince]}
                                                renderItem={({ item }) => this.renderItemProvince(item)}
                                            />
                                        </View>
                                        :
                                        <View />
                                }
                            </Card>
                        </View>

                        <View style={{ height: 55 }}>
                            <Button
                                onPress={() => {
                                    this.filterApi()
                                }}>
                                Terapkan
                            </Button>
                        </View>
                    </View>
                </Modal>
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
