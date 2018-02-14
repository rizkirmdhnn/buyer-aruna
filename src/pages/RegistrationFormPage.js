import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Text,
    Picker,
    Keyboard,
    TextInput,
    Image,
    CameraRoll,
    PixelRatio,
    TouchableOpacity,
    Alert
} from 'react-native';
import axios from 'axios';

/**
 *  Import Common
 */
import { CardRegistration, Spinner, CardSectionRegistration, InputRegistration, Button } from './../components/common'
import { BASE_URL } from './../shared/lb.config';


import ImagePicker from 'react-native-image-picker';

class RegistrationFormPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            loading: null,

            organization: '',
            organizationType: '',
            addressInstitution: '',
            npwp: '',
            email: '',

            name: '',
            idNumber: '',
            address: '',
            phone: '',
            username: '',
            password: '',


            idPhoto: null,
            npwpPhoto: null,

            pathKtp: null,
            pathNpwp: null,
        };
    };

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    static navigationOptions = {
        title: 'Pendaftaran Akun',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF', paddingLeft: 30 },
        headerTintColor: 'white'
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v })
    }

    register = () => {
        Keyboard.dismiss()
        const { navigate } = this.props.navigation;
        this.setState({ loading: true })

        const dataPhoto = new FormData();
        dataPhoto.append('name', this.state.name);
        dataPhoto.append('email', this.state.email);
        dataPhoto.append('password', this.state.password);
        dataPhoto.append('phone', this.state.phone);
        dataPhoto.append('organization', this.state.organization);
        dataPhoto.append('organizationType', this.state.organizationType);
        dataPhoto.append('idNumber', this.state.idNumber);
        dataPhoto.append('idPhoto', {
            uri: this.state.idPhoto.uri,
            type: 'image/jpeg',
            name: 'ktpImage.jpeg'
        });
        dataPhoto.append('npwp', this.state.npwp);
        dataPhoto.append('npwpPhoto', {
            uri: this.state.npwpPhoto.uri,
            type: 'image/jpeg',
            name: 'npwpImage.jpeg'
        });

        console.log(dataPhoto, 'Data formData');
        console.log(this.state, 'Data State');
        axios.post(`${BASE_URL}/buyer/register`,
            dataPhoto
            , {
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then(response => {
                console.log(response, 'Response');
                console.log(response.status)
                this.setState({ loading: false })
                navigate('Home');
            })
            .catch(error => {
                console.log(error.response, 'Error');
                alert(error.response.data.message);
                this.setState({ loading: false })
            })
    }

    handleButtonPress = () => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'All',
        })
            .then(r => {
                console.log(r, 'Result');
                this.setState({ photo: r.edges });
            })
            .catch((err) => {
                console.log(err, 'Error')
            });
    };

    selectPhotoTappedNPWP() {
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
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    npwpPhoto: source,
                    pathNpwp: source
                });
            }
        });
    }

    selectPhotoTappedKTP() {
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
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    idPhoto: source,
                    pathKtp: source
                });
            }
        });
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
                        'Yakin data anda sudah benar ?',
                        [
                            { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Ya', onPress: () => this.register() },
                        ]
                    )
                }
            >
                Daftar
			</Button>
        )
    }

    componentWillMount() {
        this.setState({ pathNpwp: require('./../assets/images/foto-default.png') })
        this.setState({ pathKtp: require('./../assets/images/foto-default.png') })
    }




    render() {

        const { navigate } = this.props.navigation
        const { showAlert } = this.state;

        const {
            organization,
            organizationType,
            addressInstitution,
            npwp,
            email,

            name,
            idNumber,
            photo,
            address,
            phone,
            username,
            password,

            pathKtp,
            pathNpwp,
        } = this.state



        return (
            <View>
                <ScrollView
                    style={styles.containerStyle}
                    keyboardShouldPersistTaps="always"
                >
                    <CardRegistration>
                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                INFORMASI LEMBAGA
            				</Text>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerTextStyle}>Jenis Lembaga</Text>
                                <View style={styles.pickerStyle}>
                                    <Picker
                                        selectedValue={organizationType}
                                        onValueChange={v => this.onChangeInput('organizationType', v)}
                                    >
                                        <Picker.Item label='PT' value='PT' />
                                        <Picker.Item label='CV' value='CV' />
                                        <Picker.Item label='OTHERS' value='OTHERS' />
                                    </Picker>
                                </View>
                            </View>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Nama Lembaga'
                                placeholder='Nama Lembaga'
                                value={organization}
                                onChangeText={v => this.onChangeInput('organization', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='NPWP (Nomor Pokok Wajib Pajak)'
                                placeholder='NPWP Lembaga'
                                value={npwp}
                                onChangeText={v => this.onChangeInput('npwp', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <Text>Unggah Foto NPWP</Text>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={this.selectPhotoTappedNPWP.bind(this)}>
                                    <View style={[styles.avatar, styles.avatarContainer]}>
                                        {this.state.pathNpwp === null ? <Text>Take a Picture NPWP</Text> :
                                            <Image style={styles.avatar} source={this.state.pathNpwp} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Alamat'
                                placeholder='Alamat'
                                value={addressInstitution}
                                onChangeText={v => this.onChangeInput('addressInstitution', v)}
                            />
                        </CardSectionRegistration>
                    </CardRegistration>

                    <CardRegistration>
                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                INFORMASI PERSONAL
            				</Text>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Nama Lengkap'
                                placeholder='contoh: Ahmad Darudi'
                                value={name}
                                onChangeText={v => this.onChangeInput('name', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='No. KTP (Kartu Tanda Penduduk)'
                                placeholder='10   50   3045   62356723'
                                value={idNumber}
                                onChangeText={v => this.onChangeInput('idNumber', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <Text>Unggah Foto KTP</Text>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={this.selectPhotoTappedKTP.bind(this)}>
                                    <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                                        {this.state.pathKtp === null ? <Text>Take a Picture KTP</Text> :
                                            <Image
                                                style={styles.avatar}
                                                source={this.state.pathKtp}
                                            />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Alamat'
                                placeholder='Alamat'
                                value={address}
                                onChangeText={v => this.onChangeInput('address', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='No. Telepon/Handphone'
                                placeholder='+62852 1910 0674'
                                value={phone}
                                onChangeText={v => this.onChangeInput('phone', v)}
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Email'
                                placeholder='Email'
                                value={email}
                                onChangeText={v => this.onChangeInput('email', v)}
                            />
                        </CardSectionRegistration>
                    </CardRegistration>

                    <CardRegistration>
                        <CardSectionRegistration>
                            <Text style={styles.headerStyle}>
                                Data Akun
            				</Text>
                        </CardSectionRegistration>

                        <CardSectionRegistration>
                            <InputRegistration
                                label='Password'
                                placeholder='minimal 6 karakter'
                                secureTextEntry
                            />
                        </CardSectionRegistration>
                        <CardSectionRegistration>
                            <InputRegistration
                                label='Konfirmasi Password'
                                placeholder='minimal 6 karakter'
                                secureTextEntry
                                value={password}
                                onChangeText={v => this.onChangeInput('password', v)}
                            />
                        </CardSectionRegistration>

                    </CardRegistration>
                    <CardSectionRegistration>
                        {this.renderButton()}
                    </CardSectionRegistration>
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    headerStyle: {
        marginLeft: 5,
        color: '#77A7F4',
        fontWeight: 'bold'
    },
    pickerTextStyle: {
        color: 'black',
        flex: 1,
        paddingLeft: 5
    },
    pickerContainer: {
        flex: 1,
        height: 65,
        marginBottom: 5
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
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white'
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

export default RegistrationFormPage;
