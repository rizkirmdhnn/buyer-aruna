import React, { Component } from 'react'
import {
    FlatList,
    View,
    Image,
    Text,
    TouchableNativeFeedback,
    AsyncStorage,
    ScrollView,
    Alert
} from 'react-native'
import {
    CardRegistration,
    CardSectionRegistration,
    InputRegistration,
    Button,
    ContainerSection,
    Container,
    Spinner
} from './../components/common';
import { BASE_URL } from './../shared/lb.config';
import axios from 'axios';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';

class RequestFormOrderSecondPage extends Component {

    static navigationOptions = {
        title: 'Create Request Order',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF' }
    }

    constructor(props) {
        super(props);
        this.state = {
            datax: [{}],
            dataSupplier: [{}],
            loading: null,
            checked: true,
            idSupplier: []
        };
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data 1');
        this.setState({ datax: this.props.navigation.state.params.datas });
    }

    componentDidMount() {
        console.log(this.state.datax, 'Data 2');
        this.setState({ loading: true });
        AsyncStorage.getItem('loginCredential', (err, result) => {

            const token = result;
            console.log(token);
            axios.post(`${BASE_URL}/generate-request`, {
                'FishId': this.state.datax.FishId,
                'ProvinceId': this.state.datax.provinsiId,
                'CityId': this.state.datax.cityId,
                'minBudget': this.state.datax.minBudget,
                'maxBudget': this.state.datax.maxBudget
            }, {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    res = response.data.data;
                    console.log(res, 'RES')
                    const result = res;
                    console.log(result, 'Result');
                    this.setState({ dataSupplier: result, loading: false })
                })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    alert('Koneksi internet bermasalah')
                })
        });
    }

    checkBox = (props) => {
        const dataClick = props;
        console.log(dataClick, 'Data Checked');
        this.setState({ checked: !this.state.checked })
    }

    renderLoading = () => {
        if (this.state.loading == true) {
            return <Spinner size="small" />
        } else if (this.state.loading == false) {
            return (
                <View>
                    <FlatList
                        data={[this.state.dataSupplier]}
                        renderItem={({ item }) => this.renderItem(item)}
                    />
                </View>
            );
        }
    }

    onSubmit = () => {
        console.log('Submit Request');
        AsyncStorage.getItem('loginCredential', (err, result) => {
            const token = result;
            const { navigate } = this.props.navigation;
            const dataRequest = new FormData();
            dataRequest.append('FishId', this.state.datax.FishId);
            dataRequest.append('minBudget', this.state.datax.minBudget);
            dataRequest.append('maxBudget', this.state.datax.maxBudget);
            dataRequest.append('dueDate', this.state.datax.datePick);
            dataRequest.append('quantity', this.state.datax.quantity);
            dataRequest.append('size', this.state.datax.size);

            this.state.idSupplier.map((item, index) => {
                console.log(item, ' ', index, 'MAPING');
                dataRequest.append('SupplierIds[' + index + ']', item)
            })

            // dataRequest.append('SupplierIds', this.state.idSupplier);
            dataRequest.append('photo', {
                uri: this.state.datax.photo.uri,
                type: 'image/jpeg',
                name: 'formrequest'
            });

            console.log(this.state.datax, 'Data Request');
            console.log(dataRequest, 'Data Form Append');

            axios.post(`${BASE_URL}/buyer/requests`,
                dataRequest
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': token
                    }
                }).then(response => {
                    res = response.data.data;
                    console.log(response, 'RES');
                    navigate('Request');
                    this.setState({ loading: false });
                })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    console.log(error.response, 'Error nya');
                    console.log(error, 'Error nya');
                    alert(error.message.data)
                    this.setState({ loading: false });
                })
        });

    }

    renderButton = () => {
        const { navigate } = this.props.navigation;
        if (this.state.loading) {
            return <View style={styles.loadingStyle}><Spinner size='large' /></View>
        }

        return (
            <Button
                onPress={
                    () => this.onSubmit()
                }
            >
                Next
			</Button>
        )
    }

    onChangeInput = (name, v) => {
        this.setState({ [name]: v });
        console.log(v);
    }


    renderItem = (item) => {
        console.log(item, 'Item Data Supplier');
        return item.map((data) => {
            console.log(data.User.id, 'ID Supplier');
            this.state.idSupplier.push(data.User.id);
            console.log(this.state.idSupplier, 'ID PUSH SUPPLIER')
            return (
                <View style={styles.itemContainerStyleSupplier}>
                    <View style={styles.thumbnailContainerStyle}>
                        <Image
                            style={styles.thumbnailStyle}
                            source={require('./../assets/image/photo.png')}
                        />
                    </View>
                    <View style={styles.headerContentStyle}>
                        <Text style={styles.hedaerTextStyle}>{data.User.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>500 Kg </Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{data.minBudget}</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{data.maxBudget} </Text>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    checked={this.state.checked}
                                    onPress={() => this.checkBox(data)}
                                />
                            </View>
                        </View>
                    </View>

                </View>
            )
        })

    }


    renderData = (item) => {
        console.log(item, 'Item Data')
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.thumbnailContainerStyle}>
                    <Image
                        style={styles.thumbnailStyle}
                        source={{ uri: this.state.datax.photo.uri }}
                    />
                </View>
                <View style={styles.headerContentStyle}>
                    <Text style={styles.headerTextStyle}>{item.value}</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={styles.titleTextStyle}>{item.quantity} Kg</Text>
                        <Text>Rp. {item.minBudget} - {item.maxBudget}</Text>
                        <Text>Batas Waktu: {item.datePick}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render(props) {

        return (
            <View>
                <FlatList
                    data={[this.state.datax]}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={(item, index) => item.cityId}
                />
                <View style={styles.containerScroll}>
                    <ScrollView
                    >
                        {this.renderLoading()}
                    </ScrollView>
                </View>

                <ContainerSection>
                    {this.renderButton()}
                </ContainerSection>

            </View>
        );
    }
};


const styles = {
    itemContainerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    itemContainerStyleSupplier: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 8
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleTextStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    loadingStyle: {
        marginTop: 30
    },
    containerScroll: {
        marginBottom: 30,
        padding: 10,
        height: 200
    }
}

export default RequestFormOrderSecondPage;