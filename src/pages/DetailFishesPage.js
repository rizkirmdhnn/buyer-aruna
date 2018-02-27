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
    FlatList
} from 'react-native';
import {
    Input,
    Button,
    ContainerSection,
    Container,
    Spinner,
    Card,
    CardSection
} from './../components/common';
import { BASE_URL, COLOR } from '../shared/lb.config';
import axios from 'axios';


class DetailFishesPage extends Component {

    static navigationOptions = {
        title: 'Detail Ikan',
        headerRight: <View />
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataFish: '',
            tokenUser: '',
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        console.log(params, 'Data Form Order Parsing')

        const idFish = params.datas.id;
        axios.get(`${BASE_URL}/fishes/${idFish}`).then(response => {
            res = response.data.data;
            console.log(res, 'Data Ikan');
            this.setState({ dataFish: res, loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error.response, 'Erroor nya');
                console.log('Error Request Order Get Data');
            })
    }

    createRequest(item) {
        console.log(item, 'Data Ikan Terpilih')
        this.props.navigation.navigate('RequestFormOrderFirst', { dataFish: item})
    }

    render() {
        const { dataFish } = this.state;

        if (this.state.loading) {
            return <Spinner size="large" />
        }
        console.log(dataFish.description);
        return (
            <ScrollView>
                <View style={{ flex: 1, paddingTop: 5 }}>
                    <ContainerSection>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                            <View>
                                <Image
                                    style={styles.thumbnailStyle}
                                    source={{ uri: `${BASE_URL}/images/${dataFish.photo}` }}
                                />
                            </View>
                        </View>
                    </ContainerSection>

                    <Card style={{ borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                        <View style={styles.card}>
                            <ContainerSection>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: 20 }}>{dataFish.name}</Text>
                                </View>
                            </ContainerSection>

                            <ContainerSection>
                                <View style={{ flexDirection: 'column' }}>
                                    <View>
                                        <Text style={{ flex: 1, fontSize: 20 }}>{dataFish.description}</Text>
                                    </View>
                                </View>
                            </ContainerSection>
                        </View>
                    </Card>

                    <Button
                        onPress={() => {
                            this.createRequest(dataFish);
                        }}>
                        Buat Permintaan
                    </Button>
                </View>
            </ScrollView>
        );
    }

}


const styles = {
    thumbnailStyle: {
        height: 290,
        width: 480,
        borderWidth: 1
    },
};

export default DetailFishesPage;
