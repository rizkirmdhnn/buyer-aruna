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
    PixelRatio,
    AsyncStorage,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Input
} from 'react-native';
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import AwesomeAlert from 'react-native-awesome-alerts';
import AutoComplete from '../components/AutoComplete';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CheckBox } from 'react-native-elements'

import ImagePicker from 'react-native-image-picker';

class FormContractPage extends Component {

    static navigationOptions = {
        title: 'Buat Kontrak',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataMaster: '',
            load: null,
            loading: null,
            dataMapCity: '',
            dataCity: '',
            dataProvinsi: '',
            suggestions: [],
            value: '',
            FishId: '',

            provinsiId: '',
            cityId: '',
            size: '',
            deskripsi: '',

            quantity: '',
            minBudget: '',
            maxBudget: '',
            datePick: '',
            dateNowPick: '',
            photo: null,
        };
    };


    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }


    state = {
        isDateTimePickerVisible: false,
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        console.log(date, 'Date Nya')
        const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
        const dateNow = moment(date).format('DD/MM/YYYY');
        this.setState({ datePick: dateTemp, dateNowPick: dateNow })
        this._hideDateTimePicker();
    };

    onSubmit = () => {
        Keyboard.dismiss();
        const data = this.state;
        console.log(data, 'DATA LEMPAR');
        this.props.navigation.navigate('RequestFormOrderSecond', { datas: data })
    }


    renderButton = () => {
        if (this.state.loading) {
            return <Spinner size='large' />
        }

        return (
            <Button
                onPress={
                    () => this.onSubmit()
                }
            >
                Selanjutnya
			</Button>
        )
    }


    querySuggestion = (text) => {
        console.log(text, 'Text');
        AsyncStorage.getItem('loginCredential', (err, result) => {

            axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
                headers: { 'x-access-token': result }
            })
                .then(response => {
                    res = response.data.data
                    const result = res
                    console.log(result, 'Result AutoComplete');
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

    componentWillMount() {
        this.setState({
            loading: true,
            photo: require('./../assets/image/upload-foto.png')
        });
        AsyncStorage.getItem('loginCredential', (err, resultToken) => {

            axios.get(`${BASE_URL}/provinces`, {
                headers: { 'x-access-token': resultToken }
            })
                .then(response => {
                    res = response.data.data
                    const resultDataCity = res
                    this.setState({
                        dataMaster: this.props.navigation.state.params.datas,
                        dataProvinsi: resultDataCity,
                        loading: false
                    });
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

    renderProvinceCity = () => {
        const dataProvCity = this.state.dataProvinsi;
        return dataProvCity.map((data) => {
            return <Picker.Item label={data.name} value={data.id} />
        })
    }


    onChangeProvince = (name, v) => {
        this.setState({ [name]: v });
        console.log(v, this.state.load, 'Value DropDown Provinci');

        AsyncStorage.getItem('loginCredential', (err, resultToken) => {
            axios.get(`${BASE_URL}/cities/search-province/${v}`, {
                headers: { 'x-access-token': resultToken }
            })
                .then(response => {
                    const result = response.data.data;
                    console.log(result, 'Data City');
                    this.setState({ dataMapCity: result });
                    console.log(this.state.dataMapCity, 'Lemparan ID City');
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

    renderPickerCity = () => {
        if (this.state.dataMapCity == '') {
            return <Picker.Item label='Pilih Kota' value='0' />
        } else {
            const resultRender = this.state.dataMapCity;
            return resultRender.map((data) => {
                return <Picker.Item label={data.name} value={data.id} />
            })
        }
    }

    onItemSelected = (item) => {
        console.log(item, 'Item Fish');
        this.setState({
            suggestions: [],
            FishId: item.id,
            value: item.name
        })
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    photo: source
                });
            }
        });
    }



    renderAllData = () => {
        if (this.state.loading == true) {
            return <Spinner size="small" />
        } else if (this.state.loading == false) {
            const {
                dataMapCity,
                dataCity,
                dataProvinsi,
                suggestions,
                value,
                provinsiId,
                cityId,
                size,
                quantity,
                minBudget,
                maxBudget,
                deskripsi,
                datePick,
                dateNowPick,
                photo
            } = this.state

            return (
                <ScrollView
                    keyboardShouldPersistTaps="always"
                >
                    <Container>

                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                INFORMASI KOMODITAS
							</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                    <View style={[styles.avatar, styles.avatarContainer]}>
                                        {this.state.photo === null ? <Text>Take a Picture</Text> :
                                            <Image style={styles.avatar} source={this.state.photo} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label="Nama Komoditas"
                                placeholder='Nama Komoditas'
                                value={deskripsi}
                                style={styles.textArea}
                                onChangeText={v => this.onChangeInput('deskripsi', v)}
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
                                placeholder='Deskripsi Ikan'
                                value={deskripsi}
                                style={styles.textArea}
                                onChangeText={v => this.onChangeInput('deskripsi', v)}
                            />
                        </CardSectionRegistration>


                        <CardSectionRegistration>
                            <InputRegistration
                                label="Total Harga"
                                placeholder='Total Harga'
                                value={deskripsi}
                                style={styles.textArea}
                                onChangeText={v => this.onChangeInput('deskripsi', v)}
                            />
                        </CardSectionRegistration>

                        <View>
                            <Text style={styles.unitStyle}>IDENTITAS NELAYAN</Text>
                        </View>

                        <CardSectionRegistration>
                            <InputRegistration
                                label="Nama"
                                placeholder='Nama'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label="Nomor KTP"
                                placeholder='Nomor KTP'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Nama Lembaga Nelayan'
                                placeholder='Nama Lembaga Nelayan'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Lokasi Nelayan'
                                placeholder='Lokasi Lengkap'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                DESKRIPSI PENGIRIMAN
							</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Tanggal Pengiriman'
                                placeholder='Tanggal Pengiriman'
                                value={dateNowPick}
                                onChangeText={v => this.onChangeInput('dateNowPick', v)}
                                editable={false}
                            />
                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                <Image
                                    style={{ marginTop: 10, width: 50, height: 50 }}
                                    source={require('./../assets/image/date-icon.png')}
                                />
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                LOKASI PENERIMA KOMODITAS
							</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <CheckBox
                                title='Lokasi penerimaan komoditas sama dengan lokasi pembeli'
                                checked="true"
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Lokasi Penerimaan'
                                placeholder='Lokasi Lengkap'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                DESKRIPSI PENERIMAAN
							</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Nominal DP'
                                placeholder='Nominal DP'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Tanggal DP'
                                placeholder='Tanggal DP'
                                value={dateNowPick}
                                onChangeText={v => this.onChangeInput('dateNowPick', v)}
                                editable={false}
                            />
                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                <Image
                                    style={{ marginTop: 10, width: 50, height: 50 }}
                                    source={require('./../assets/image/date-icon.png')}
                                />
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                KOMODITAS REJECT
							</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Deskripsi Komoditas Reject'
                                placeholder='Deskripsi Komoditas Reject'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Presentase Maksimal Komoditas Reject'
                                placeholder='Presentase Maksimal Komoditas Reject'
                                value={minBudget}
                                onChangeText={v => this.onChangeInput('minBudget', v)}
                            />
                        </CardSectionRegistration>

                    </Container>

                    <ContainerSection>
                        {this.renderButton()}
                    </ContainerSection>

                </ScrollView>
            )
        }
    }



    render() {
        const {
            dataProvinsi,
            suggestions,
            provinsiId,
            cityId,
            size,
            quantity,
            minBudget,
            maxBudget,
            deskripsi,
            datePick
        } = this.state

        return (
            <View>
                {this.renderAllData()}
            </View>
        );
    }
};


const styles = {
    headerStyle: {
        marginLeft: 5,
        fontWeight: 'bold'
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
        paddingRight: 30,
        fontWeight: 'bold',
    },
    unitStyles: {
        marginTop: 30,
        paddingRight: 30,
        paddingLeft: 30
    },
    textArea: {
        height: 50,
        borderLine: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderRadius: 10,
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        resizeMode: 'stretch',
        width: 320,
        height: 130
    }
}

export default FormContractPage;