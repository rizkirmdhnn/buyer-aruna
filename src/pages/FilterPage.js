/**
 *  Import Component
 */
import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { Card, Button, CardSection, Container, ContainerSection, Spinner } from '../components/common';
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
            provinsiContainer: false,
            cityContainer: false,
            provinsiId: [],
            cityId: [],
            dataPush: [],
            loading: null,
            tokenUser: '',
            dataProvinsi: '',
            dataCity: ''
        }
    }

    componentWillMount() {
        this.setState({ loading: true });
        AsyncStorage.getItem('loginCredential', (err, resultToken) => {
            this.setState({ tokenUser: resultToken });
            axios.get(`${BASE_URL}/provinces`, {
                headers: { 'x-access-token': resultToken }
            })
                .then(response => {
                    res = response.data.data;
                    this.setState({ dataProvinsi: res, loading: false });
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Provinsi')
                    }
                })
        });
    }

    renderFlatProvinsi = () => {
        return (
            <View>
                <FlatList
                    data={[this.state.dataProvinsi]}
                    renderItem={({ item }) => this.renderDataProvinsi(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }

    renderFlatCity = () => {
        return (
            <View>
                <FlatList
                    data={[this.state.dataCity]}
                    renderItem={({ item }) => this.renderDataCity(item)}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
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
                            checked={this.state.provinsiId.includes(data)}
                        />
                    </View>
                </View>
            )
        })
    }

    renderDataCity = (item) => {
        console.log(item, 'Item City');

        if (item === '') {
            return (
                <View>
                    <Text>Pilih Provinsi Terlebih Dahulu</Text>
                </View>
            )
        } else {
            return item.map((data, index) => {
                console.log(data, 'City Data');
                return (
                    <View key={data.id} style={styles.itemContainerStyle}>
                        <View style={styles.headerContentStyle}>
                            <CheckBox
                                title={data.name}
                                onPress={() => this.cityCheck(data)}
                                checked={this.state.provinsiId.includes(data)}
                            />
                        </View>
                    </View>
                )
            })
        }
    }

    provinsiCheck = data => {
        const { provinsiId, tokenUser } = this.state;
        console.log(data, 'Data');
        const idProvinsi = data.id;
        if (!provinsiId.includes(data)) {
            this.setState({
                provinsiId: [...provinsiId, data]
            });

            axios.get(`${BASE_URL}/cities/search-province/${idProvinsi}`, {
                headers: { 'x-access-token': tokenUser }
            })
                .then(response => {
                    res = response.data.data
                    this.setState({ dataCity: res, loading: false });
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Provinsi')
                    }
                })

        } else {
            this.setState({
                provinsiId: provinsiId.filter(a => a !== data)
            });
        }
    };

    cityCheck = data => {
        const { cityId } = this.state;
        if (!cityId.includes(data)) {
            this.setState({
                cityId: [...cityId, data]
            });
        } else {
            this.setState({
                cityId: cityId.filter(a => a !== data)
            });
        }
    };

    render() {
        const {
            provinsiContainer,
            cityContainer
        } = this.state
        return (
            <ScrollView style={{ flex: 1 }}>
                <Card style={{ flex: 1, margin: 5, padding: 5 }}>
                    <Text style={styles.hedaerTextStyle}>Pilih Area Lokasi :</Text>
                    <CardSection>
                        <TouchableWithoutFeedback onPress={() => { this.setState({ provinsiContainer: !provinsiContainer }); console.log(this.state.provinsiContainer, 'Request Klik') }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>Provinsi</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={provinsiContainer ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </CardSection>
                    {
                        provinsiContainer ?
                            <CardSection>
                                <View>
                                    {this.renderFlatProvinsi()}
                                </View>
                            </CardSection>
                            :
                            <View />
                    }

                    <CardSection>
                        <TouchableWithoutFeedback onPress={() => { this.setState({ cityContainer: !cityContainer }); console.log(this.state.cityContainer, 'Request Klik') }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>Kota / Kabupaten</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={cityContainer ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </CardSection>
                    {
                        cityContainer ?
                            <CardSection>
                                <View>
                                    {this.renderFlatCity()}
                                </View>
                            </CardSection>
                            :
                            <View />
                    }
                </Card>
            </ScrollView>
        );
    }
};


const styles = {

}

export default FilterPage;
