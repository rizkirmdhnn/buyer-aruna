/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, View, ToastAndroid, TouchableNativeFeedback, ScrollView } from 'react-native';
import numeral from 'numeral';
// import { CheckBox } from 'react-native-elements';
import CheckBox from 'react-native-check-box'
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import {
    Button,
    ContainerSection,
    Spinner,
    Input,
    Card
} from '../components/common';
import { BASE_URL, COLOR } from './../shared/lb.config';

class FilterPage extends Component {
    static navigationOptions = {
        title: 'Filter',
        headerRight: <View />
    }

    constructor(props) {
        super(props)
        this.state = {
            screen: '',
            supplier: '',
            cityExpanded: true,
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
                ToastAndroid.show('Internet Bermasalah', ToastAndroid.SHORT);
                // if (error.response) {
                //     alert(error.response.data.message + 'DidMount Filter Page');
                // }
                // else {
                //     alert('Koneksi internet bermasalah Provinsi')
                // }
            })
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }

    provinsiCheck = datax => {
        const { provinsiId } = this.state;
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


    saveFilter = () => {
        const { provinsiId, maxPrice, dataFish } = this.state;
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
            maxPrice,
            cityExpanded,
            dataProvince,
            provinsiId
        } = this.state

        if (this.state.screen === 'Price') {
            return (
                <View style={{ flex: 1, marginLeft: 20, marginTop: 20, marginRight: 20 }}>
                    <ContainerSection>
                        <Input
                            label='Rentang Harga'
                            keyboardType="numeric"
                            placeholder='Max'
                            value={maxPrice ? numeral(parseInt(maxPrice, 0)).format('0,0') : ''}
                            onChangeText={v => this.onChangeInput('maxPrice', v.replace(/\./g, ''))}
                        />
                    </ContainerSection >
                    <View style={{ height: 50, marginTop: '80%' }}>
                        <ContainerSection>
                            <Button onPress={() => { this.saveFilter() }}>
                                Terapkan
                            </Button>
                        </ContainerSection>
                    </View>
                </View>
            );
        }

        return (

            <Card style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                <View style={styles.card}>
                    <ContainerSection>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontSize: 20 }}>Provinsi</Text>
                        </View>
                    </ContainerSection>
                    {
                        cityExpanded ?
                            <View style={{ height: 390 }}>
                                <ScrollView>
                                    {
                                        dataProvince.map((item, index) => {
                                            return (
                                                <ContainerSection key={index}>
                                                    <View style={{ flexDirection: 'column' }}>
                                                        <View >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                                <CheckBox
                                                                    rightText={item.name}
                                                                    onClick={() => this.provinsiCheck(item.id)}
                                                                    isChecked={provinsiId.includes(item.id)}
                                                                />
                                                                {/* <CheckBox
                                                                    title={item.name}
                                                                    onPress={() => this.provinsiCheck(item.id)}
                                                                    checked={provinsiId.includes(item.id)}
                                                                /> */}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </ContainerSection>
                                            );
                                        })
                                    }
                                </ScrollView>
                                <View style={{ marginTop: '2%' }}>
                                    <ContainerSection>
                                        <Button onPress={() => { this.saveFilter() }}>
                                            Terapkan
                                    </Button>
                                    </ContainerSection>
                                </View>
                            </View>
                            :
                            <View />
                    }
                </View>
            </Card>
        );
    }


    render() {
        const {
            loading
        } = this.state
        console.log(this.state.screen, 'SCREEN');
        return (
            <View style={{ flex: 4 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, borderColor: 'white', borderRightWidth: 0.3 }}>
                        <TouchableNativeFeedback onPress={() => this.setState({ screen: '' })}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    height: 50,
                                    justifyContent: 'center',
                                    borderBottomWidth: 2,
                                    borderBottomColor: this.state.screen === 'Price' ? 'white' : COLOR.secondary_a
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: 16
                                    }}
                                >Lokasi</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{ flex: 1, borderColor: 'white', borderRightWidth: 0.3 }}>
                        <TouchableNativeFeedback onPress={() => this.setState({ screen: 'Price' })}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    height: 50,
                                    justifyContent: 'center',
                                    borderBottomWidth: 2,
                                    borderBottomColor: this.state.screen === 'Price' ? COLOR.secondary_a : 'white'
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: 16
                                    }}
                                >Harga</Text>
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
}


const styles = {
    card: {
        borderTopWidth: 1,
        borderColor: '#eaeaea',
        padding: 5
    },
}

export default FilterPage;
