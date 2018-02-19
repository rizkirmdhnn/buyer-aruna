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
import { Card } from 'react-native-elements';

class RequestFormOrderSecondPage extends Component {

    static navigationOptions = {
        title: 'Pilih Supplier',
        headerStyle: { backgroundColor: '#006AAF' },
        headerTitleStyle: { color: '#FFFFFF', paddingLeft: '25%' }
    }

    constructor(props) {
        super(props);
        this.state = {
            datax: [{}],
            dataSupplier: [{}],
            loading: true,
            loader: null,
            checked: [],
            idSupplier: []
        };
    };

    componentWillMount() {
        console.log(this.props.navigation.state.params.datas, 'Data 1');
        this.setState({ datax: this.props.navigation.state.params.datas });
    }

    componentDidMount() {
        console.log(this.state.datax, 'Data 2');
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
                    console.log(result, 'Result Supplier nya');
                    this.setState({ dataSupplier: result, checked: result, loading: false })
                })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    alert('Koneksi internet bermasalah')
                })
        });
    }

    checkBox = data => {
        const { checked } = this.state;
        if (!checked.includes(data)) {
            this.setState({
                checked: [...checked, data]
            });
        } else {
            this.setState({
                checked: checked.filter(a => a !== data)
            });
        }
    };

    onSubmit = () => {
        console.log('Submit Request');
        this.setState({ loader: true });
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
                dataRequest.append('ProductIds[' + index + ']', item)
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
                    this.setState({ loader: true });
                })
                .catch(error => {
                    console.log(error.message, 'Error nya');
                    console.log(error.response, 'Error nya');
                    console.log(error, 'Error nya');
                    alert(error.message)
                    this.setState({ loader: true });
                })
        });

    }

    renderButton = () => {
        const { navigate } = this.props.navigation;
        if (this.state.loader) {
            return <Spinner size='large' />
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
            console.log(data, 'ID Supplier');
            this.state.idSupplier.push(data.id);
            console.log(this.state.idSupplier, 'ID PUSH SUPPLIER')
            return (
                <Card>
                    <View style={styles.itemContainerStyleSupplier}>
                        <View style={styles.thumbnailContainerStyle}>
                            <Image
                                style={styles.thumbnailStyle}
                                source={{ uri: `${BASE_URL}/images/${data.User.photo}` }}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.headerContentStyle}>
                            <Text style={{ flex: 1, fontWeight: 'bold', color: 'blue'}}>{data.User.name}</Text>
                            <Text style={{ flex: 1 }}>500 Kg </Text>
                            <Text style={{ flex: 1 }}>{data.User.organization}</Text>
                            <Text style={{ flex: 1 }}>{data.minBudget}</Text>
                            <Text style={{ flex: 1 }}>{data.maxBudget} </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                                center
                                checked={this.state.checked}
                                onPress={() => this.checkBox(data)}
                            />
                        </View>
                    </View>
                </Card>
            )
        })

    }

    render() {

        if (this.state.loading) {
            return <Spinner size="large" />
        }

        return (
            <ScrollView>
                <View>
                    <FlatList
                        data={[this.state.dataSupplier]}
                        renderItem={({ item }) => this.renderItem(item)}
                    />

                    <ContainerSection>
                        {this.renderButton()}
                    </ContainerSection>
                </View>
            </ScrollView>
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
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    thumbnailStyle: {
        height: 100,
        width: 100,
        borderRadius: 75
    },
    headerContentStyle: {
        flex: 1,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'column',
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