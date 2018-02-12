/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, ScrollView, FlatList, AsyncStorage } from 'react-native';
import {
    Card,
    Button,
    CardSection,
    Container,
    ContainerSection,
    Spinner,
    CardSectionRegistration,
    InputRegistration
} from '../components/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox, FormInput, Rating } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from './../shared/lb.config';

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
            dataParsing: '',
            provinsiId: [],
            loading: null,
            tokenUser: '',
            dataProvinsi: '',
            minPrice: '0',
            maxPrice: '0'
        }
    }

    componentWillMount() {
        this.setState({ loading: true });
        this.setState({ dataParsing: this.props.navigation.state.params.datas })
        AsyncStorage.getItem('loginCredential', (err, resultToken) => {
            this.setState({ tokenUser: resultToken });
            axios.get(`${BASE_URL}/provinces`)
                .then(response => {
                    res = response.data.data;
                    this.setState({ dataProvinsi: res, loading: false });
                    console.log(this.state.dataParsing, 'Data Parsing')
                })
                .catch(error => {
                    console.log(error, 'error');
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Provinsi')
                    }
                })
        });
    }

    renderDataProvinsi = (item) => {
        console.log(this.state.provinsiId, 'ID Provinsi');
        return item.map((data, index) => {
            console.log(data, 'Provinsi Data');
            return (
                <View key={data.id} style={styles.itemContainerStyle}>
                    <View style={styles.headerContentStyle}>
                        <CheckBox
                            title={data.name}
                            onPress={() => this.provinsiCheck(data)}
                            checked={this.state.provinsiId.includes(data.id)}
                        />
                    </View>
                </View>
            )
        })
    }

    provinsiCheck = data => {
        const { provinsiId, tokenUser } = this.state;
        console.log(data, 'Data');
        const idProvinsi = data.id;
        if (!provinsiId.includes(idProvinsi)) {
            this.setState({
                provinsiId: [...provinsiId, idProvinsi]
            });
        } else {
            this.setState({
                provinsiId: provinsiId.filter(a => a !== idProvinsi)
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

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
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
            <ScrollView style={{ flex: 1 }}>
                <Card style={{ flex: 1, margin: 5, padding: 5 }}>
                    <Text style={styles.hedaerTextStyle}>Pilih Area Lokasi :</Text>
                    <CardSection>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontSize: 20 }}>Provinsi</Text>
                        </View>
                    </CardSection>
                    {
                        provinsiContainer ?
                            <CardSection>
                                <View>
                                    <FlatList
                                        data={[this.state.dataProvinsi]}
                                        renderItem={({ item }) => this.renderDataProvinsi(item)}
                                        keyExtractor={(item, index) => index}
                                    />
                                </View>
                            </CardSection>
                            :
                            <View />
                    }

                    <Text style={styles.hedaerTextStyle}>Rentang Harga/Kg :</Text>
                    <CardSection>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontSize: 20 }}>Harga</Text>
                        </View>
                    </CardSection>
                    {
                        provinsiContainer ?
                            <CardSectionRegistration>
                                <InputRegistration
                                    label='Harga Min'
                                    value={minPrice}
                                    onChangeText={v => this.onChangeInput('minPrice', v)}
                                />
                                <Text style={styles.unitStyle}> - </Text>

                                <InputRegistration
                                    label='Harga Maks'
                                    value={maxPrice}
                                    onChangeText={v => this.onChangeInput('maxPrice', v)}
                                />
                            </CardSectionRegistration>
                            :
                            <View />
                    }

                    <View>
                        <Button
                            onPress={
                                () => this.onSubmit()
                            }
                        >
                            Terapkan
                        </Button>
                    </View>
                </Card>
            </ScrollView>
        );
    }
};


const styles = {

}

export default FilterPage;
