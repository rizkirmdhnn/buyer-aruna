import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Linking, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import numeral from 'numeral'
import axios from 'axios'
import { CheckBox, FormInput, Rating } from 'react-native-elements'
import { Card, Button, CardSection, Container, ContainerSection, Spinner } from '../components/common'
import { BASE_URL } from './../shared/lb.config';

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
            survey: false,
            sample: false,
            dataSurvey: 0,
            dataSample: 0,

            loading: null,
            checked: false,
            isModalVisible: false,

            requestContainer: null,

            contractContainer: null,
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
            paidContainer: null,
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

            axios.get(`${BASE_URL}/buyer/orders/${idTransaction}`, {
                headers: { token }
            })
                .then(response => {
                    console.log(response, 'Data Transaction');
                    this.setState({ dataTransaction: response.data, loading: false });
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

        });
    }

    componentDidMount() {
        console.log(this.state.dataMaster, 'DATA MASTER');

        if (this.state.dataMaster.Contract == null) {
            this.setState({
                contractNotDone: true,
                contractDone: false,
                dpContainer: false,
                deliveryContainer: false,
                paidContainer: false,
                doneContainer: false,
            })
        } else {
            if (this.state.dataMaster.Contract.Status.id === 4) {
                this.setState({
                    contractDone: true,

                    contractPending: true,
                    contractRevision: false,
                    contractApproved: false,

                    dpContainer: false,
                    deliveryContainer: false,
                    paidContainer: false,
                    doneContainer: false,
                })
            }

            if (this.state.dataMaster.Contract.Status.id === 5) {
                this.setState({
                    contractDone: true,

                    contractPending: false,
                    contractRevision: false,
                    contractApproved: true,

                    dpContainer: true,

                    deliveryContainer: false,
                    paidContainer: false,
                    doneContainer: false,
                })
            }

            if (this.state.dataMaster.Contract.Status.id === 6) {
                this.setState({
                    contractDone: true,

                    contractPending: false,
                    contractRevision: true,
                    contractApproved: false,

                    dpContainer: false,
                    dpExpanded: false,

                    deliveryContainer: false,
                    paidContainer: false,
                    doneContainer: false,
                })
            }
        }
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
                        alert('Koneksi internet bermasalah')
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
                        alert('Koneksi internet bermasalah')
                    }
                })


        });
    }


    render() {
        const {
            survey,
            sample,

            requestExpanded,
            contractExpanded,
            dpExpanded,
            deliveryExpanded,
            paidExpanded,
            doneExpanded,
            requestContainer,
            contractContainer,
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
            data } = this.state

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
                                                <Text>Pembeli telah melakukan pembayaran DP pada tanggal 27/07/18.</Text>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.500.000</Text>
                                            </View>
                                        </View>

                                        :
                                        <View />
                                }
                                {
                                    dpPending ?

                                        <View style={{ flexDirection: 'column' }}>
                                            <View>
                                                <Text>Pembeli telah melakukan pembayaran DP pada tanggal 27/07/18.</Text>
                                                <Text>Total Biaya    	        Rp 4.000.000</Text>
                                                <Text>Pembayaran DP		        Rp 2.500.000</Text>
                                                <Text>Sisa Pembayaran	        Rp 1.500.000</Text>
                                                <Text>Tanggal Pembayaran	    02/09/2018</Text>
                                                <Text>Status            	    Diverifikasi Admin</Text>
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
                            <CardSection>
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
                            <CardSection>
                                <View style={{ flexDirection: 'column', flex: 1 }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text>Penerima</Text>
                                            <Text>Nama</Text>
                                            <Text>No. Telp</Text>
                                            <Text>Alamat</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text>Penerima</Text>
                                            <Text>Nama</Text>
                                            <Text>No. Telp</Text>
                                            <Text>Alamat</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        <Button
                                            onPress={() => {
                                                this.sendRequest()
                                            }}>
                                            Komoditas telah diterima
                                        </Button>
                                    </View>
                                </View>
                            </CardSection>
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
                            <CardSection>
                                <View style={{ flexDirection: 'column' }}>
                                    <View>
                                        <Text>Nominal Transfer       	Rp 4.000.000</Text>
                                        <Text>Total Biaya	    	    Rp 2.500.000</Text>
                                        <Text>Tanggal Pembayaran	    Rp 2.500.000</Text>
                                        <Text>Status        	        Pembayaran Diterima</Text>
                                    </View>
                                </View>
                            </CardSection>
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
                                        this.sendRequest()
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
