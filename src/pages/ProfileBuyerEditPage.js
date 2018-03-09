import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, Picker, Alert, Keyboard, ToastAndroid, TouchableOpacity, View, Image, TouchableWithoutFeedback, TouchableNativeFeedback, PixelRatio, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

import { Container, ContainerSection, Input, Button, Spinner } from './../components/common';
import AutoComplete from './../components/AutoComplete'
import { BASE_URL, COLOR } from './../shared/lb.config'

class ProfileBuyerEditPage extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Ubah Profil',
        headerLeft:
            <TouchableNativeFeedback
                onPress={() => {
                    if (navigation.state.params && navigation.state.params.change) {
                        Alert.alert(
                            '',
                            'Batal mengubah profil?',
                            [
                                { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                {
                                    text: 'Ya',
                                    onPress: () => {
                                        navigation.setParams({ change: false })
                                        navigation.goBack()
                                    }
                                },
                            ]
                        )
                    }
                    else {
                        navigation.goBack()
                    }
                }
                }
            >
                <Icon style={{ marginLeft: 20, color: '#fff' }} name="md-arrow-back" size={24} />
            </TouchableNativeFeedback>,
        headerRight: <View />
    })

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            data: {},

            loadingCity: false,
            suggestionsCity: [],
            valueCity: '',

            photo: null,
            idPhoto: null,
            tokenUser: ''
        }
    }

    componentWillMount() {
        this.getData()
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            const { params } = this.props.navigation.state

            if (params && params.change === true) {
                Alert.alert(
                    '',
                    'Batal mengubah profil?',
                    [
                        { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        {
                            text: 'Ya',
                            onPress: () => {
                                this.props.navigation.setParams({ change: false })
                                this.props.navigation.goBack()
                            }
                        },
                    ]
                )

                return true
            }
        })
    }

    onCitySelected = (item) => {
        this.setState({
            suggestionsCity: [],
            CityId: item.id,
            valueCity: item.name
        })
    }


    onChangeInput = (name, v) => {
        let data = this.state.data
        data[name] = v

        this.setState({ data })

        this.props.navigation.setParams({ change: true })
    }

    getData = () => {
        this.setState({ loading: true })
        AsyncStorage.getItem('loginCredential', (err, result) => {
            if (result) {
                this.setState({ tokenUser: result });
                axios.get(`${BASE_URL}/profile`, {
                    headers: { token: result }
                })
                    .then(response => {
                        this.setState({ data: response.data.user })
                        this.setState({ loading: false })
                    })
                    .catch(error => {
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah')
                        }
                        this.setState({ loading: false })
                    })
            }
        })
    }

    selectPhotoTapped = (name) => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        }

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
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    [name]: source
                })
            }
        })
    }

    queryCitySuggestion = (text) => {
        this.setState({
            valueCity: text,
            loadingCity: true
        })

        axios.get(`${BASE_URL}/cities/search?key=${text}`)
            .then(response => {
                res = response.data.data
                this.setState({ suggestionsCity: res, loadingCity: false })
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                }
                else {
                    alert('Koneksi internet bermasalah')
                }
                this.setState({ loadingCity: false })
            })
    }

    updateProfile = () => {
        Keyboard.dismiss()
        this.setState({ loading: true })

        const data = this.state.data

        let formData = new FormData()
        // organization data
        formData.append('organizationType', data.organizationType)
        formData.append('organization', data.organization)
        formData.append('CityId', data.CityId)
        formData.append('subDistrict', data.subDistrict)
        formData.append('village', data.village)
        // personal data
        if (this.state.photo) {
            formData.append('photo', {
                uri: this.state.photo.uri,
                type: 'image/jpeg',
                name: 'profile.jpg'
            })
        }
        formData.append('name', data.name)
        formData.append('idNumber', data.idNumber)
        if (this.state.idPhoto) {
            formData.append('idPhoto', {
                uri: this.state.idPhoto.uri,
                type: 'image/jpeg',
                name: 'ktp.jpg'
            })
        }
        formData.append('phone', data.phone)
        formData.append('email', data.email)
        formData.append('password', data.password)

        axios.post(`${BASE_URL}/buyer/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: this.state.tokenUser
            }
        })

            .then(response => {
                console.log(response)
                this.props.navigation.setParams({ change: false })
                AsyncStorage.getItem('loginCredential', () => {
                    AsyncStorage.removeItem('loginCredential', () => {
                        AsyncStorage.setItem('loginCredential', response.data.refreshToken, () => {
                            console.log('Sukses Ganti Token');
                            const resetAction = NavigationActions.reset({
                                index: 1,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'Home' }),
                                    NavigationActions.navigate({ routeName: 'ProfileBuyer' })
                                ]
                            })
                            this.props.navigation.dispatch(resetAction)

                            this.setState({ loading: false })
                            ToastAndroid.show('Ubah profil berhasil', ToastAndroid.SHORT)
                        });
                    });
                })
            })
            .catch(error => {
                console.log(error.response)
                if (error.response) {
                    ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
                }
                else {
                    ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
                }

                this.setState({ loading: false })
            })
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
                        'Simpan perubahan profil?',
                        [
                            { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Ya', onPress: () => this.updateProfile() },
                        ]
                    )
                }
            >
                Simpan
			</Button>
        )
    }

    render() {
        const {
            data,
            loading,

            loadingCity,
            suggestionsCity,
            valueCity,

            photo,
            idPhoto
        } = this.state

        if (loading) {
            return <Spinner size='large' />
        }

        return (
            <ScrollView
                style={styles.containerStyle}
                keyboardShouldPersistTaps="always"
            >
                <Container>
                    <ContainerSection>
                        <Text style={styles.headerStyle}>
                            Informasi Lembaga
						</Text>
                    </ContainerSection>
                    <ContainerSection>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTextStyle}>Jenis Lembaga</Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    style={{ flex: 1 }}
                                    selectedValue={data ? data.organizationType : ''}
                                    onValueChange={v => this.onChangeInput('organizationType', v)}
                                >
                                    <Picker.Item label='PT' value='PT' />
                                    <Picker.Item label='CV' value='CV' />
                                    <Picker.Item label='Lainnya' value='Lainnya' />
                                </Picker>
                            </View>
                        </View>
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Nama Lembaga'
                            value={data ? data.organization : ''}
                            onChangeText={v => this.onChangeInput('organization', v)}
                        />
                    </ContainerSection>

                    <ContainerSection>
                        <Text style={styles.headerStyle}>
                            Lokasi Nelayan
						</Text>
                    </ContainerSection>
                    <ContainerSection>
                        <AutoComplete
                            label="Kota / Kabupaten"
                            suggestions={suggestionsCity}
                            onChangeText={text => this.queryCitySuggestion(text)}
                            value={valueCity || data.City.name}
                        >
                            {
                                loadingCity ?
                                    <View style={{ flex: 1 }}>
                                        <Spinner size='large' />
                                    </View>
                                    :
                                    suggestionsCity && suggestionsCity.map(item =>
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => this.onCitySelected(item)}
                                        >
                                            <View style={styles.containerItemAutoSelect}>
                                                <Text>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                            }
                        </AutoComplete>
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Kecamatan'
                            placeholder='contoh: Antapani'
                            value={data ? data.subDistrict : ''}
                            onChangeText={v => this.onChangeInput('subDistrict', v)}
                        />
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Desa/Kelurahan'
                            placeholder='contoh: Antapani Kidul'
                            value={data ? data.village : ''}
                            onChangeText={v => this.onChangeInput('village', v)}
                        />
                    </ContainerSection>
                </Container>

                <Container>
                    <ContainerSection>
                        <Text style={styles.headerStyle}>
                            Informasi Personal
						</Text>
                    </ContainerSection>

                    <Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Upload Foto Profil</Text>
                    <ContainerSection>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                                    {photo === null ?
                                        <Image style={styles.avatar} source={{ uri: `${BASE_URL}/images/${data.photo}` }} />
                                        :
                                        <Image style={styles.avatar} source={photo} />
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Nama Lengkap'
                            placeholder='contoh: Ahmad Darudi'
                            value={data ? data.name : ''}
                            onChangeText={v => this.onChangeInput('name', v)}
                        />
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='No. KTP'
                            editable={false}
                            placeholder='contoh: 321317989029'
                            keyboardType="numeric"
                            value={data ? data.idNumber : ''}
                            onChangeText={v => this.onChangeInput('idNumber', v)}
                        />
                    </ContainerSection>

                    <Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Upload Foto KTP</Text>
                    <ContainerSection>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableWithoutFeedback>
                                <View>
                                    {idPhoto === null ?
                                        <Image style={{ height: 200, width: 300 }} source={{ uri: `${BASE_URL}/images/${data.idPhoto}` }} />
                                        :
                                        <Image style={{ height: 200, width: 300 }} source={idPhoto} />
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='No. HP'
                            placeholder='contoh: 085621017922'
                            keyboardType="numeric"
                            value={data ? data.phone : ''}
                            onChangeText={v => this.onChangeInput('phone', v)}
                        />
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Email'
                            editable={false}
                            placeholder='contoh: erwin@gmail.com'
                            value={data ? data.email : ''}
                        />
                    </ContainerSection>
                    <ContainerSection>
                        <Input
                            label='Username'
                            value={data ? data.username : ''}
                        />
                    </ContainerSection>
                    {
                        // <ContainerSection>
                        // 	<Input
                        // 		label='Password'
                        // 		placeholder='minimal 6 karakter'
                        // 		secureTextEntry
                        // 		value={data ? data.password : ''}
                        // 		onChangeText={v => this.onChangeInput('password', v)}
                        // 	/>
                        // </ContainerSection>
                        // <ContainerSection>
                        // 	<Input
                        // 		label='Konfirmasi Password'
                        // 		placeholder='minimal 6 karakter'
                        // 		secureTextEntry
                        // 		value={data ? data.confirmPassword : ''}
                        // 		onChangeText={v => this.onChangeInput('confirmPassword', v)}
                        // 	/>
                        // </ContainerSection>
                    }

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <ContainerSection>
                            {this.renderButton()}
                        </ContainerSection>
                    </View>
                </Container>
            </ScrollView>
        )
    }
}

const styles = {
    headerStyle: {
        color: COLOR.secondary_a,
        fontSize: 18
    },
    pickerContainer: {
        flex: 1,
        marginBottom: 5
    },
    pickerStyle: {
        borderColor: '#a9a9a9',
        borderRadius: 5,
        paddingLeft: 7,
        borderWidth: 1,
    },
    pickerTextStyle: {
        color: '#5e5e5e',
        fontSize: 14,
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    containerItemAutoSelect: {
        padding: 10,
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: 75,
        width: 100,
        height: 100
    }
}

export default ProfileBuyerEditPage;
