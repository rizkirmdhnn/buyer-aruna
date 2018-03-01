/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, Image, View, ListView, TouchableWithoutFeedback, TouchableNativeFeedback, ScrollView, FlatList, AsyncStorage } from 'react-native';
import {
    Button,
    CardSection,
    Container,
    ContainerSection,
    Spinner,
    CardSectionRegistration,
    Input,
    Card
} from '../components/common';
import numeral from 'numeral';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL, COLOR } from './../shared/lb.config';
import Modal from 'react-native-modal'
import { NavigationActions } from 'react-navigation';

class FilterPage extends Component {
    static navigationOptions = {
        title: 'Filter',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props)
        this.state = {
            screen: '',
            supplier: '',
            cityExpanded: null,
            dataProvince: '',
            provinsiId: [],
            loading: true,
            minPrice: '',
            maxPrice: '',
            dataFish: ''
        }
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        console.log(params, 'Data Ikan');
        this.setState({ dataFish: params });
        axios.get(`${BASE_URL}/provinces`)
            .then(response => {
                res = response.data.data;
                console.log(res, 'Data Provinsi')
                this.setState({ dataProvince: res, loading: false });
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error.response, 'error');
                alert('Koneksi internet bermasalah Provinsi')
                // if (error.response) {
                //     alert(error.response.data.message + 'DidMount Filter Page');
                // }
                // else {
                //     alert('Koneksi internet bermasalah Provinsi')
                // }
            })
    }

    provinsiCheck = datax => {
        const { provinsiId, tokenUser } = this.state;
        console.log(datax, 'ID PROVINSI')
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

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }

    saveFilter = () => {
        const { provinsiId, maxPrice, dataFish } = this.state;
        const { navigate } = this.props.navigation;
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate(
                    {
                        routeName: 'FilterBefore',
                        params:
                            { dataProvince: provinsiId, dataPrice: maxPrice, fishDatas: dataFish }
                    }
                )
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    renderScreen = () => {
        const {
            minPrice,
            maxPrice,
            cityExpanded,
            dataProvince,
            supplier,
            provinsiId
        } = this.state

        if (this.state.screen === 'Price') {
            return (
                <ContainerSection>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Input
                            keyboardType="numeric"
                            label='Rentang Harga'
                            placeholder='Min'
                            value={minPrice ? numeral(parseInt(minPrice)).format('0,0') : ''}
                            onChangeText={v => this.onChangeInput('minPrice', v.replace(/\./g, ''))}
                        />

                        <Input
                            keyboardType="numeric"
                            placeholder='Max'
                            value={maxPrice ? numeral(parseInt(maxPrice)).format('0,0') : ''}
                            onChangeText={v => this.onChangeInput('maxPrice', v.replace(/\./g, ''))}
                        />
                    </View>
                </ContainerSection >
            );
        }

        return (

            <Card style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                <View style={styles.card}>
                    <ContainerSection>
                        <TouchableWithoutFeedback onPress={() => { this.setState({ cityExpanded: !cityExpanded }); console.log(this.state.cityExpanded, 'Request Klik') }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>Kota / Kabupaten</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={cityExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ContainerSection>
                    {
                        cityExpanded ?
                            <View style={{ height: 500 }}>
                                <ScrollView>
                                    {
                                        dataProvince.map((item, index) => {
                                            return (
                                                <ContainerSection key={index}>
                                                    <View style={{ flexDirection: 'column' }}>
                                                        <View >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                                <CheckBox
                                                                    title={item.name}
                                                                    onPress={() => this.provinsiCheck(item.id)}
                                                                    checked={provinsiId.includes(item.id)}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </ContainerSection>
                                            );

                                        })
                                    }
                                </ScrollView>
                            </View>
                            :
                            <View />
                    }
                    <ContainerSection>
                        <Button
                            onPress={() => {
                                this.saveFilter()
                            }}>
                            Terapkan
                        </Button>
                    </ContainerSection>
                </View>
            </Card>
        );
    }


    render() {
        const {
            loading,
            minPrice,
            maxPrice,
            buttonExpanded,
            cityExpanded,
            dataProvince,
            supplier,
            screen
        } = this.state

        return (
            <View style={{ flex: 4 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, borderColor: '#3484d7', borderRightWidth: 0.3 }}>
                        <TouchableNativeFeedback onPress={() => this.setState({ screen: '' })}>
                            <View style={{
                                backgroundColor: COLOR.element_a3,
                                height: 50,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: '#67a6e3',
                                    textAlign: 'center',
                                    fontSize: 16
                                }}>Lokasi</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{ flex: 1, borderColor: '#3484d7', borderRightWidth: 0.3 }}>
                        <TouchableNativeFeedback onPress={() => this.setState({ screen: 'Price' })}>
                            <View style={{
                                backgroundColor: COLOR.element_a3,
                                height: 50,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: '#67a6e3',
                                    textAlign: 'center',
                                    fontSize: 16
                                }}>Harga</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                {
                    loading ?
                        <View style={{ marginTop: '70%' }}>
                            <Spinner size="large" />
                        </View>
                        :
                        <View style={{ flex: 4 }}>
                            {this.renderScreen()}
                        </View>
                }
            </View>
        );
    }
};


const styles = {
    card: {
        borderTopWidth: 1,
        borderColor: '#eaeaea',
        padding: 5
    },
}

export default FilterPage;
