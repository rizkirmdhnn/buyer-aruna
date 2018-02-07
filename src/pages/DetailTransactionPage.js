import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking,
    AsyncStorage,
    Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import numeral from 'numeral'
import axios from 'axios'
import { CheckBox, FormInput, Rating } from 'react-native-elements'
import { Card, Button, CardSection, Container, ContainerSection, Spinner } from '../components/common'
import { BASE_URL } from './../shared/lb.config';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
class DetailTransactionPage extends Component {

    isGoDiscuss() {
        console.log(this.state.dataMaster, 'Data discuss');
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Detail Transaksi',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' },
        headerRight:
            <TouchableOpacity onPress={() => { navigation.navigate('Message', { idData: navigation.state.params.datas }) }}>
                <View>
                    <Icon style={{ marginRight: 20 }} size={30} name="md-chatboxes" />
                </View>
            </TouchableOpacity>
    });

    constructor(props) {
        super(props)

        this.state = {
            dataMaster: '',
            dataTransaction: '',
            dataDetail: '',
            photo: '',
            tokenUser: '',
            survey: false,
            sample: false,
            dataSurvey: 0,
            dataSample: 0,

            loading: null,
            checked: false,
            isModalVisible: false,

            requestContainer: null,
            contractDone: null,
            contractNotDone: null,
            contractRevision: null,
            contractApproved: null,
            contractPending: null,

            dpContainer: null,
            dpPending: null,
            dpApproved: null,
            dpFailed: null,
            dpNotYet: null,

            deliveryContainer: null,
            deliveryPending: null,
            deliveryRevision: null,
            deliveryApproved: null,
            deliveryApprovedAdminPending: null,
            deliveryApprovedAdminRevision: null,


            paidContainer: null,
            paidNotYet: null,
            paidWaiting: null,
            paidRevision: null,
            paidApproved: null,

            doneContainer: null,

            requestExpanded: false,
            contractExpanded: false,
            dpExpanded: false,
            deliveryExpanded: false,
            paidExpanded: false,
            doneExpanded: false
        }
    }

    componentWillMount() {
        this.setState({ dataMaster: this.props.navigation.state.params.datas, loading: true });

        const idTransaction = this.props.navigation.state.params.datas.id

        AsyncStorage.getItem('loginCredential', (err, result) => {
            const token = result;
            this.setState({ tokenUser: token })
            axios.get(`${BASE_URL}/buyer/orders/${idTransaction}`, {
                headers: { token }
            })
                .then(response => {
                    console.log(response, 'Data Transaction');
                    this.setState({ dataTransaction: response.data.data, dataDetail: response.data.data, loading: false });

                    if (this.state.dataMaster.Contract == null) {
                        this.setState({
                            contractNotDone: true,
                        })
                    } else {
                        if (this.state.dataMaster.Contract.Status.id === 4) {
                            this.setState({
                                contractDone: true,
                                contractPending: true,
                            })
                        }

                        if (this.state.dataMaster.Contract.Status.id === 5) {
                            this.setState({
                                contractDone: true,
                                contractApproved: true
                            })

                            if (this.state.dataTransaction.downPayment == null) {
                                this.setState({
                                    dpContainer: true,
                                    dpNotYet: true
                                })
                            }

                            if (this.state.dataTransaction.downPayment.Status.id == 25) {
                                this.setState({
                                    dpContainer: true,
                                    dpPending: true
                                })
                            }

                            if (this.state.dataTransaction.downPayment.Status.id == 26) {
                                this.setState({
                                    dpContainer: true,
                                    dpApproved: true
                                })

                                if (this.state.dataTransaction.shipping.Status.id == 28) {
                                    this.setState({
                                        deliveryContainer: true,
                                        deliveryPending: true
                                    })
                                }
                                if (this.state.dataTransaction.shipping.Status.id == 29) {
                                    this.setState({
                                        deliveryContainer: true,
                                        deliveryApproved: true
                                    })

                                    if (this.state.dataTransaction.shippingDelivered.Status.id == 35) {
                                        this.setState({
                                            deliveryContainer: true,
                                            deliveryApproved: null,
                                            deliveryApprovedAdminPending: true
                                        })
                                    }

                                    if (this.state.dataTransaction.shippingDelivered.Status.id == 36) {
                                        this.setState({
                                            deliveryContainer: true,
                                            deliveryApproved: null,
                                            deliveryApprovedAdminPending: null,
                                            deliveryApprovedAdminApproved: true
                                        })

                                        if (this.state.dataTransaction.finalPayment == null) {
                                            this.setState({
                                                paidContainer: true,
                                                paidNotYet: true
                                            })
                                        }

                                        if(this.state.dataTransaction.finalPayment.Status.id == 25) {
                                            this.setState({
                                                paidContainer: true,
                                                paidNotYet: null,
                                                paidWaiting: true
                                            })
                                        }

                                        if(this.state.dataTransaction.finalPayment.Status.id == 26) {
                                            this.setState({
                                                paidContainer: true,
                                                paidNotYet: null,
                                                paidWaiting: null,
                                                paidApproved: true,
                                                doneContainer: true,
                                                doneExpanded: true
                                            })
                                        }
                                        if(this.state.dataTransaction.finalPayment.Status.id == 27) {
                                            this.setState({
                                                paidContainer: true,
                                                paidApproved: null,
                                                paidRevision: true
                                            })
                                        }
                                    }
                                }
                                if (this.state.dataTransaction.shipping.Status.id == 30) {
                                    this.setState({
                                        deliveryContainer: true,
                                        deliveryRevision: true
                                    })
                                }
                            }

                            if (this.state.dataTransaction.downPayment.Status.id == 27) {
                                this.setState({
                                    dpContainer: true,
                                    dpFailed: true
                                })
                            }
                        }

                        if (this.state.dataMaster.Contract.Status.id === 6) {
                            this.setState({
                                contractDone: true,
                                contractRevision: true
                            })
                        }
                    }
                })
                .catch(error => {
                    console.log(error, 'error');
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Get All Data')
                    }
                    this.setState({ loading: false })
                })

        });
    }

    createContract() {
        this.props.navigation.navigate('FormContract', { datas: this.props.navigation.state.params.datas })
    }

    createContractRevision() {
        this.props.navigation.navigate('FormContractRevision', { datas: this.props.navigation.state.params.datas })
    }

    fetchDetail = () => {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            const token = result;
            const id = this.props.navigation.state.params.id

            axios.get(`${BASE_URL}/supplier/orders/${id}`, {
                headers: { token }
            })
                .then(response => {
                    this.setState({ data: response.data.data, loading: false })
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Fetch Detail')
                    }
                    this.setState({ loading: false })
                })
        });
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    checkBoxSample = () => {
        this.setState({ sample: !this.state.sample });
    }

    checkBoxSurvey = () => {
        this.setState({ survey: !this.state.survey });
    }

    sendRequest() {
        AsyncStorage.getItem('loginCredential', (err, result) => {
            const token = result;
            const id = this.state.dataMaster.id;

            const dataRequest = {
                'survey': this.state.survey === true ? 1 : 0,
                'sample': this.state.sample === true ? 1 : 0
            }

            axios.post(`${BASE_URL}/buyer/orders/${id}/samples`,
                dataRequest
                , {
                    headers: {
                        token
                    },
                })
                .then(response => {
                    console.log(response, 'Result')
                    alert('Sukses Request permintaan Survei & Sample. Info lebih lanjut silahkan lakukan diskusi dengan nelayan.')
                })
                .catch(error => {
                    console.log(error, 'Error');
                    if (error.response) {
                        alert(error.response.data.message)
                    }
                    else {
                        alert('Koneksi internet bermasalah Sample')
                    }
                })


        });
    }

    uploadDownPayment() {
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
                const dateVar = new Date();
                const dateTemp = moment(dateVar).format('YYYY-MM-DD h:mm:ss');

                this.setState({
                    photo: source.uri
                });

                const id = this.state.dataMaster.id;
                console.log(id, 'id nya');
                const dataPhoto = new FormData();
                dataPhoto.append('photo', {
                    uri: this.state.photo,
                    type: 'image/jpeg',
                    name: 'downPayment.jpeg'
                });

                const { navigate } = this.props.navigation
                axios.post(`${BASE_URL}/buyer/orders/${id}/payments`,
                    dataPhoto,
                    {
                        headers: {
                            'token': this.state.tokenUser,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log('AIOSAIODAODISODIAD');
                        console.log(response, 'Upload Payment');
                        Alert.alert(
                            '',
                            'Bukti DP upload Sukses, Silahkan tunggu verifikasi admin.',
                            [
                                {
                                    text: 'Ya', onPress: () => {
                                        navigate('Home');
                                        console.log('Ke Home');
                                    }
                                },
                            ]
                        )
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah')
                        }
                        this.setState({ loading: false })
                    })
            }
        });
    }

    uploadReceiving() {
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
                const dateVar = new Date();
                const dateTemp = moment(dateVar).format('YYYY-MM-DD h:mm:ss');

                this.setState({
                    photo: source.uri
                });

                const id = this.state.dataMaster.id;
                console.log(id, 'id nya');
                const dataPhoto = new FormData();
                dataPhoto.append('photo', {
                    uri: this.state.photo,
                    type: 'image/jpeg',
                    name: 'receivingKomoditas.jpeg'
                });

                const { navigate } = this.props.navigation
                axios.post(`${BASE_URL}/buyer/orders/${id}/shippingsdelivered`,
                    dataPhoto,
                    {
                        headers: {
                            'token': this.state.tokenUser,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log('AIOSAIODAODISODIAD');
                        console.log(response, 'Upload Payment');
                        Alert.alert(
                            '',
                            'Upload Bukti Penerimaan Sukses.',
                            [
                                {
                                    text: 'Ya', onPress: () => {
                                        navigate('Home');
                                        console.log('Ke Home');
                                    }
                                },
                            ]
                        )
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah')
                        }
                        this.setState({ loading: false })
                    })
            }
        });
    }

    uploadReceivingRevision() {
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
                const dateVar = new Date();
                const dateTemp = moment(dateVar).format('YYYY-MM-DD h:mm:ss');

                this.setState({
                    photo: source.uri
                });

                const id = this.state.dataMaster.id;
                console.log(id, 'id nya');
                const dataPhoto = new FormData();
                dataPhoto.append('photo', {
                    uri: this.state.photo,
                    type: 'image/jpeg',
                    name: 'receivingKomoditasRevision.jpeg'
                });

                const { navigate } = this.props.navigation
                axios.put(`${BASE_URL}/buyer/orders/${id}/shippingsdelivered`,
                    dataPhoto,
                    {
                        headers: {
                            'token': this.state.tokenUser,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log('AIOSAIODAODISODIAD');
                        console.log(response, 'Upload Payment');
                        Alert.alert(
                            '',
                            'Upload Bukti Penerimaan Sukses.',
                            [
                                {
                                    text: 'Ya', onPress: () => {
                                        navigate('Home');
                                        console.log('Ke Home');
                                    }
                                },
                            ]
                        )
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah Revision')
                        }
                        this.setState({ loading: false })
                    })
            }
        });
    }

    finalPayments() {
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
                const dateVar = new Date();
                const dateTemp = moment(dateVar).format('YYYY-MM-DD h:mm:ss');

                this.setState({
                    photo: source.uri
                });

                const id = this.state.dataMaster.id;
                console.log(id, 'id nya');
                const dataPhoto = new FormData();
                dataPhoto.append('photo', {
                    uri: this.state.photo,
                    type: 'image/jpeg',
                    name: 'downPayment.jpeg'
                });

                const { navigate } = this.props.navigation
                axios.post(`${BASE_URL}/buyer/orders/${id}/finalpayments`,
                    dataPhoto,
                    {
                        headers: {
                            'token': this.state.tokenUser,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log('AIOSAIODAODISODIAD');
                        console.log(response, 'Upload Payment');
                        Alert.alert(
                            '',
                            'Bukti DP upload Sukses, Silahkan tunggu verifikasi admin.',
                            [
                                {
                                    text: 'Ya', onPress: () => {
                                        navigate('Home');
                                        console.log('Ke Home');
                                    }
                                },
                            ]
                        )
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah')
                        }
                        this.setState({ loading: false })
                    })
            }
        });
    }

    revisionfinalPayments() {
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
                const dateVar = new Date();
                const dateTemp = moment(dateVar).format('YYYY-MM-DD h:mm:ss');

                this.setState({
                    photo: source.uri
                });

                const id = this.state.dataMaster.id;
                console.log(id, 'id nya');
                const dataPhoto = new FormData();
                dataPhoto.append('photo', {
                    uri: this.state.photo,
                    type: 'image/jpeg',
                    name: 'downPayment.jpeg'
                });

                const { navigate } = this.props.navigation
                axios.put(`${BASE_URL}/buyer/orders/${id}/finalpayments`,
                    dataPhoto,
                    {
                        headers: {
                            'token': this.state.tokenUser,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log('AIOSAIODAODISODIAD');
                        console.log(response, 'Upload Payment');
                        Alert.alert(
                            '',
                            'Bukti DP upload Sukses, Silahkan tunggu verifikasi admin.',
                            [
                                {
                                    text: 'Ya', onPress: () => {
                                        navigate('Home');
                                        console.log('Ke Home');
                                    }
                                },
                            ]
                        )
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response) {
                            alert(error.response.data.message)
                        }
                        else {
                            alert('Koneksi internet bermasalah')
                        }
                        this.setState({ loading: false })
                    })
            }
        });
    }

    renderReceivingPending() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text>Nama Penerima</Text>
                    <Text>No. Telp</Text>
                    <Text>Alamat</Text>
                    <Text>Status</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>{alamat}</Text>
                    <Text>Telah dikirim oleh nelayan. Mohon tunggu verifikasi dari admin. Terimakasih.</Text>
                </View>
            </View>
        )
    }

    renderReceivingRevision() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text>Nama Penerima</Text>
                    <Text>No. Telp</Text>
                    <Text>Alamat</Text>
                    <Text>Status</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>{alamat}</Text>
                    <Text>Direvisi oleh admin, silahkan lakukan diskusi dengan nelayan agar proses menjadi cepat. Terimakasih.</Text>
                </View>
            </View>
        )
    }

    renderReceivingApproved() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text>Nama Penerima</Text>
                        <Text>No. Telp</Text>
                        <Text>Alamat</Text>
                        <Text>Status</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{name}</Text>
                        <Text>{phone}</Text>
                        <Text>{alamat}</Text>
                        <Text>Telah disetujui oleh admin, silahkan upload foto barang jika sudah sampai tempat tujuan. Terimakasih.</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Button
                        onPress={() => {
                            this.uploadReceiving()
                        }}>
                        Komoditas Telah diTerima
                    </Button>
                </View>
            </View>
        )
    }

    renderReceivingApprovedAdminPending() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text>Nama Penerima</Text>
                    <Text>No. Telp</Text>
                    <Text>Alamat</Text>
                    <Text>Status</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>{alamat}</Text>
                    <Text>Penerimaan telah terkirim, silahkan tunggu verifikasi admin. Terimakasih.</Text>
                </View>
            </View>
        )
    }

    renderReceivingApprovedAdminRevision() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text>Nama Penerima</Text>
                        <Text>No. Telp</Text>
                        <Text>Alamat</Text>
                        <Text>Status</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{name}</Text>
                        <Text>{phone}</Text>
                        <Text>{alamat}</Text>
                        <Text>Penerimaan di revisi, silahkan lakukan revisi upload foto penerimaan. Terimakasih.</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Button
                        onPress={() => {
                            this.uploadReceivingRevision()
                        }}>
                        Revisi Upload Foto
                    </Button>
                </View>
            </View>
        )
    }

    renderReceivingApprovedAdminApproved() {
        console.log(this.state.dataDetail, 'Data Detail');
        const alamat = this.state.dataDetail.Contract.locationOfreception;
        const name = this.state.dataDetail.Request.Buyer.name;
        const phone = this.state.dataDetail.Request.Buyer.phone;
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text>Nama Penerima</Text>
                    <Text>No. Telp</Text>
                    <Text>Alamat</Text>
                    <Text>Status</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>{alamat}</Text>
                    <Text>Penerimaan telah di approved admin. Terimakasih.</Text>
                </View>
            </View>
        )
    }
    
    giveComment() {
        console.log('Ulasan');
    }

    render() {
        const {
            survey,
            sample,
            dataDetail,
            requestExpanded,
            contractExpanded,
            dpExpanded,
            deliveryExpanded,
            paidExpanded,
            doneExpanded,
            requestContainer,
            dpContainer,
            deliveryContainer,
            paidContainer,
            doneContainer,
            contractDone,
            contractNotDone,
            contractRevision,
            contractApproved,
            contractPending,
            dpPending,
            dpApproved,
            dpFailed,
            dpNotYet,
            data,
            deliveryPending,
            deliveryRevision,
            deliveryApproved,
            deliveryApprovedAdminPending,
            deliveryApprovedAdminRevision,
            deliveryApprovedAdminApproved,
            paidNotYet,
            paidRevision,
            paidApproved,
            paidWaiting
        } = this.state

        if (this.state.loading) {
            return <Spinner size='large' />
        }

        return (
            <ScrollView style={{ flex: 1 }}>
                <Container>
                    <ContainerSection>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={require('./../assets/image/gurame.jpg')}
                            />
                        </View>
                        <View style={{ justifyContent: 'space-around', flex: 2 }}>
                            <Text style={styles.buyerName}>{this.state.dataMaster.Request.Transaction.Fish.name}</Text>
                            <Text>{this.state.dataMaster.Request.Supplier.name}</Text>
                            <Text>{this.state.dataMaster.Request.Transaction.size} Kg</Text>
                            <Text>Rp {numeral(this.state.dataMaster.Request.Transaction.minBudget).format('0,0')} - {numeral(this.state.dataMaster.Request.Transaction.maxBudget).format('0,0')},-/Kg</Text>
                        </View>
                    </ContainerSection>
                </Container>

                <Card>
                    <CardSection>
                        <TouchableWithoutFeedback onPress={() => { this.setState({ requestExpanded: !requestExpanded }); console.log(this.state.requestExpanded, 'Request Klik') }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>Permintaan</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={requestExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </CardSection>
                    {
                        requestExpanded ?
                            <CardSection>
                                <View style={{ flexDirection: 'column' }}>
                                    <View>
                                        <Text>Apakah anda ingin melakukan permintaan sample atau survei nelayan?</Text>
                                    </View>
                                    <View >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <CheckBox
                                                title='Survei'
                                                checked={survey}
                                                onPress={() => this.checkBoxSurvey()}
                                            />
                                            <CheckBox
                                                title='Sample'
                                                checked={sample}
                                                onPress={() => this.checkBoxSample()}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Button
                                            onPress={() => {
                                                this.sendRequest()
                                            }}>
                                            Kirim Permintaan
                                        </Button>
                                    </View>
                                </View>
                            </CardSection>
                            :
                            <View />
                    }
                </Card>

                <Card>
                    <CardSection>
                        <TouchableWithoutFeedback onPress={() => this.setState({ contractExpanded: !contractExpanded })}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>Kontrak</Text>
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} style={{ alignSelf: 'flex-end' }} name={contractExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </CardSection>
                    {
                        contractExpanded ?
                            <CardSection>
                                {
                                    contractNotDone ?
                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Lakukan Kontrak sebelum tanggal 02/02/2018, Lakukan diskusi untuk mempercepat transaksi</Text>
                                            </View>
                                            <View style={{ height: 20 }} />
                                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <Button
                                                        onPress={() => {
                                                            this.createContract()
                                                        }}>
                                                        Buat Kontrak
                                                    </Button>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View />
                                }
                                {
                                    contractDone ?
                                        <View style={{ flexDirection: 'column' }}>
                                            {
                                                contractPending ?
                                                    <View>
                                                        <Text>Anda sudah mengisi formulir kontrak. Status : {this.state.dataMaster.Contract.Status.name}, Lakukan
                                                            diskusi untuk mempercepat transaksi.
                                                        </Text>
                                                    </View>
                                                    :
                                                    <View />
                                            }
                                            {
                                                contractRevision ?
                                                    <View>
                                                        <Text>Anda sudah mengisi formulir kontrak. Status : {this.state.dataMaster.Contract.Status.name}, Nelayan meminta
                                                            revisi kontrak, lakukan diskusi untuk mempercepat transaksi.
                                                        </Text>

                                                        <View>
                                                            <TouchableOpacity onPress={() => Linking.openURL('http://komisiyudisial.go.id/downlot.php?file=Peraturan-KY-Nomor-2-Tahun-2015.pdf').catch(err => console.error('An error occurred', err))}>
                                                                <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                                                    <Text style={{ color: 'blue', marginLeft: 10 }}>fileDummyTest.pdf</Text>
                                                                    <Icon size={20} style={{ color: 'blue', marginLeft: 5 }} name="md-download" />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                                            <View style={{ flex: 1 }}>
                                                                <Button
                                                                    onPress={() => {
                                                                        this.createContractRevision()
                                                                    }}>
                                                                    Revisi Kontrak
                                                            </Button>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View />
                                            }
                                            {
                                                contractApproved ?
                                                    <View>
                                                        <Text>Kontrak ada sudah disetujui oleh nelayan, Silahkan melanjutkan transaksi.
                                                        </Text>

                                                        <View>
                                                            <TouchableOpacity onPress={() => Linking.openURL('http://komisiyudisial.go.id/downlot.php?file=Peraturan-KY-Nomor-2-Tahun-2015.pdf').catch(err => console.error('An error occurred', err))}>
                                                                <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                                                    <Text style={{ color: 'blue', marginLeft: 10 }}>fileDummyTest.pdf</Text>
                                                                    <Icon size={20} style={{ color: 'blue', marginLeft: 5 }} name="md-download" />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View />
                                            }
                                        </View>
                                        :
                                        <View />
                                }
                            </CardSection>
                            :
                            <View />
                    }
                </Card>

                <Card>
                    {
                        dpContainer ?
                            <CardSection>
                                <TouchableWithoutFeedback onPress={() => this.setState({ dpExpanded: !dpExpanded })}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 20 }}>Pembayaran DP</Text>
                                        <View style={{ flex: 1 }}>
                                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={dpExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>

                            </CardSection>
                            :
                            <View />
                    }
                    {
                        dpExpanded ?
                            <CardSection>
                                {
                                    dpNotYet ?

                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Lakukan pembayaran DP sebelum tanggal 27/07/18.</Text>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.000.000</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Button
                                                    onPress={() => {
                                                        this.uploadDownPayment()
                                                    }}>
                                                    Unggah Bukti
                                                </Button>
                                            </View>
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    dpPending ?

                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.500.000</Text>
                                                <Text>Status            	    Menunggu Verifikasi Admin</Text>
                                            </View>
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    dpFailed ?

                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Pembeli telah melakukan pembayaran DP pada tanggal 27/07/18.</Text>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.500.000</Text>
                                                <Text>Sisa Pembayaran	        Rp 1.500.000</Text>
                                                <Text>Tanggal Pembayaran	    02/09/2018</Text>
                                                <Text>Status            	    Pembayaran Ditolak</Text>
                                            </View>
                                        </View>

                                        :
                                        <View />
                                }

                                {
                                    dpApproved ?

                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Pembeli telah melakukan pembayaran DP pada tanggal 27/07/18.</Text>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.500.000</Text>
                                                <Text>Sisa Pembayaran	        Rp 1.500.000</Text>
                                                <Text>Tanggal Pembayaran	    02/09/2018</Text>
                                                <Text>Status            	    Pembayaran Diterima</Text>
                                            </View>
                                        </View>

                                        :
                                        <View />
                                }

                            </CardSection>
                            :
                            <View />
                    }
                </Card>

                <Card>
                    {
                        deliveryContainer ?
                            <CardSection ction>
                                <TouchableWithoutFeedback onPress={() => this.setState({ deliveryExpanded: !deliveryExpanded })}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 20 }}>Penerimaan</Text>
                                        <View style={{ flex: 1 }}>
                                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={deliveryExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </CardSection>
                            :
                            <View />
                    }
                    {
                        deliveryExpanded ?
                            <View>
                                {
                                    deliveryPending ?

                                        <View>
                                            {this.renderReceivingPending()}
                                        </View>
                                        :
                                        <View />
                                }
                                {
                                    deliveryRevision ?

                                        <View>
                                            {this.renderReceivingRevision()}
                                        </View>
                                        :
                                        <View />
                                }
                                {
                                    deliveryApproved ?

                                        <View>
                                            {this.renderReceivingApproved()}
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    deliveryApprovedAdminPending ?

                                        <View>
                                            {this.renderReceivingApprovedAdminPending()}
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    deliveryApprovedAdminRevision ?

                                        <View>
                                            {this.renderReceivingApprovedAdminRevision()}
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    deliveryApprovedAdminApproved ?

                                        <View>
                                            {this.renderReceivingApprovedAdminApproved()}
                                        </View>

                                        :
                                        <View />
                                }

                            </View>
                            :
                            <View />
                    }
                </Card>

                <Card>
                    {
                        paidContainer ?
                            <CardSection>
                                <TouchableWithoutFeedback onPress={() => this.setState({ paidExpanded: !paidExpanded })}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 20 }}>Pelunasan</Text>
                                        <View style={{ flex: 1 }}>
                                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={paidExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </CardSection>
                            :
                            <View />
                    }
                    {
                        paidExpanded ?
                            <View>
                                {
                                    paidNotYet ?
                                        <View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <View>
                                                    <Text>Lakukan Pelunasan Tanggal 20/02/2018</Text>
                                                    <Text>Total Biaya	    	    Rp 5.000.000</Text>
                                                    <Text>Pembayaran DP      	    Rp 2.500.000</Text>
                                                    <Text>Sisa Pembayaran           Rp. 2.500.000</Text>
                                                </View>
                                            </View>

                                            <View style={{ marginTop: 10 }}>
                                                <Button
                                                    onPress={() => {
                                                        this.finalPayments()
                                                    }}>
                                                    Upload Bukti
                                                </Button>
                                            </View>
                                        </View>
                                        :
                                        <View />
                                }
                                 {
                                    paidWaiting ?
                                        <CardSection>
                                            <View style={{ flexDirection: 'column' }}>
                                                <View>
                                                    <Text>Lakukan Pelunasan Tanggal 20/02/2018</Text>
                                                    <Text>Total Biaya	    	    Rp 5.000.000</Text>
                                                    <Text>Pembayaran DP      	    Rp 2.500.000</Text>
                                                    <Text>Sisa Pembayaran           Rp. 2.500.000</Text>
                                                    <Text>Status                    Menunggu Approved Admin</Text>
                                                </View>
                                            </View>
                                        </CardSection>
                                        :
                                        <View />
                                }
                                {
                                    paidRevision ?
                                        <View>
                                            <View style={{ flexDirection: 'column' }}>
                                                <View>
                                                    <Text>Lakukan Pelunasan Tanggal 20/02/2018</Text>
                                                    <Text>Total Biaya	    	    Rp 5.000.000</Text>
                                                    <Text>Pembayaran DP      	    Rp 2.500.000</Text>
                                                    <Text>Sisa Pembayaran           Rp. 2.500.000</Text>
                                                    <Text>Status                    Direvisi</Text>
                                                </View>
                                            </View>

                                            <View style={{ marginTop: 10 }}>
                                                <Button
                                                    onPress={() => {
                                                        this.revisionfinalPayments()
                                                    }}>
                                                    Revision Upload Bukti
                                                </Button>
                                            </View>
                                        </View>
                                        :
                                        <View />
                                }
                                {
                                    paidApproved ?
                                        <CardSection>
                                            <View style={{ flexDirection: 'column' }}>
                                                <View>
                                                    <Text>Lakukan Pelunasan Tanggal 20/02/2018</Text>
                                                    <Text>Total Biaya	    	    Rp 5.000.000</Text>
                                                    <Text>Pembayaran DP      	    Rp 2.500.000</Text>
                                                    <Text>Sisa Pembayaran           Rp. 2.500.000</Text>
                                                    <Text>Status                    Approved Admin</Text>
                                                </View>
                                            </View>
                                        </CardSection>
                                        :
                                        <View />
                                }
                            </View>
                            :
                            <View />
                    }
                </Card>

                <Card>
                    {
                        doneContainer ?
                            <CardSection>
                                <TouchableWithoutFeedback onPress={() => this.setState({ doneExpanded: !doneExpanded })}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 20 }}>Selesai</Text>
                                        <View style={{ flex: 1 }}>
                                            <Icon size={30} style={{ alignSelf: 'flex-end' }} name={doneExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </CardSection>
                            :
                            <View />
                    }
                    {
                        doneExpanded ?
                            <CardSection>
                                {/* <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Rating
                                        imageSize={20}
                                        readonly
                                        startingValue={3.5}
                                    />
                                    <Text style={{ textAlign: 'center' }}>Ini isinya komentar yang dikasih pembeli buat nelayan. bisa suka bisa gasuka</Text>
                                </View> */}
                                <Button
                                    onPress={() => {
                                        this.giveComment()
                                    }}>
                                    Beri Ulasan
                                </Button>
                            </CardSection>
                            :
                            <View />
                    }
                </Card>

                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={() => this.setState({ isModalVisible: false })}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', borderRadius: 2, padding: 10 }}>
                            <Text style={{ textAlign: 'center', marginBottom: 20 }}>Catatan Revisi</Text>
                            <FormInput />
                            <Button
                                onPress={() => {
                                    this.sendRequest()
                                }}>
                                Kirim Permintaan
                            </Button>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        )
    }
}

const styles = {
    thumbnailStyle: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    buyerName: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'black'
    },
    productName: {
        textAlign: 'right',
        fontSize: 18,
        color: '#000'
    },
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15,
        paddingTop: 400
    },
    labelStyle: {
        fontWeight: 'bold',
        flex: 1
    },
    dataStyle: {
        flex: 1
    },
}

export default DetailTransactionPage;
