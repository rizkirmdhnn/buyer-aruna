import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Picker,
    KeyboardAvoidingView,
    Keyboard,
    TextInput,
    AsyncStorage,
    TouchableWithoutFeedback,
    Image,
    Input
} from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container
} from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import AutoComplete from '../components/AutoComplete';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';

class RequestFormOrderFirstPage extends Component {

    static navigationOptions = {
        title: 'Create Request Order',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }



    constructor(props) {
        super(props);
        this.state = {
            suggestions: '1',
            countryId: '1',
            provinsiId: '1',
            cityId: '1',
            size: '',
            deskripsi: '',

            quantity: '',
            minBudget: '',
            maxBudget: ''
        };
    };

    onSubmit = () => {
        Keyboard.dismiss();
        const data = this.state;

        this.props.navigation.navigate('RequestFormOrderSecond', { datas: data })
    }


    renderButton = () => {
        if (this.state.loading) {
            return <Spinner size='large' />
        }

        return (
            <Button
                onPress={
                    () => Alert.alert(
                        '',
                        'Yakin sudah mengisi informasi dengan benar?',
                        [
                            { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Ya', onPress: () => this.onSubmit() },
                        ]
                    )
                }
            >
                Next
			</Button>
        )
    }


    querySuggestion = (text) => {
        console.log(text, 'Text');
        AsyncStorage.getItem('loginCredential', (err, result) => {
            console.log(result, 'Token');

            axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
                headers: { 'x-access-token': result }
            })
                .then(response => {
                    res = response.data.data
                    const result = res
                    console.log(result);
                    this.setState({ suggestions: result })
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah')
                    }
                })

        });
    }



    render() {
        const {
            suggestions,
            countryId,
            provinsiId,
            cityId,
            size,
            quantity,
            minBudget,
            maxBudget,
            deskripsi,
        } = this.state

        return (

            <ScrollView
                keyboardShouldPersistTaps="always"
            >
                <Container>

                    <CardSectionRegistration>
                        <TouchableWithoutFeedback>
                            <View style={{ flex: 1, padding: 8 }}>
                                <Image
                                    style={{ width: '100%' }}
                                    source={require('./../assets/image/upload-foto.png')}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <Text style={styles.headerStyle}>
                            INFORMASI KOMODITAS
							</Text>
                    </CardSectionRegistration>
                    <CardSectionRegistration>
                        <AutoComplete
                            label="Nama Komoditas"
                            suggestions={suggestions}
                            onChangeText={text => this.querySuggestion(text)}
                        />
                    </CardSectionRegistration>
                    <CardSectionRegistration>
                        <InputRegistration
                            label='Ukuran Komoditas'
                            placeholder='Ukuran'
                            value={size}
                            onChangeText={v => this.onChangeInput('size', v)}
                        />
                        <Text style={styles.unitStyle}> kg/pcs</Text>

                        <InputRegistration
                            label='Kuantitas Komoditas'
                            placeholder='Jumlah'
                            value={quantity}
                            onChangeText={v => this.onChangeInput('quantity', v)}
                        />
                        <Text style={styles.unitStyle}> kg</Text>

                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <InputRegistration
                            placeholder='Deskripsi Komoditas'
                            value={deskripsi}
                            style={styles.textArea}
                            onChangeText={v => this.onChangeInput('deskripsi', v)}
                        />
                    </CardSectionRegistration>

                    <View>
                        <Text style={styles.unitStyle}>Rentang Harga/kg</Text>
                    </View>

                    <CardSectionRegistration>
                        <InputRegistration
                            placeholder='Min'
                            value={minBudget}
                            onChangeText={v => this.onChangeInput('minBudget', v)}
                        />
                        <Text style={styles.unitStyles}>-</Text>

                        <InputRegistration
                            placeholder='Max'
                            value={maxBudget}
                            onChangeText={v => this.onChangeInput('maxBudget', v)}
                        />

                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <Text style={styles.headerStyle}>
                            TUJUAN PENGIRIMAN
							</Text>
                    </CardSectionRegistration>

                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Negara</Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={countryId}
                                    onValueChange={v => this.onChangeInput('countryId', v)}
                                >
                                    <Picker.Item label="Indonesia" value="1" />
                                    <Picker.Item label="Singapura" value="2" />
                                </Picker>
                            </View>
                        </View>
                    </ContainerSection>

                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Provinsi</Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={provinsiId}
                                    onValueChange={v => this.onChangeInput('provinsiId', v)}
                                >
                                    <Picker.Item label="DKI Jakarta" value="1" />
                                    <Picker.Item label="Banten" value="2" />
                                </Picker>
                            </View>
                        </View>
                    </ContainerSection>

                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={cityId}
                                    onValueChange={v => this.onChangeInput('cityId', v)}
                                >
                                    <Picker.Item label="Jakarta" value="1" />
                                    <Picker.Item label="Tangerang" value="2" />
                                </Picker>
                            </View>
                        </View>
                    </ContainerSection>

                </Container>

                <ContainerSection>
                    {this.renderButton()}
                </ContainerSection>

            </ScrollView>
        );
    }
};


const styles = {
    headerStyle: {
        marginLeft: 5
    },
    pickerTextStyle: {
        color: '#8e8e8e',
        flex: 1,
        paddingLeft: 5
    },
    pickerContainer: {
        flex: 1,
        height: 65,
        marginBottom: 5
    },
    pickerTextStyle: {
        color: '#8e8e8e',
        paddingLeft: 5,
        fontSize: 16
    },
    pickerStyle: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#716c6c',
        marginRight: 3,
        marginLeft: 3,
    },
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: "stretch",
        justifyContent: "center"
    },
    thumb: {
        width: 30,
        height: 30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    unitStyle: {
        marginTop: 30,
        paddingRight: 30
    },
    unitStyles: {
        marginTop: 30,
        paddingRight: 30,
        paddingLeft: 30
    },
    textArea: {
        height: 50,
        borderLine: 1
    }
}

export default RequestFormOrderFirstPage;