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

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
class RequestFormOrderFirstPage extends Component {




    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Buat Permintaan',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF', paddingLeft: 30 },
        headerLeft:
            <TouchableOpacity
                onPress={() => { navigation.navigate('Home') }}
            >
                <Image
                    style={{ width: 20, height: 20, marginLeft: 30 }}
                    source={require('./../assets/images/back.png')} />
            </TouchableOpacity>
    });

    goBack() {
        const { navigate } = this.props.navigation;
        navigate('Home');
    }

    constructor(props) {
        super(props);
        this.state = {
            load: null,
            loading: null,
            loadButton: null,
            unitFish: '',
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
            photo: null
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
        console.log(this.state, 'DATA FORM 1');

        if (this.state.photo == require('./../assets/image/upload-foto.png')) {
            alert('Anda belum upload Foto');
        } else if (this.state.FishId == '') {
            alert('Anda belum memilih Komoditas');
        } else if (this.state.size == '') {
            alert('Anda belum menentukan Ukuran');
        } else if (this.state.quantity == '') {
            alert('Anda belum menentukan Kuantitas');
        } else if (this.state.deskripsi == '') {
            alert('Anda belum menentukan Deskripsi Komoditas');
        } else if (this.state.minBudget == '') {
            alert('Anda belum menentukan min Harga');
        } else if (this.state.maxBudget == '') {
            alert('Anda belum menentukan max Harga')
        } else if (this.state.dateNowPick == '') {
            alert('Anda belum menentuan tanggal Permintaan')
        } else if (this.state.provinsiId == '') {
            alert('anda belum memilih Provinsi');
        } else if (this.state.cityId == '') {
            alert('Anda belum memilih Kota')
        } else if (this.state.maxBudget < this.state.minBudget) {
            alert('Harga Max tidak bisa lebih kecil dari Harga Min')
        } else if (this.state.quantity < this.state.size) {
            alert('Kuantitas Komoditas tidak bisa lebih kecil dari Ukuran Komoditas')
        } else {
            console.log('LOLOS');
            Keyboard.dismiss();
            const data = this.state;
            console.log(data, 'DATA LEMPAR');
            this.props.navigation.navigate('RequestFormOrderSecond', { datas: data })
        }
    }


    renderButton = () => {
        if (this.state.loadButton) {
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
        this.setState({ value: text })
        AsyncStorage.getItem('loginCredential', (err, result) => {

            axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
                headers: { 'x-access-token': result }
            })
                .then(response => {
                    res = response.data.data
                    this.setState({ suggestions: res })
                    console.log(res, 'Auto Complete Nya')

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
        this.setState({ photo: require('./../assets/images/foto-default.png') })
        console.log(this.state.photo, 'POTO DEFAULT');
        this.setState({ loading: true });

        const { params } = this.props.navigation.state
        console.log(params)

        if (params && params.FishId !== '') {
            this.setState({
                value: params.value,
                FishId: params.FishId
            })
        }

        AsyncStorage.getItem('loginCredential', (err, resultToken) => {

            axios.get(`${BASE_URL}/provinces`, {
                headers: { 'x-access-token': resultToken }
            })
                .then(response => {
                    res = response.data.data
                    const resultDataCity = res
                    this.setState({ dataProvinsi: resultDataCity, loading: false });
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
        console.log(item, 'Ikan terpilih');
        this.setState({
            suggestions: [],
            FishId: item.id,
            value: item.name,
            unitFish: item.unit
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
                        <Text style={styles.headerStyle}>
                            Informasi Komoditas
							</Text>
                    </CardSectionRegistration>
                    <CardSectionRegistration>
                        <AutoComplete
                            label="Nama Komoditas"
                            placeholder="Komoditas"
                            suggestions={suggestions}
                            onChangeText={text => this.querySuggestion(text)}
                            value={value}
                        >
                            {
                                suggestions && suggestions.map(item =>
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => this.onItemSelected(item)}
                                    >
                                        <View style={styles.containerItemAutoSelect}>
                                            <Text>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        </AutoComplete>
                    </CardSectionRegistration>
                    <CardSectionRegistration>
                        <InputRegistration
                            label='Ukuran'
                            placeholder='oo'
                            value={size}
                            onChangeText={v => this.onChangeInput('size', v)}
                        />
                        <Text style={styles.unitStyle}></Text>
                        <InputRegistration
                            editable={false}
                            value={this.state.unitFish}
                            onChangeText={v => this.onChangeInput('quantity', v)}
                        />
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <InputRegistration
                            label='Jumlah'
                            placeholder='oo'
                            value={quantity}
                            onChangeText={v => this.onChangeInput('quantity', v)}
                        />
                        <Text style={styles.unitStyle}></Text>
                        <InputRegistration
                            editable={false}
                            value='Kg'
                            onChangeText={v => this.onChangeInput('quantity', v)}
                        />
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <InputRegistration
                            label='Deskripsi Komoditas'
                            placeholder='Deskripsi'
                            value={deskripsi}
                            style={styles.textArea}
                            onChangeText={v => this.onChangeInput('deskripsi', v)}
                            maxLength={40}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <InputRegistration
                            label='Harga Minimal'
                            placeholder='Rupiah/kg'
                            value={minBudget}
                            onChangeText={v => this.onChangeInput('minBudget', v)}
                        />
                    </CardSectionRegistration>
                    <CardSectionRegistration>
                        <InputRegistration
                            label='Harga Maksimal'
                            placeholder='Rupiah/kg'
                            value={maxBudget}
                            onChangeText={v => this.onChangeInput('maxBudget', v)}
                        />
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <Text style={styles.headerStyle}>
                            Informasi Pengiriman
							</Text>
                    </CardSectionRegistration>

                    <CardSectionRegistration>
                        <InputRegistration
                            placeholder='00/00/18'
                            value={dateNowPick}
                            onChangeText={v => this.onChangeInput('dateNowPick', v)}
                            editable={false}
                            inlineImageLeft='search_icon'
                        />
                        <TouchableOpacity onPress={this._showDateTimePicker}>
                            <Image
                                style={{
                                    flexDirection: 'row',
                                    borderColor: '#555',
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    width: 50,
                                    height: 50
                                }}
                                source={require('./../assets/image/date-icon.png')}
                            />
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            minimumDate={new Date()}
                        />
                    </CardSectionRegistration>

                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Provinsi</Text>
                            <View style={styles.pickerStyleBox}>
                                <View style={styles.pickerStyle}>
                                    <Picker
                                        selectedValue={provinsiId}
                                        onValueChange={v => this.onChangeProvince('provinsiId', v)}
                                    >
                                        <Picker.Item label='Pilih Provinsi' value='0' />
                                        {this.renderProvinceCity()}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </ContainerSection>

                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
                            <View style={styles.pickerStyleBox}>
                                <View style={styles.pickerStyle}>
                                    <Picker
                                        selectedValue={cityId}
                                        onValueChange={v => this.onChangeInput('cityId', v)}
                                    >
                                        {this.renderPickerCity()}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </ContainerSection>

                </Container>

                <ContainerSection>
                    {this.renderButton()}
                </ContainerSection>

            </ScrollView >
        )
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
            datePick,
            loading
        } = this.state

        if (loading) {
            return <Spinner size="large" />
        }
        return (
            <View>
                {this.renderAllData()}
            </View>
        );
    }
};


const styles = {
    headerStyle: {
        color: '#77A7F4',
        fontWeight: 'bold',
        fontFamily: 'muli',
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
    pickerStyleBox: {
        flexDirection: 'row',
        borderColor: '#555',
        borderRadius: 3,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
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

export default RequestFormOrderFirstPage;